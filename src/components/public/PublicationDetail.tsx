import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { getPublicSite, local } from "@/lib/public/cms";
import { prisma } from "@/models/prisma/client";
import { Gallery, PublicationCards } from "./Editorial";
export default async function PublicationDetail({
  slug,
  kind,
}: {
  slug: string;
  kind: "articles" | "programmes";
}) {
  const site = await getPublicSite();
  const { lang } = site;
  const item = (kind === "articles" ? site.articles : site.programs).find(
    (x) => x.slug === slug,
  );
  if (!item) notFound();
  const record =
    kind === "articles"
      ? await prisma.article.findUnique({
          where: { externalId: item.id },
          include: { photos: { orderBy: { displayOrder: "asc" } } },
        })
      : await prisma.program.findUnique({
          where: { externalId: item.id },
          include: { photos: { orderBy: { displayOrder: "asc" } } },
        });
  const related = site.articles
    .filter(
      (x) =>
        x.id !== item.id &&
        (kind === "articles"
          ? x.category === item.category
          : x.programExternalId === item.id),
    )
    .slice(0, 3);
  return (
    <>
      <Header language={lang} />
      <main className="public-page">
        <article className="editorial-container">
          <a
            className="admin-text-link"
            href={kind === "articles" ? "/journal" : "/programmes"}
          >
            ← {kind === "articles" ? "Journal" : "Programmes"}
          </a>
          <p className="admin-eyebrow mt-10">
            {String(item.category || item.pillarId || "ACV")}
          </p>
          <h1 className="editorial-title">{local(item, "title", lang)}</h1>
          <p className="editorial-lead">
            {local(item, kind === "articles" ? "excerpt" : "summary", lang)}
          </p>
          {kind === "articles" ? (
            <p>
              {item.publishedAt
                ? new Date(String(item.publishedAt)).toLocaleDateString(lang, {
                    timeZone: String(
                      site.settings.timezone || "Africa/Lubumbashi",
                    ),
                  })
                : ""}{" "}
              {item.author ? ` · ${item.author}` : ""}
            </p>
          ) : (
            <p>
              {String(item.location || "")} · {item.activityDate?new Date(String(item.activityDate)).toLocaleDateString("fr-FR"):""}
            </p>
          )}
          {!!(item.coverImage || item.imageUrl) && (
            <img
              className="editorial-image"
              src={String(item.coverImage || item.imageUrl)}
              alt=""
            />
          )}
          <div className="editorial-prose">
            {local(item, kind === "articles" ? "content" : "description", lang)
              .split("\n\n")
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
          {kind === "programmes" &&
            ["objectivesText", "activitiesText"].map((key) => (
              <section key={key} className="editorial-section">
                <h2>
                  {key === "objectivesText"
                    ? lang === "fr"
                      ? "Objectifs"
                      : "Objectives"
                    : lang === "fr"
                      ? "Activités"
                      : "Activities"}
                </h2>
                <p className="whitespace-pre-wrap">{local(item, key, lang)}</p>
              </section>
            ))}
          <Gallery photos={record?.photos ?? []} lang={lang} />
          {!!related.length && (
            <section className="editorial-section">
              <h2>{lang === "fr" ? "À lire également" : "Related stories"}</h2>
              <PublicationCards items={related} kind="articles" lang={lang} />
            </section>
          )}
          {kind === "programmes" && (
            <a href="/contact" className="admin-button">
              {lang === "fr" ? "Soutenir ce programme" : "Support this program"}{" "}
              →
            </a>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
