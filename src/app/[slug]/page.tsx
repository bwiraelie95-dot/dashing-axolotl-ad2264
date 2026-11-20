import PagePhotos from "@/components/public/PagePhotos";
import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ScrollEffects from "@/components/home/ScrollEffects";
import ContactForm from "@/components/public/ContactForm";
import { contentModel } from "@/models/contentModel";
import { pages as fallback } from "@/lib/public/pages";
import { PublicationCards } from "@/components/public/Editorial";
import { getLanguage, getSettings, local } from "@/lib/public/cms";
export const dynamic = "force-dynamic";
type Item = Record<string, unknown> & { id: string };
const text = (v: unknown) => String(v || "");
const photos = [
  "/assets/images/acv_hero_youth_community_1792692599382.jpg",
  "/assets/images/acv_hero_tree_planting_1792692600143.jpg",
];
const fallbackTitles: Record<string, string> = {
  "notre-histoire": "Our story",
  "notre-equipe": "Our team",
  programmes: "Our programs",
  "notre-approche": "Our approach",
  journal: "Journal",
  contact: "Contact",
};
const fallbackIntros: Record<string, string> = {
  "notre-histoire": "Born in Goma. Built to last.",
  "notre-equipe": "Meet the people behind Africa Community Village.",
  programmes: "Five pillars, one community-led model.",
  "notre-approche": "Building with communities.",
  journal: "Stories and updates from our work.",
  contact: "Questions, ideas, or a partnership? Get in touch.",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const language = await getLanguage();
  return {
    title: `${(language === "en"
      ? fallbackTitles[slug] || fallback[slug]?.title
      : fallback[slug]?.title) || "ACV"} — Africa Community Village`,
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const language = await getLanguage();
  const english = language === "en";
  const current = Math.max(
    1,
    Math.floor(Number((await searchParams).page) || 1),
  );
  if (!fallback[slug]) notFound();
  const [sections, team, programs, articles, settings] = await Promise.all([
    contentModel.list<Item>("pages"),
    contentModel.list<Item>("team"),
    contentModel.list<Item>("programs"),
    contentModel.list<Item>("articles"),
    getSettings(),
  ]);
  const s = settings;
  const section = (key: string) =>
    sections.find((p) => p.slug === key && p.status === "published");
  const block = (key: string, withPhoto = true) => {
    const p = section(key);
    return p ? (
      <article className="story-block" key={key} data-reveal>
        <p className="section-kicker">
          AFRICA COMMUNITY VILLAGE
        </p>
        <h2>{local(p, "title", language)}</h2>
        {!!local(p, "subtitle", language) && (
          <h3>{local(p, "subtitle", language)}</h3>
        )}
        {withPhoto && !!p.coverImage && <img src={text(p.coverImage)} alt={local(p, "title", language)} className="story-photo" loading="lazy" />}
        <p>{local(p, "content", language)}</p>
        {withPhoto && <PagePhotos item={p} language={language} />}
        {!!p.buttonUrl && (
          <a className="admin-text-link" href={text(p.buttonUrl)}>
            {local(p, "buttonText", language)} →
          </a>
        )}
      </article>
    ) : null;
  };
  const isHistory = slug === "notre-histoire",
    isApproach = slug === "notre-approche",
    isTeam = slug === "notre-equipe",
    isPrograms = slug === "programmes",
    isJournal = slug === "journal";
  const intro = section(isHistory ? "about" : isApproach ? "approach" : slug);
  const restoration = section("goma-restoration");
  const restorationGallery = Array.isArray(restoration?.gallery)
    ? restoration.gallery.filter(
        (
          photo,
        ): photo is { url: string; captionFr?: string; captionEn?: string } =>
          typeof photo === "object" &&
          photo !== null &&
          "url" in photo &&
          typeof photo.url === "string" && !!local(photo, "caption", language).trim() && photo.url !== restoration?.coverImage,
      )
    : [];
  const pageSize = isPrograms ? 9 : 10;
  const backgroundImages: Record<string, string> = {
    "notre-histoire": photos[0],
    "notre-equipe":
      "/assets/images/acv_hero_education_skills_1792692599936.jpg",
    programmes: "/assets/images/acv_hero_food_security_1792692600374.jpg",
    "notre-approche": photos[1],
    journal: "/assets/images/acv_hero_education_skills_1792692599936.jpg",
  };
  const background = text(intro?.coverImage) || backgroundImages[slug] || "";
  const items = (isJournal ? articles : programs)
    .filter((i) => i.status === "published")
    .sort((a, b) =>
      text(b.activityDate || b.publishedAt || b.createdAt).localeCompare(
        text(a.activityDate || a.publishedAt || a.createdAt),
      ),
    );
  return (
    <>
      <Header language={language} />
      <ScrollEffects />
      <main className={`public-page interior ${isApproach ? "approach-page" : ""}`}>
        <div
          className={`interior-intro ${background ? "page-photo-hero" : ""}`}
        >
          {background && (
            <img
              className="page-hero-photo"
              src={background}
              alt=""
              fetchPriority="high"
            />
          )}
          <div className="page-hero-copy">
            <a className="section-kicker" href="/">
              {english ? "HOME" : "ACCUEIL"} /{" "}
              {english ? fallbackTitles[slug] || fallback[slug].title : fallback[slug].title}
            </a>
            <h1>
              {local(intro, "title", language) ||
                (english ? fallbackTitles[slug] || fallback[slug].title : fallback[slug].title)}
            </h1>
            <p>
              {local(intro, "subtitle", language) ||
                (english ? fallbackIntros[slug] || fallback[slug].intro : fallback[slug].intro)}
            </p>
            <span className="intro-rule" />
          </div>
        </div>
        <div className="interior-body">
          <PagePhotos item={intro} language={language} />
          {isHistory && (
            <>
              <div className="story-split">
                <div>
                  <p className="section-kicker">{english ? "OUR ROOTS" : "NOTRE ANCRAGE"}</p>
                  <h2>
                  {english ? "Born in Goma." : "Nés à Goma."}
                  <br />
                  {english ? "Committed to tomorrow." : "Engagés pour demain."}
                  </h2>
                </div>
                <div className="story-copy">
                  <p>{local(intro, "content", language)}</p>
                  <p>
                    {english
                      ? "We connect our five areas of work to build lasting solutions with communities in eastern DRC. Young people, women, and local knowledge are central to this approach."
                      : "Nous relions nos cinq domaines d’intervention pour construire des réponses durables avec les communautés de l’Est de la RDC. Les jeunes, les femmes et les savoirs locaux occupent une place centrale dans cette démarche."}
                  </p>
                </div>
              </div>
              <div className="story-two">
                {block("vision")}
                {block("mission")}
              </div>
              <section className="values-section">
                <p className="section-kicker">
                  {english ? "WHAT GUIDES US" : "CE QUI NOUS GUIDE"}
                </p>
                <h2>
                  {english
                    ? "Values that lead to action."
                    : "Des valeurs qui deviennent des actes."}
                </h2>
                <div className="values-cards">
                  {Array.from({ length: 8 }, (_, i) => {
                    const p = section("value-" + (i + 1));
                    return p ? (
                      <article key={i} data-reveal>
                        {!!p.coverImage && <img src={text(p.coverImage)} alt="" className="w-full rounded-xl mb-4" loading="lazy" />}
                        <span>0{i + 1}</span>
                        <h3>{local(p, "title", language)}</h3>
                        <p>{local(p, "content", language)}</p>
                      </article>
                    ) : null;
                  })}
                </div>
              </section>
              <div className="interior-callout">
                <h2>
                  {english
                    ? "A vision carried by people."
                    : "Une vision portée par des personnes."}
                </h2>
                <a className="admin-button" href="/notre-equipe">
                  {english ? "Meet our team →" : "Rencontrer notre équipe →"}
                </a>
              </div>
            </>
          )}
          {isTeam &&
            ["ExecutiveCouncil", "Staff"].map((group) => (
              <section className="team-section" key={group}>
                <p className="section-kicker">
                  {group === "ExecutiveCouncil"
                    ? english
                      ? "LEADERSHIP & ACCOUNTABILITY"
                      : "ORIENTATION & RESPONSABILITÉ"
                    : english
                      ? "COMMITMENT & ACTION"
                      : "ENGAGEMENT & ACTION"}
                </p>
                <h2>
                  {group === "ExecutiveCouncil"
                    ? english
                      ? "Board of directors"
                      : "Conseil d’administration"
                    : english
                      ? "Our team"
                      : "Nos membres"}
                </h2>
                <div className="team-cards">
                  {team
                    .filter(
                      (m) => m.status === "visible" && m.category === group,
                    )
                    .map((m) => (
                      <article key={m.id} data-reveal>
                        <div className="team-portrait">
                          <img
                            src={
                              text(m.photoUrl) || "/assets/brand/acv-logo.jpeg"
                            }
                            alt={text(m.name)}
                            loading="lazy"
                            decoding="async"
                          />
                          {m.demo === true && (
                            <span>
                              {english ? "Demo profile" : "Profil de démonstration"}
                            </span>
                          )}
                        </div>
                        <h3>{text(m.name)}</h3>
                        <p>{local(m, "role", language)}</p>
                        {!!local(m, "bio", language) && (
                          <p className="team-bio">{local(m, "bio", language)}</p>
                        )}
                      </article>
                    ))}
                </div>
              </section>
            ))}
          {isApproach && (
            <>
              <div className="story-split">
                <div>
                <p className="section-kicker">{english ? "OUR METHOD" : "NOTRE MÉTHODE"}</p>
                  <h2>
                  {english ? "Listen. Act." : "Écouter. Agir."}
                    <br />
                  {english ? "Make it last." : "Faire durer."}
                  </h2>
                </div>
                <p className="story-copy">
                {english
                  ? "Every initiative starts with realities on the ground. Communities set priorities; ACV supports skills, collaboration, and solutions that strengthen their autonomy."
                  : "Chaque initiative part des réalités du terrain. Les communautés définissent les priorités ; ACV accompagne les compétences, les collaborations et les solutions qui renforcent leur autonomie."}
                </p>
              </div>
              <div className="values-cards approach-principles">
                {[1, 2, 3, 4].map((i) => <div className="approach-step" key={i}><span className="approach-step-number">0{i}</span>{block("principle-" + i, false)}</div>)}
              </div>
              <div className="story-two feature-project">
                <img
                  src={text(restoration?.coverImage) || photos[1]}
                  alt={english ? "Community-led landscape restoration" : "Restauration des terres par la communauté"}
                  loading="lazy"
                  decoding="async"
                />
                {block("goma-restoration", false) || (
                  <article className="story-block">
                    <p className="section-kicker">
                      {english ? "COMMUNITY PROJECT" : "PROJET COMMUNAUTAIRE"}
                    </p>
                    <h2>Goma Restoration</h2>
                    <p>
                      {english
                        ? "Local nurseries, youth-led agroforestry, and community gardens help restore the land around Goma and the Virunga foothills."
                        : "Des pépinières locales, l’agroforesterie portée par les jeunes et les jardins communautaires contribuent à restaurer les terres autour de Goma et des Virunga."}
                    </p>
                  </article>
                )}
              </div>
              {!!restorationGallery.length && (
                <div className="approach-photo-gallery" aria-label={english ? "Project photos" : "Photos du projet"}>
                  {restorationGallery.map((photo, index) => (
                    <figure key={`${photo.url}-${index}`}>
                      <img
                        src={photo.url}
                        alt={local(photo, "caption", language)}
                        loading="lazy"
                      />
                      {!!local(photo, "caption", language) && (
                        <figcaption>{local(photo, "caption", language)}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
              <section className="values-section">
                <p className="section-kicker">
                  {english ? "THEORY OF CHANGE" : "THÉORIE DU CHANGEMENT"}
                </p>
                <h2>
                  {english
                    ? "From vulnerability to autonomy."
                    : "De la vulnérabilité à l’autonomie."}
                </h2>
                <p className="change-intro">
                  {english
                    ? "A community-led journey that turns local knowledge into lasting resilience."
                    : "Un parcours mené par les communautés, où les savoirs locaux deviennent une résilience durable."}
                </p>
                <div className="change-phases">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <span>0{i}</span>
                      {block("phase-" + i, false)}
                    </div>
                  ))}
                </div>
              </section>
              <div className="ubuntu-panel">{block("ubuntu", false)}</div>
            </>
          )}
          {(isPrograms || isJournal) && (
            <section className="publications-section">
              <p className="section-kicker">
                {isPrograms
                  ? english
                    ? "WHAT WE DO"
                    : "CE QUE NOUS FAISONS"
                  : english
                    ? "ACV JOURNAL"
                    : "LE JOURNAL D’ACV"}
              </p>
              <h2>
                {isPrograms
              ? english
                ? "Our work on the ground"
                : "Nos actions sur le terrain"
              : english
                ? "Stories, articles & updates"
                : "Récits, articles & actualités"}
              </h2>
              <PublicationCards
                items={items.slice(
                  (current - 1) * pageSize,
                  current * pageSize,
                )}
                kind={isPrograms ? "programmes" : "articles"}
                lang={language}
              />
              <nav className="publication-pagination" aria-label="Pagination">
                {current > 1 && (
                  <a href={`?page=${current - 1}`}>
                    {english ? "← Previous" : "← Précédent"}
                  </a>
                )}
                <span>
                  {english ? "Page" : "Page"} {current}{" "}
                  {english ? "of" : "sur"}{" "}
                  {Math.max(1, Math.ceil(items.length / pageSize))}
                </span>
                {current * pageSize < items.length && (
                  <a href={`?page=${current + 1}`}>
                    {english ? "Next →" : "Suivant →"}
                  </a>
                )}
              </nav>
            </section>
          )}
          {slug === "contact" && (
            <div className="contact-layout">
              <ContactForm />
              <aside>
                <p className="section-kicker">
                  {english ? "GET IN TOUCH" : "RETROUVONS-NOUS"}
                </p>
                <h2>
                  {english ? "Here to listen," : "À votre écoute,"}
                  <br />
                  {english ? "based in Goma." : "depuis Goma."}
                </h2>
                <address>
                  <p>{text(s.address)}</p>
                  <a href={`mailto:${s.email}`}>{text(s.email)}</a>
                  <p>{text(s.phone)}</p>
                  <p>                  {english ? "Field coordination: " : "Coordination terrain : "}
                  {text(s.secondaryPhone)}</p>
                </address>
                <a
                  className="map-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text(s.address))}`}
                >
                  <span className="material-symbols-outlined">location_on</span>{" "}
                  {english
                    ? "Find our address on the map ↗"
                    : "Rechercher notre adresse sur la carte ↗"}
                </a>
                <p className="map-note">184 Avenue de la Paix · Himbi · Goma</p>
              </aside>
            </div>
          )}
          {!isHistory &&
            !isApproach &&
            !isTeam &&
            !isPrograms &&
            !isJournal &&
            slug !== "contact" && (
              <div className="story-copy">
                {(local(intro, "content", language) ? local(intro, "content", language).split("\n\n") : fallback[slug].paragraphs || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}
