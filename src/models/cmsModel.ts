import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma/client";
import { contentModel } from "./contentModel";
import type { ContentEntity } from "@/lib/validation";
import { modules } from "@/lib/cms/modules";
import { validateCms } from "@/lib/cms/validation";
import { ConflictError } from "@/lib/http";
const json = (data: unknown) =>
  JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
export async function saveCms(
  entity: ContentEntity,
  id: string | null,
  input: unknown,
  authorId: string,
  draft: boolean,
) {
  let data = validateCms(entity, input);
  const recordId =
    entity === "siteSettings" ? "settings_main" : id || randomUUID();
  if (draft) {
    await prisma.$transaction(async (tx) => {
      await tx.contentDraft.upsert({
        where: { entity_recordId: { entity, recordId } },
        create: { entity, recordId, payload: json(data), authorId },
        update: { payload: json(data), authorId },
      });
      await tx.contentRevision.create({
        data: {
          entity,
          recordId,
          payload: json(data),
          authorId,
          action: "draft",
        },
      });
    });
    return { id: recordId, ...data, draft: true };
  }
  return prisma.$transaction(async (tx) => {
    const existing = id
      ? await contentModel.findById<Record<string, unknown> & { id: string }>(
          entity,
          id,
        )
      : null;
    if (existing)
      data = {
        ...Object.fromEntries(
          modules[entity].fields
            .filter(
              (f) => existing[f.key] !== undefined && existing[f.key] !== null,
            )
            .map((f) => [f.key, existing[f.key]]),
        ),
        ...data,
      };
    if (
      entity === "banners" &&
      !existing &&
      (await prisma.banner.count()) >= 10
    )
      throw new ConflictError("Maximum 10 diapositives.");
    if (
      data.programExternalId &&
      !(await tx.program.findFirst({
        where: { externalId: String(data.programExternalId), deletedAt: null },
      }))
    )
      throw new ConflictError("Programme associé introuvable.");
    const referenced = modules[entity].fields.flatMap((field) =>
      field.type === "image" && typeof data[field.key] === "string"
        ? [String(data[field.key])]
        : field.type === "gallery" && Array.isArray(data[field.key])
          ? (data[field.key] as { url: string }[]).map((p) => p.url)
          : [],
    );
    for (const url of referenced.filter((url) =>
      url.startsWith("/api/media/"),
    )) {
      if (!(await tx.media.findFirst({ where: { fileUrl: url } })))
        throw new ConflictError(
          "Un média référencé a été supprimé. Choisissez une image disponible.",
        );
    }
    const payload =
      entity === "siteSettings"
        ? data
        : { ...data, authorExternalId: authorId };
    const item = existing
      ? await contentModel.update(entity, recordId, payload)
      : await contentModel.create(entity, { ...payload, id: recordId });
    // Preserve a full immutable snapshot, including publication transitions.
    if (entity === "articles" || entity === "programs") {
      const photos = Array.isArray(data.gallery)
        ? (data.gallery as {
            url: string;
            captionFr?: string;
            captionEn?: string;
          }[])
        : [];
      if (entity === "articles") {
        const article = await tx.article.findUniqueOrThrow({
          where: { externalId: recordId },
        });
        const author = await tx.user.findUnique({
          where: { externalId: authorId },
        });
        const program = data.programExternalId
          ? await tx.program.findUnique({
              where: { externalId: String(data.programExternalId) },
            })
          : null;
        await tx.article.update({
          where: { id: article.id },
          data: {
            authorId: article.authorId ?? author?.id,
            programId: program?.id ?? null,
          },
        });
        await tx.articleImage.deleteMany({ where: { articleId: article.id } });
        if (photos.length)
          await tx.articleImage.createMany({
            data: photos.map((photo, i) => ({
              ...photo,
              articleId: article.id,
              displayOrder: i,
            })),
          });
      } else {
        const program = await tx.program.findUniqueOrThrow({
          where: { externalId: recordId },
        });
        await tx.programImage.deleteMany({ where: { programId: program.id } });
        if (photos.length)
          await tx.programImage.createMany({
            data: photos.map((photo, i) => ({
              ...photo,
              programId: program.id,
              displayOrder: i,
            })),
          });
      }
    }
    await tx.contentRevision.create({
      data: {
        entity,
        recordId,
        payload: json(data),
        authorId,
        action: existing ? "update" : "create",
      },
    });
    await tx.contentDraft.deleteMany({ where: { entity, recordId } });
    return item;
  });
}
