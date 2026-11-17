import path from "node:path";
import { randomUUID } from "node:crypto";
import { putMedia, removeMedia } from "@/lib/media-storage";
import { prisma } from "@/models/prisma/client";
import { contentModel } from "@/models/contentModel";

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".mp4",
  ".gif",
]);
const maxFileSize = 25 * 1024 * 1024;
const mediaStoreName = "acv-media";
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

function safeBaseName(name: string) {
  return (
    path
      .basename(name, path.extname(name))
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 100) || "media"
  );
}

function matchesSignature(extension: string, bytes: Uint8Array) {
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end));
  if (extension === ".jpg" || extension === ".jpeg")
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (extension === ".png")
    return (
      bytes.length >= 8 &&
      bytes
        .slice(0, 8)
        .every(
          (value, index) =>
            value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index],
        )
    );
  if (extension === ".webp")
    return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (extension === ".gif")
    return ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a";
  if (extension === ".pdf") return ascii(0, 5) === "%PDF-";
  if (extension === ".mp4") return ascii(4, 8) === "ftyp";
  return false;
}

export async function saveMediaFiles(files: File[], authorId?: string) {
  return Promise.all(
    files.map(async (file) => {
      const extension = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.has(extension))
        throw new Error(`Format non autorisé : ${extension || "inconnu"}.`);
      if (file.size > maxFileSize)
        throw new Error(`Le fichier ${file.name} dépasse la limite de 25 Mo.`);
      if (file.size === 0) throw new Error(`Le fichier ${file.name} est vide.`);

      const filename = `${safeBaseName(file.name)}_${randomUUID()}${extension}`;
      const data = await file.arrayBuffer();
      if (!matchesSignature(extension, new Uint8Array(data).slice(0, 16))) {
        throw new Error(
          `Le contenu du fichier ${file.name} ne correspond pas à son extension.`,
        );
      }
      await putMedia(filename, data, {
        contentType: contentTypes[extension],
        originalName: file.name,
        size: file.size,
      });

      const type =
        extension === ".pdf" ? "pdf" : extension === ".mp4" ? "video" : "image";
      try {
        const media = await contentModel.create("media", {
          title: file.name,
          filename,
          url: `/api/media/${encodeURIComponent(filename)}`,
          type,
          mimeType: contentTypes[extension],
          sizeBytes: file.size,
          altTextEn: file.name,
          altTextFr: file.name,
        });
        if (authorId) {
          const author = await prisma.user.findUnique({
            where: { externalId: authorId },
          });
          if (author)
            await prisma.media.update({
              where: { externalId: media.id },
              data: { uploadedBy: author.id },
            });
        }
        return media;
      } catch (error) {
        await removeMedia(filename).catch(() => undefined);
        throw error;
      }
    }),
  );
}

export async function deleteStoredMedia(fileUrl: unknown) {
  if (typeof fileUrl !== "string" || !fileUrl.startsWith("/api/media/")) return;
  const key = decodeURIComponent(fileUrl.slice("/api/media/".length));
  if (!key || key.includes("/") || key.includes("\\")) return;
  await removeMedia(key);
}
