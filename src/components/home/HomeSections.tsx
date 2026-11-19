import { PublicationCards } from "@/components/public/Editorial";
import ArrowIcon from "@/components/public/ArrowIcon";
import type { Item } from "@/lib/public/cms";
export default function HomeSections({
  language,
  stats,
  programs,
  articles,
}: {
  language: "fr" | "en";
  stats: Item[];
  programs: Item[];
  articles: Item[];
}) {
  const english = language === "en";
  const t = (french: string, englishText: string) =>
    english ? englishText : french;
  const impact = stats.find(
    (s) => s.displayPage === "home" && s.status === "active",
  );

  return (
    <>
      <section id="histoire" className="w-full py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="flex items-center gap-3">
                <span className="font-eyebrow text-eyebrow text-on-tertiary-container tracking-widest uppercase">
                  {t("QUI SOMMES-NOUS", "WHO WE ARE")}
                </span>
                <div className="h-0.5 w-12 bg-on-tertiary-container rounded-full"></div>
              </div>
              <h2
                data-reveal
                className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight"
              >
                {t("Né à Goma. Bâti pour durer.", "Born in Goma. Built to last.")}
              </h2>
              <div className="flex flex-col gap-4 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                <p>
                  {t("Face aux défis chroniques du Nord-Kivu, des jeunes leaders", "In response to the chronic challenges facing North Kivu, young Congolese leaders")}
                  {t(" congolais ont choisi de ne plus subir. Africa Community Village (ACV) est né d'un constat d'évidence : la pérennité naît de l'ancrage profond, de la dignité partagée et de la fin du paternalisme humanitaire.", " chose to shape their own future. Africa Community Village (ACV) was born from a simple conviction: lasting change grows from local roots, shared dignity, and an end to paternalistic aid.")}
                </p>
                <p>
                  {t("Nous plaçons les villageois et la jeunesse au cœur de leur", "We place communities and young people at the heart of their")}
                  {t(" propre trajectoire. En valorisant les savoirs agroécologiques locaux, les dynamiques coopératives et l’intégrité écologique du paysage des Virunga, nous tissons un modèle communautaire autosuffisant et souverain.", " own journey. By valuing local agroecological knowledge, cooperative initiatives, and the ecological integrity of the Virunga landscape, we are building a self-reliant, community-led model.")}
                </p>
              </div>
              <div className="pt-2">
                <a
                  className="inline-flex items-center gap-3 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md px-6 py-3 rounded-xl transition-all duration-200 group"
                  href="/notre-histoire"
                >
                  <span>{t("Découvrir nos origines", "Discover our story")}</span>
                  <ArrowIcon className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <div data-reveal className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-full h-full rounded-3xl bg-secondary/10 transform rotate-1 pointer-events-none"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-xl bg-surface-container-low aspect-[4/3]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Young Congolese community leaders and agrarian specialists smiling together while inspecting a nursery of indigenous trees with Lake Kivu and mount Nyiragongo landscape in warm morning light, candid, authentic, dignified"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP2muwB54BpZjvTNWwwpWtdtgAP_lseid6-rOP6bw7NqvxuH8BceTVI6q54sKBYzoRsxPjYkA5OxSmUP16m506PHn49ksc4uAmxdf3jMw-PO9jpWzMMs1KBTqSniYV0lYb49vHRuJ_RUXkvr51mDSWeCIF1CKao7kUpHTlDjVQXMIzCT4NfF2gFFxWOnBX-N5TTa-e8urMUDZ-6iiwkbyjb2-Qx4tBDHdmJIUiKqc"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="absolute -bottom-6 left-4 sm:left-8 right-4 sm:right-auto bg-surface-container-lowest/95 backdrop-blur-md p-5 rounded-2xl shadow-xl flex items-center gap-4 max-w-sm">
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      verified
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                      {t("Impact direct", "Direct impact")}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {t("Ancrage communautaire 100% local", "100% community-rooted")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24 bg-surface-container-low" id="piliers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
            <span className="font-eyebrow text-eyebrow text-secondary uppercase tracking-widest">
              {t("NOTRE MODÈLE INTÉGRÉ", "OUR INTEGRATED MODEL")}
            </span>
            <h2
              data-reveal
              className="font-headline-lg text-headline-lg text-on-surface tracking-tight"
            >
              {t("Cinq piliers, un modèle communautaire", "Five pillars, one community-led model")}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("Une réponse holistique aux réalités vécues pour transformer durablement le quotidien des villages du Nord-Kivu.", "A holistic response to lived realities, designed to improve daily life in North Kivu communities for the long term.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-on-tertiary-container/15 text-tertiary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">
                    school
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Éducation et jeunesse", "Education and youth")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Mentorat, bourses de scolarisation rurale, ateliers de leadership éthique et clubs scientifiques pour révéler le potentiel des jeunes filles et garçons.", "Mentoring, rural education scholarships, ethical leadership workshops, and science clubs help girls and boys reach their potential.")}
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary group-hover:text-primary-container transition-colors"
                href="/education-jeunesse"
              >
                <span>{t("En savoir plus", "Learn more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">
                    park
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Nature et biodiversité", "Nature and biodiversity")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Pépinières villageoises et corridors de reboisement d’essences indigènes en périphérie du parc national des Virunga, cogérés avec les gardiens coutumiers.", "Community nurseries and native-species reforestation corridors around Virunga National Park, co-managed with customary stewards.")}
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary group-hover:text-on-secondary-container transition-colors"
                href="/nature-biodiversite"
              >
                <span>{t("En savoir plus", "Learn more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed-dim/30 text-tertiary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">
                    eco
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Agriculture & sécurité alimentaire", "Agriculture & food security")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Agroécologie paysanne, banques de semences reproductibles, compostage volcanique et souveraineté alimentaire face aux crises économiques récurrentes.", "Farmer-led agroecology, reusable seed banks, volcanic-soil composting, and food sovereignty in the face of recurring economic crises.")}
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary group-hover:text-primary-container transition-colors"
                href="/agriculture"
              >
                <span>{t("En savoir plus", "Learn more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-error-container/50 text-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">
                    favorite
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Santé et bien-être", "Health and well-being")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Accès équitable à l'eau potable via des bornes gravitaires, éducation sanitaire d'urgence et soutien psychosocial aux familles vulnérables.", "Equitable access to clean water through gravity-fed taps, emergency health education, and psychosocial support for vulnerable families.")}
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary group-hover:text-primary-container transition-colors"
                href="/sante"
              >
                <span>{t("En savoir plus", "Learn more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group md:col-span-2 lg:col-span-1"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">
                    storefront
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Autonomisation socio-économique", "Socio-economic empowerment")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Coopératives d'épargne villageoise (AVEC), ateliers de formation aux métiers de l’énergie propre, valorisation de l'artisanat textile et maraîcher local.", "Village savings and loan associations, training in clean-energy trades, and support for local textile crafts and market gardening.")}
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary group-hover:text-on-secondary-container transition-colors"
                href="/autonomisation"
              >
                <span>{t("En savoir plus", "Learn more")}</span>
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="approche"
        className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface"
      >
        <div className="max-w-7xl mx-auto bg-primary-container text-on-primary rounded-[28px] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-primary/40 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-on-tertiary-container/10 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <span className="material-symbols-outlined text-tertiary-fixed text-[44px] mb-4 opacity-90">
              format_quote
            </span>
            <blockquote
              data-reveal
              className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg font-bold leading-tight mb-12 text-balance text-surface-container-lowest"
            >
              {t("« Quand les jeunes prennent l’initiative, les communautés se transforment. Quand les communautés prospèrent, l’Afrique s’élève. »", "“When young people take the lead, communities transform. When communities thrive, Africa rises.”")}
            </blockquote>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-on-primary/15 mb-8">
              <div className="flex flex-col items-center">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  {impact
                    ? String(impact.value) + String(impact.suffix || "")
                    : "—"}
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  {t("Jeunes formés & accompagnés", "Young people trained & supported")}
                </span>
              </div>
              <div className="flex flex-col items-center border-l-0 md:border-l border-on-primary/15">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  5
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  {t("Piliers d'intervention coordonnés", "Coordinated areas of work")}
                </span>
              </div>
              <div className="flex flex-col items-center border-l-0 md:border-l border-on-primary/15">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  {articles.length}
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  {t("Articles publiés", "Articles published")}
                </span>
              </div>
              <div className="flex flex-col items-center border-l-0 md:border-l border-on-primary/15">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  {programs.length}
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  {t("Programmes publiés", "Programs published")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-primary-fixed/80">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                verified
              </span>
              <span>{t("Chiffres enregistrés et mis à jour par l’équipe ACV", "Figures recorded and updated by the ACV team")}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="programmes-terrain" className="w-full py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-eyebrow text-eyebrow text-on-tertiary-container uppercase tracking-widest">
                {t("RÉCITS DE TERRAIN", "FIELD STORIES")}
              </span>
              <h2
                data-reveal
                className="font-headline-lg text-headline-lg text-on-surface tracking-tight"
              >
                {t("La voix de nos villages", "Voices from our communities")}
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:underline shrink-0"
              href="/programmes"
            >
              <span>{t("Voir nos programmes", "Explore our programs")}</span>
              <ArrowIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
          <PublicationCards
            items={[...programs]
              .sort((a, b) =>
                String(b.activityDate || b.createdAt).localeCompare(
                  String(a.activityDate || a.createdAt),
                ),
              )
              .slice(0, 3)}
            kind="programmes"
            lang={language}
          />
        </div>
      </section>

      <section className="w-full py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center gap-3">
            <span className="font-eyebrow text-eyebrow text-on-tertiary-container uppercase tracking-widest">
              {t("IMPLICATION CITOYENNE", "GET INVOLVED")}
            </span>
            <h2
              data-reveal
              className="font-headline-lg text-headline-lg text-on-surface tracking-tight"
            >
              {t("Prendre part au changement", "Be part of the change")}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("Chaque voix, chaque talent et chaque engagement compte pour accélérer la transition durable au Kivu.", "Every voice, talent, and act of commitment matters in accelerating a sustainable future in Kivu.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-[24px]">
                    group_add
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Devenir bénévole", "Volunteer with us")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Rejoignez nos brigades d'action directe à Goma, Sake ou Rutshuru : animation d'ateliers, reboisement ou accompagnement logistique sur le terrain.", "Join our field teams in Goma, Sake, or Rutshuru to lead workshops, support reforestation, or help with field logistics.")}
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-3 px-5 rounded-xl transition-colors"
                href="/contact"
              >
                {t("Postuler sur le terrain", "Apply to volunteer")}
              </a>
            </div>

            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-6">
                  <span className="material-symbols-outlined text-[24px]">
                    handshake
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Devenir partenaire", "Become a partner")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Universités, fondations philanthropiques, ONG partenaires : co-construisons des programmes durables régis par la co-responsabilité et l'intégrité.", "Universities, philanthropic foundations, and NGO partners can work with us to build sustainable programs grounded in shared responsibility and integrity.")}
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md py-3 px-5 rounded-xl transition-colors"
                href="/contact"
              >
                {t("Initier un partenariat", "Start a partnership")}
              </a>
            </div>

            <div
              data-reveal
              className="bg-surface-container-lowest p-8 rounded-[20px] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary-container mb-6">
                  <span className="material-symbols-outlined text-[24px]">
                    volunteer_activism
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                  {t("Soutenir nos actions", "Support our work")}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  {t("Participez directement au financement d'arbres, de kits scolaires ruraux ou de matériel pour les pépinières villageoises avec un suivi transparent.", "Help fund trees, rural school kits, or community nursery equipment, with transparent updates on the impact of your contribution.")}
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md py-3 px-5 rounded-xl transition-colors shadow-sm"
                href="/#don"
              >
                {t("Faire un don direct", "Donate directly")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
