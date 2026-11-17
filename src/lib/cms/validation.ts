import { z } from "zod";
import { modules, pillars } from "./modules";
export function safeLink(value: string) {
  if (!value) return true;
  if (/[\\\r\n]/.test(value)) return false;
  if (/^\/(?!\/)/.test(value)) return true;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function validateCms(entity: string, input: unknown) {
  if (!modules[entity]) throw new Error("Module inconnu.");
  const shape: Record<string, z.ZodType> = {};
  for (const field of modules[entity].fields) {
    let schema: z.ZodType =
      field.type === "checkbox"
        ? z.boolean()
        : field.type === "number"
          ? z.coerce.number().finite().min(0).max(1e9)
          : field.type === "gallery"
            ? z
                .array(
                  z.object({
                    url: z.string().min(1).max(2048).refine(safeLink),
                    captionFr: z.string().max(500).optional(),
                    captionEn: z.string().max(500).optional(),
                  }),
                )
                .max(30)
            : field.type === "select"
              ? z.enum(field.options as [string, ...string[]])
              : z
                  .string()
                  .trim()
                  .max(
                    field.type === "textarea"
                      ? 100000
                      : field.type === "image" || /Url$|Link$/.test(field.key)
                        ? 2048
                        : 191,
                  );
    if (field.required && field.type !== "number")
      schema = schema.refine((v) => typeof v === "string" && v.length > 0, {
        message: `${field.label} requis.`,
      });
    if (field.type === "image" || /Url$|Link$/.test(field.key))
      schema = schema.refine((v) => typeof v === "string" && safeLink(v), {
        message: "Lien invalide.",
      });
    shape[field.key] = field.required ? schema : schema.optional();
  }
  let data = z.object(shape).strict().parse(input) as Record<string, unknown>;
  if (
    data.status === "published" &&
    !String(data.titleFr || "").trim() &&
    !String(data.titleEn || "").trim()
  )
    throw new z.ZodError([
      {
        code: "custom",
        path: ["titleFr"],
        message: "Un titre est requis pour publier.",
      },
    ]);
  if (entity === "banners")
    data = {
      ...data,
      pageRoute: "/",
      imageUrl: data.imageUrl || "",
      titleFr: data.titleFr || "",
      titleEn: data.titleEn || "",
    };
  if (["articles", "programs", "pages"].includes(entity)) {
    z.string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(150)
      .parse(data.slug);
    if (entity === "pages") data.route = "/" + data.slug;
  }
  if(data.activityDate)z.iso.date().parse(data.activityDate);
  if (data.publishedDate) z.iso.date().parse(data.publishedDate);
  if (entity === "programs")
    z.enum(pillars as [string, ...string[]]).parse(data.pillarId);
  if (entity === "stats") {
    z.coerce.number().int().min(0).max(1e9).parse(data.value);
    if (data.verified && !String(data.source || "").trim())
      throw new z.ZodError([
        {
          code: "custom",
          path: ["source"],
          message: "Une source de vérification est requise.",
        },
      ]);
    data.displayPage = "home";
    data.value = String(data.value);
  }
  if (
    data.villageCouncilVerified &&
    !String(data.verificationSource || "").trim()
  )
    throw new z.ZodError([
      {
        code: "custom",
        path: ["verificationSource"],
        message: "Documentez la vérification avant de l’afficher.",
      },
    ]);
  if (data.primaryColor)
    z.string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .parse(data.primaryColor);
  if (entity === "siteSettings" && data.email) z.email().parse(data.email);
  if (entity === "siteSettings" && data.coordinatesVerified) {
    z.string()
      .trim()
      .min(1)
      .refine(
        (v) =>
          Number.isFinite(Number(v)) && Number(v) >= -90 && Number(v) <= 90,
      )
      .parse(data.latitude);
    z.string()
      .trim()
      .min(1)
      .refine(
        (v) =>
          Number.isFinite(Number(v)) && Number(v) >= -180 && Number(v) <= 180,
      )
      .parse(data.longitude);
  }
  if (entity === "siteSettings" && data.bannerSpeedMs !== undefined)
    z.coerce.number().int().min(3000).max(600000).parse(data.bannerSpeedMs);
  if (data.timezone) {
    try {
      new Intl.DateTimeFormat("fr", {
        timeZone: String(data.timezone),
      }).format();
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          path: ["timezone"],
          message: "Fuseau horaire IANA invalide.",
        },
      ]);
    }
  }
  return data;
}
