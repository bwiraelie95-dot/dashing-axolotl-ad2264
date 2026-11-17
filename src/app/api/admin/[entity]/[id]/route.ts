import { saveCms } from "@/models/cmsModel";
import { modules } from "@/lib/cms/modules";
import { prisma } from "@/models/prisma/client";
import { requirePermission } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  ForbiddenError,
  requireAdmin,
  requireContentEditor,
  requireSuperAdmin,
} from "@/lib/auth";
import {
  apiError,
  getRequestIp,
  MethodNotAllowedError,
  ConflictError,
} from "@/lib/http";
import {
  adminEntitySchema,
  adminUserPatchSchema,
  bannerPatchSchema,
  contactSubmissionPatchSchema,
  entityPayloadSchema,
  idSchema,
  siteSettingsPatchSchema,
} from "@/lib/validation";
import { contentModel } from "@/models/contentModel";
import { deleteStoredMedia } from "@/models/mediaModel";
import { userModel } from "@/models/userModel";
import { logAuditAction } from "@/models/auditModel";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ entity: string; id: string }>;
}

async function routeParameters(context: RouteContext) {
  const params = await context.params;
  return {
    entity: adminEntitySchema.parse(params.entity),
    id: idSchema.parse(params.id),
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { entity, id } = await routeParameters(context);
    await requirePermission(request, entity, "read");
    const item =
      entity === "users"
        ? await userModel.findById(id)
        : await contentModel.findById(entity, id);
    if (!item)
      return NextResponse.json(
        { success: false, error: "Élément introuvable." },
        { status: 404 },
      );
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { entity, id } = await routeParameters(context);
    const actor = await requirePermission(request, entity, "update");
    if (["auditLogs", "media", "donors"].includes(entity))
      throw new MethodNotAllowedError();
    const body: unknown = await request.json();
    const payload: Record<string, unknown> =
      entity === "users"
        ? adminUserPatchSchema.parse(body)
        : entity === "banners"
          ? bannerPatchSchema.parse(body)
          : entity === "contactSubmissions"
            ? contactSubmissionPatchSchema.parse(body)
            : entity === "siteSettings"
              ? siteSettingsPatchSchema.parse(body)
              : entityPayloadSchema.parse(body);
    if (
      entity === "users" &&
      actor.id === id &&
      payload.role &&
      payload.role !== "super-admin"
    ) {
      throw new ForbiddenError(
        "Vous ne pouvez pas retirer votre propre rôle super-administrateur.",
      );
    }
    const current =
      entity !== "users" && modules[entity]
        ? await contentModel.findById<Record<string, unknown> & { id: string }>(
            entity,
            id,
          )
        : null;
    const merged = current
      ? Object.fromEntries(
          modules[entity].fields
            .filter((f) => current[f.key] !== undefined)
            .map((f) => [f.key, current[f.key]]),
        )
      : {};
    const item =
      entity === "users"
        ? await userModel.update(id, payload)
        : modules[entity]
          ? await saveCms(
              entity,
              id,
              { ...merged, ...payload },
              actor.id,
              false,
            )
          : await contentModel.update(entity, id, payload);
    if (!item)
      return NextResponse.json(
        { success: false, error: "Élément introuvable." },
        { status: 404 },
      );

    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      "update",
      entity,
      `Mise à jour dans ${entity} : ${id}.`,
      id,
      getRequestIp(request),
    );
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { entity, id } = await routeParameters(context);
    const actor = await requirePermission(request, entity, "delete");
    if (["auditLogs", "siteSettings", "donors"].includes(entity))
      throw new MethodNotAllowedError();
    const result = await prisma.$transaction(async () => {
      if (entity === "users") {
        if (actor.id === id)
          throw new ForbiddenError(
            "Vous ne pouvez pas supprimer votre propre compte.",
          );
        const target = await userModel.findById(id);
        if (target?.role === "super-admin")
          throw new ForbiddenError(
            "Un compte Super Admin ne peut pas être supprimé ici.",
          );
      }
      const media =
        entity === "media"
          ? await contentModel.findById<
              Record<string, unknown> & { id: string }
            >("media", id)
          : null;
      if (media) {
        const mediaUrl = String(media.url ?? media.fileUrl);
        const collections = await Promise.all(
          [
            "pages",
            "banners",
            "articles",
            "programs",
            "team",
            "siteSettings",
            "partners",
            "testimonials",
            "founders",
            "fieldStaff",
            "governance",
            "policies",
            "fieldNotes",
          ].map((entity) => contentModel.list(entity as "pages")),
        );
        const [
          drafts,
          revisions,
          users,
          deletedArticles,
          deletedPrograms,
          deletedTeam,
        ] = await Promise.all([
          prisma.contentDraft.findMany(),
          prisma.contentRevision.findMany(),
          userModel.list(),
          contentModel.listDeleted("articles"),
          contentModel.listDeleted("programs"),
          contentModel.listDeleted("team"),
        ]);
        if (
          JSON.stringify([
            ...collections,
            drafts,
            revisions,
            users,
            deletedArticles,
            deletedPrograms,
            deletedTeam,
          ]).includes(mediaUrl)
        )
          throw new ConflictError(
            "Ce média est référencé dans un contenu, un brouillon ou son historique.",
          );
      }
      const deleted =
        entity === "users"
          ? await userModel.delete(id)
          : await contentModel.delete(entity, id);
      if (deleted)
        await logAuditAction(
          { userName: actor.name, userEmail: actor.email },
          "delete",
          entity,
          `Suppression dans ${entity} : ${id}.`,
          id,
          getRequestIp(request),
        );
      return { deleted, media };
    });
    if (!result.deleted)
      return NextResponse.json(
        { success: false, error: "Élément introuvable." },
        { status: 404 },
      );
    if (result.media)
      await deleteStoredMedia(result.media.url ?? result.media.fileUrl).catch(
        (error) => console.error("[ACV media cleanup]", error),
      );
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
