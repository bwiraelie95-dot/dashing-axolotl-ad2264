import { type Item, type Language, local, getSettings } from "@/lib/public/cms";
export function ContentSection({
  item,
  lang,
  heading = "h2",
}: {
  heading?: "h1" | "h2";
  item: Item | undefined;
  lang: Language;
}) {
  if (!item) return null;
  const Heading = heading;
  return (
    <section
      id={String(item.slug)}
      className="editorial-section reveal-on-scroll"
    >
      <div className="editorial-heading">
        <p className="admin-eyebrow">AFRICA COMMUNITY VILLAGE</p>
        <Heading className={heading === "h1" ? "editorial-title" : undefined}>
          {local(item, "title", lang)}
        </Heading>
        {local(item, "subtitle", lang) && (
          <p className="editorial-lead">{local(item, "subtitle", lang)}</p>
        )}
      </div>
      {!!item.coverImage && (
        <img className="editorial-image" src={String(item.coverImage)} alt="" />
      )}
      <div className="editorial-prose">
        {local(item, "content", lang)
          .split("\n\n")
          .filter(Boolean)
          .map((p, i) => (
            <p key={i}>{p}</p>
          ))}
      </div>
      {item.villageCouncilVerified === true && !!item.verificationSource && (
        <p className="admin-note">
          {lang === "fr"
            ? "Vérifié par les conseils de village"
            : "Verified by village councils"}{" "}
          · {String(item.verificationSource)}
        </p>
      )}
      {!!item.buttonUrl && (
        <a className="admin-button" href={String(item.buttonUrl)}>
          {local(item, "buttonText", lang) ||
            (lang === "fr" ? "Découvrir" : "Discover")}{" "}
          →
        </a>
      )}
    </section>
  );
}
export async function PublicationCards({
  items,
  kind,
  lang,
}: {
  items: Item[];
  kind: "articles" | "programmes";
  lang: Language;
}) {
  const settings = await getSettings();
  return items.length ? (
    <div className="publication-grid">
      {items.map((item) => (
        <article key={item.id} className="publication-card reveal-on-scroll">
          {!!(item.coverImage || item.imageUrl) && (
            <a href={`/${kind}/${item.slug}`} tabIndex={-1} aria-hidden="true">
              <img
                src={String(item.coverImage || item.imageUrl)}
                alt=""
                loading="lazy"
              />
            </a>
          )}
          <div className="publication-body">
            <p className="admin-eyebrow">
              {String(
                item.category ||
                  (
                    {
                      "education-youth": "Éducation & jeunesse",
                      "environment-nature": "Environnement",
                      "sustainable-agriculture": "Agriculture durable",
                      "community-health": "Santé communautaire",
                      "socio-economic-empowerment": "Autonomisation",
                    } as Record<string, string>
                  )[String(item.pillarId)] ||
                  "ACV",
              )}
            </p>
            <h3>
              <a href={`/${kind}/${item.slug}`}>{local(item, "title", lang)}</a>
            </h3>
            {!!(item.publishedAt || item.activityDate) && (
              <time dateTime={String(item.publishedAt || item.activityDate)}>
                {new Date(
                  String(item.publishedAt || item.activityDate),
                ).toLocaleDateString(lang, {
                  timeZone: String(settings.timezone || "Africa/Lubumbashi"),
                })}
              </time>
            )}
            <p>
              {local(item, kind === "articles" ? "excerpt" : "summary", lang)}
            </p>
            <a className="admin-text-link" href={`/${kind}/${item.slug}`}>
              {lang === "fr"
                ? kind === "articles"
                  ? "Lire l’article"
                  : "Découvrir le programme"
                : "Read more"}{" "}
              →
            </a>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <p className="editorial-empty">
      {lang === "fr"
        ? "Les publications seront disponibles ici dès leur validation."
        : "Publications will appear here once approved."}
    </p>
  );
}
export function Gallery({
  photos,
  lang,
}: {
  photos: { url: string; captionFr: string | null; captionEn: string | null }[];
  lang: Language;
}) {
  return (
    <div className="publication-gallery">
      {photos.map((photo, i) => (
        <figure key={i}>
          <a href={photo.url} target="_blank" rel="noopener noreferrer">
            <img
              src={photo.url}
              alt={local(photo, "caption", lang)}
              loading="lazy"
            />
          </a>
          {local(photo, "caption", lang) && (
            <figcaption>{local(photo, "caption", lang)}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
