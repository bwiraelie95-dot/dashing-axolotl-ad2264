import { withContactDefaults } from "./contact-defaults";
import { cache } from "react";
import { cookies } from "next/headers";
import { contentModel } from "@/models/contentModel";
import { prisma } from "@/models/prisma/client";
import { modules } from "@/lib/cms/modules";
export type Item = Record<string, unknown> & { id: string };
export type Language = "fr" | "en";
export const getLanguage = cache(async (): Promise<Language> => {
  const preference = (await cookies()).get("acv-language")?.value;
  if (preference === "fr" || preference === "en") return preference;
  return (await getSettings()).defaultLanguage === "en" ? "en" : "fr";
});
export function local(
  item: Record<string, unknown> | undefined,
  key: string,
  lang: Language,
) {
  return String(
    item?.[key + (lang === "en" ? "En" : "Fr")] ||
      item?.[key + (lang === "en" ? "Fr" : "En")] ||
      "",
  );
}
export const getSettings = cache(async () => {
  const allowed = new Set(modules.siteSettings.fields.map((f) => f.key));
  const rows = await prisma.setting.findMany({ where: { isPublic: true } });
  return withContactDefaults(Object.fromEntries(
    rows
      .filter((r) => allowed.has(r.settingKey))
      .map((r) => [r.settingKey, r.settingValue]),
  ) as Record<string, unknown>);
});
export const getPublicSite = cache(async () => {
  const [
    settings,
    pageResults,
    bannerResults,
    programResults,
    articleResults,
    team,
    statResults,
    lang,
  ] = await Promise.all([
    getSettings(),
    contentModel.list<Item>("pages", { status: "published" }),
    contentModel.list<Item>("banners", {
      active: true,
      pageRoute: "/",
      limit: 10,
    }),
    contentModel.list<Item>("programs", { status: "published" }),
    contentModel.list<Item>("articles", { status: "published" }),
    contentModel.list<Item>("team", { status: "visible" }),
    contentModel.list<Item>("stats", { status: "active" }),
    getLanguage(),
  ]);
  const pages = pageResults;
  const banners = bannerResults;
  const programs = programResults;
  const articles = articleResults;
  const publishedArticles = articles
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  const publishedPrograms = programs;
  const homeStats = statResults;
  const verified = homeStats.filter(
    (x) =>
      x.verified === true && !!x.source && !!x.period,
  );
  const global = verified
    .filter((x) => x.scope === "global")
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
  return {
    lang,
    settings,
    pages,
    banners: banners
      .filter(
        (x) =>
          x.pageRoute === "/" &&
          x.status === "published" &&
          x.active === true &&
          (!x.startDate ||
            new Date(String(x.startDate)).getTime() <= Date.now()) &&
          (!x.endDate || new Date(String(x.endDate)).getTime() >= Date.now()),
      )
      .slice(0, 10),
    programs: publishedPrograms,
    articles: publishedArticles,
    team,
    homeStats,
    stats: verified,
    counts: {
      articles: publishedArticles.length,
      programs: publishedPrograms.length,
      beneficiaries: global ? Number(global.value) : null,
      period: global ? String(global.period) : "",
    },
  };
});
