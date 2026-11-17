import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ScrollEffects from "@/components/home/ScrollEffects";
import ContactForm from "@/components/public/ContactForm";
import { contentModel } from "@/models/contentModel";
import { pages as fallback } from "@/lib/public/pages";
import { PublicationCards } from "@/components/public/Editorial";
export const dynamic = "force-dynamic";
type Item = Record<string, unknown> & { id: string };
const text = (v: unknown) => String(v || "");
const photos = [
  "/assets/images/acv_hero_youth_community_1792692599382.jpg",
  "/assets/images/acv_hero_tree_planting_1792692600143.jpg",
];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${fallback[slug]?.title || "ACV"} — Africa Community Village`,
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
    contentModel.list<Item>("siteSettings"),
  ]);
  const s = settings[0] || {};
  const section = (key: string) =>
    sections.find((p) => p.slug === key && p.status === "published");
  const block = (key: string) => {
    const p = section(key);
    return p ? (
      <article className="story-block" key={key} data-reveal>
        <p className="section-kicker">AFRICA COMMUNITY VILLAGE</p>
        <h2>{text(p.titleFr)}</h2>
        {!!p.subtitleFr && <h3>{text(p.subtitleFr)}</h3>}
        <p>{text(p.contentFr)}</p>
        {!!p.buttonUrl && (
          <a className="admin-text-link" href={text(p.buttonUrl)}>
            {text(p.buttonTextFr)} →
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
  const pageSize = isPrograms ? 9 : 10;
  const backgroundImages: Record<string, string> = {
    "notre-histoire": photos[0],
    "notre-equipe":
      "/assets/images/acv_hero_education_skills_1792692599936.jpg",
    programmes: "/assets/images/acv_hero_food_security_1792692600374.jpg",
    "notre-approche": photos[1],
    journal: "/assets/images/acv_hero_education_skills_1792692599936.jpg",
  };
  const background = backgroundImages[slug]
    ? text(intro?.coverImage) || backgroundImages[slug]
    : "";
  const items = (isJournal ? articles : programs)
    .filter((i) => i.status === "published")
    .sort((a, b) =>
      text(b.activityDate || b.publishedAt || b.createdAt).localeCompare(
        text(a.activityDate || a.publishedAt || a.createdAt),
      ),
    );
  return (
    <>
      <Header />
      <ScrollEffects />
      <main className="public-page interior">
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
              ACCUEIL / {fallback[slug].title}
            </a>
            <h1>{text(intro?.titleFr) || fallback[slug].title}</h1>
            <p>{text(intro?.subtitleFr) || fallback[slug].intro}</p>
            <span className="intro-rule" />
          </div>
        </div>
        <div className="interior-body">
          {isHistory && (
            <>
              <div className="story-split">
                <div>
                  <p className="section-kicker">NOTRE ANCRAGE</p>
                  <h2>
                    Nés à Goma.
                    <br />
                    Engagés pour demain.
                  </h2>
                </div>
                <div className="story-copy">
                  <p>{text(intro?.contentFr)}</p>
                  <p>
                    Nous relions nos cinq domaines d’intervention pour
                    construire des réponses durables avec les communautés de
                    l’Est de la RDC. Les jeunes, les femmes et les savoirs
                    locaux occupent une place centrale dans cette démarche.
                  </p>
                </div>
              </div>
              <div className="story-two">
                {block("vision")}
                {block("mission")}
              </div>
              <section className="values-section">
                <p className="section-kicker">CE QUI NOUS GUIDE</p>
                <h2>Des valeurs qui deviennent des actes.</h2>
                <div className="values-cards">
                  {Array.from({ length: 8 }, (_, i) => {
                    const p = section("value-" + (i + 1));
                    return p ? (
                      <article key={i} data-reveal>
                        <span>0{i + 1}</span>
                        <h3>{text(p.titleFr)}</h3>
                        <p>{text(p.contentFr)}</p>
                      </article>
                    ) : null;
                  })}
                </div>
              </section>
              <div className="interior-callout">
                <h2>Une vision portée par des personnes.</h2>
                <a className="admin-button" href="/notre-equipe">
                  Rencontrer notre équipe →
                </a>
              </div>
            </>
          )}
          {isTeam &&
            ["ExecutiveCouncil", "Staff"].map((group) => (
              <section className="team-section" key={group}>
                <p className="section-kicker">
                  {group === "ExecutiveCouncil"
                    ? "ORIENTATION & RESPONSABILITÉ"
                    : "ENGAGEMENT & ACTION"}
                </p>
                <h2>
                  {group === "ExecutiveCouncil"
                    ? "Conseil d’administration"
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
                          />
                          {m.demo === true && (
                            <span>Profil de démonstration</span>
                          )}
                        </div>
                        <h3>{text(m.name)}</h3>
                        <p>{text(m.roleFr)}</p>
                        {!!m.bioFr && (
                          <p className="team-bio">{text(m.bioFr)}</p>
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
                  <p className="section-kicker">NOTRE MÉTHODE</p>
                  <h2>
                    Écouter. Agir.
                    <br />
                    Faire durer.
                  </h2>
                </div>
                <p className="story-copy">
                  Chaque initiative part des réalités du terrain. Les
                  communautés définissent les priorités ; ACV accompagne les
                  compétences, les collaborations et les solutions qui
                  renforcent leur autonomie.
                </p>
              </div>
              <div className="values-cards approach-principles">
                {[1, 2, 3, 4].map((i) => block("principle-" + i))}
              </div>
              <div className="story-two feature-project">
                <img src={photos[1]} alt="Restauration des terres" />
                {block("goma-restoration")}
              </div>
              <section className="values-section">
                <p className="section-kicker">THÉORIE DU CHANGEMENT</p>
                <h2>De la vulnérabilité à l’autonomie.</h2>
                <div className="change-phases">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <span>0{i}</span>
                      {block("phase-" + i)}
                    </div>
                  ))}
                </div>
              </section>
              <div className="ubuntu-panel">{block("ubuntu")}</div>
            </>
          )}
          {(isPrograms || isJournal) && (
            <section className="publications-section">
              <p className="section-kicker">
                {isPrograms ? "CE QUE NOUS FAISONS" : "LE JOURNAL D’ACV"}
              </p>
              <h2>
                {isPrograms
                  ? "Nos actions sur le terrain"
                  : "Récits, articles & actualités"}
              </h2>
              <PublicationCards
                items={items.slice(
                  (current - 1) * pageSize,
                  current * pageSize,
                )}
                kind={isPrograms ? "programmes" : "articles"}
                lang="fr"
              />
              <nav className="publication-pagination" aria-label="Pagination">
                {current > 1 && (
                  <a href={`?page=${current - 1}`}>← Précédent</a>
                )}
                <span>
                  Page {current} sur{" "}
                  {Math.max(1, Math.ceil(items.length / pageSize))}
                </span>
                {current * pageSize < items.length && (
                  <a href={`?page=${current + 1}`}>Suivant →</a>
                )}
              </nav>
            </section>
          )}
          {slug === "contact" && (
            <div className="contact-layout">
              <ContactForm />
              <aside>
                <p className="section-kicker">RETROUVONS-NOUS</p>
                <h2>
                  À votre écoute,
                  <br />
                  depuis Goma.
                </h2>
                <address>
                  <p>{text(s.address)}</p>
                  <a href={`mailto:${s.email}`}>{text(s.email)}</a>
                  <p>{text(s.phone)}</p>
                  <p>Coordination terrain : {text(s.secondaryPhone)}</p>
                </address>
                <a
                  className="map-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text(s.address))}`}
                >
                  <span className="material-symbols-outlined">location_on</span>{" "}
                  Rechercher notre adresse sur la carte ↗
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
                {fallback[slug].paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}
