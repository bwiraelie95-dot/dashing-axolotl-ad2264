export default function HomeSections() {
  return (
    <>
      <section id="histoire" className="w-full py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="flex items-center gap-3">
                <span className="font-eyebrow text-eyebrow text-on-tertiary-container tracking-widest uppercase">
                  QUI SOMMES-NOUS
                </span>
                <div className="h-0.5 w-12 bg-on-tertiary-container rounded-full"></div>
              </div>
              <h2
                data-reveal
                className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight"
              >
                Né à Goma. Bâti pour durer.
              </h2>
              <div className="flex flex-col gap-4 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                <p>
                  Face aux défis chroniques du Nord-Kivu, des jeunes leaders
                  congolais ont choisi de ne plus subir. Africa Community
                  Village (ACV) est né d'un constat d'évidence : la pérennité
                  naît de l'ancrage profond, de la dignité partagée et de la fin
                  du paternalisme humanitaire.
                </p>
                <p>
                  Nous plaçons les villageois et la jeunesse au cœur de leur
                  propre trajectoire. En valorisant les savoirs agroécologiques
                  locaux, les dynamiques coopératives et l’intégrité écologique
                  du paysage des Virunga, nous tissons un modèle communautaire
                  autosuffisant et souverain.
                </p>
              </div>
              <div className="pt-2">
                <a
                  className="inline-flex items-center gap-3 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md px-6 py-3 rounded-xl transition-all duration-200 group"
                  href="/notre-histoire"
                >
                  <span>Découvrir nos origines</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
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
                      Impact direct
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Ancrage communautaire 100% local
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
              NOTRE MODÈLE INTÉGRÉ
            </span>
            <h2
              data-reveal
              className="font-headline-lg text-headline-lg text-on-surface tracking-tight"
            >
              Cinq piliers, un modèle communautaire
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Une réponse holistique aux réalités vécues pour transformer
              durablement le quotidien des villages du Nord-Kivu.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  Éducation et jeunesse
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Mentorat, bourses de scolarisation rurale, ateliers de
                  leadership éthique et clubs scientifiques pour révéler le
                  potentiel des jeunes filles et garçons.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary group-hover:text-primary-container transition-colors"
                href="/education-jeunesse"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
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
                  Nature et biodiversité
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Pépinières villageoises et corridors de reboisement d’essences
                  indigènes en périphérie du parc national des Virunga, cogérés
                  avec les gardiens coutumiers.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary group-hover:text-on-secondary-container transition-colors"
                href="/nature-biodiversite"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
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
                  Agriculture & sécurité alimentaire
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Agroécologie paysanne, banques de semences reproductibles,
                  compostage volcanique et souveraineté alimentaire face aux
                  crises économiques récurrentes.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary group-hover:text-primary-container transition-colors"
                href="/agriculture"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
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
                  Santé et bien-être
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Accès équitable à l'eau potable via des bornes gravitaires,
                  éducation sanitaire d'urgence et soutien psychosocial aux
                  familles vulnérables.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary group-hover:text-primary-container transition-colors"
                href="/sante"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
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
                  Autonomisation socio-économique
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Coopératives d'épargne villageoise (AVEC), ateliers de
                  formation aux métiers de l’énergie propre, valorisation de
                  l'artisanat textile et maraîcher local.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary group-hover:text-on-secondary-container transition-colors"
                href="/autonomisation"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
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
              « Quand les jeunes prennent l’initiative, les communautés se
              transforment. Quand les communautés prospèrent, l’Afrique s’élève.
              »
            </blockquote>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-on-primary/15 mb-8">
              <div className="flex flex-col items-center">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  120+
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  Jeunes formés & accompagnés
                </span>
              </div>
              <div className="flex flex-col items-center border-l-0 md:border-l border-on-primary/15">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  5
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  Piliers d'intervention coordonnés
                </span>
              </div>
              <div className="flex flex-col items-center border-l-0 md:border-l border-on-primary/15">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  12
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  Partenariats communautaires
                </span>
              </div>
              <div className="flex flex-col items-center border-l-0 md:border-l border-on-primary/15">
                <span className="font-display text-headline-lg lg:text-display font-extrabold text-tertiary-fixed leading-none">
                  4
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed mt-2">
                  Initiatives phares pérennisées
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-primary-fixed/80">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                verified
              </span>
              <span>Données de terrain certifiées ACV · Mise à jour 2024</span>
            </div>
          </div>
        </div>
      </section>

      <section id="journal" className="w-full py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-eyebrow text-eyebrow text-on-tertiary-container uppercase tracking-widest">
                RÉCITS DE TERRAIN
              </span>
              <h2
                data-reveal
                className="font-headline-lg text-headline-lg text-on-surface tracking-tight"
              >
                La voix de nos villages
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:underline shrink-0"
              href="/journal"
            >
              <span>Voir tout le journal</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_right_alt
              </span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              data-reveal
              className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Young Congolese community volunteers planting indigenous tree saplings in fertile dark volcanic soil near Goma with lush green rolling hills in background under soft golden daylight"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPob2d-opxKAWMwOZoX9nz8iV6_a2aqvJXWpZ5edXQ1LLmdqZ0sJzXzwFFFFNOrRKuGUcajgGIEEVbVjk3_fLnHgPwaxFXnMA1Nw15_W7W_GrW7apmSsu6zgD6wYrXDgqmXh6kRMYAwcYab_G1ewa7bFeNtAkbqcgok3kllgZhIgOZ9G06ok-WwybbuuH4iZlbib9RswQwBT0VIpKUrqI5KL2R3VEdl3ejLS8gDaU"
                />
                <span className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm text-secondary font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">
                  #Reboisement
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 text-outline font-label-sm text-label-sm mb-3">
                    <span className="material-symbols-outlined text-[14px]">
                      calendar_today
                    </span>
                    <span>14 Mars 2024</span>
                    <span>•</span>
                    <span>4 min de lecture</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-3">
                    5 000 arbres plantés : le rempart vert des collines de Sake
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-6">
                    Récit d'une journée de mobilisation intergénérationnelle où
                    aînés et lycéens ont uni leurs efforts pour restaurer les
                    versants fragilisés par l'érosion.
                  </p>
                </div>
                <a
                  href="/journal"
                  className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold"
                >
                  <span>Voir les récits publiés</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
              </div>
            </article>

            <article
              data-reveal
              className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Congolese youth learning organic vegetable farming techniques with handmade agricultural tools in community garden with volcanic stone beds in North Kivu"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkCWtgi5GorQ8qExfo7b19HsQsyVvvi-esnLeI5lh2XjstWJgieQ49d9sFOTsFJh3sFrNiACfVYGHFMHstqnjM49yIt-zwlKjSzhNNMIaHHWiDBTDM3o8u92Qx-UMKYz1pzNCWE4wDRhBtA6Ujm902xPhsD93Y_Go1iGr3PFiX1Zypsq0iv3oTK-j0wiV8aMkdXNwlsUteIuFX_hB66oR1uk4Nu0sc0vh-pF1sFrI"
                />
                <span className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm text-on-tertiary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">
                  #Agroécologie
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 text-outline font-label-sm text-label-sm mb-3">
                    <span className="material-symbols-outlined text-[14px]">
                      calendar_today
                    </span>
                    <span>28 Février 2024</span>
                    <span>•</span>
                    <span>5 min de lecture</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-3">
                    De la cendre à la récolte : l'art du maraîchage volcanique
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-6">
                    Comment les coopératives de femmes de Kibumba transforment
                    la roche volcanique en jardins maraîchers abondants et
                    résilients aux aléas climatiques.
                  </p>
                </div>
                <a
                  href="/journal"
                  className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold"
                >
                  <span>Voir les récits publiés</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
              </div>
            </article>

            <article
              data-reveal
              className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="African girls and youth leaders participating in a community workshop, writing notes and collaborating around wooden table in sunlit classroom in Goma DRC"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT1Z7886-qhfQ3v5XxyMr0RoxeLLYnXkcS8Sw0q83aWwzrNjFp4i-jy7DYbgzR7ZLhZ1vx6YnS8yiu-wWecQtDVPDiqi8jTE2YYeXhAYieJ_ha0P3gM0fmzjE38P3mT0eWIzYRIErEGWM6pwjDV2dBjjEuVUQyy1G03hF0L0GRTeguVO2a2SqLO9q3m7n9PwQStG3p7hVRO0Ta3sEcFBxEzTcnTZ8fiLktfl2Ul4o"
                />
                <span className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold">
                  #Jeunesse
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 text-outline font-label-sm text-label-sm mb-3">
                    <span className="material-symbols-outlined text-[14px]">
                      calendar_today
                    </span>
                    <span>12 Janvier 2024</span>
                    <span>•</span>
                    <span>3 min de lecture</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-3">
                    Créer son propre emploi à 20 ans : la promotion Horizon
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-6">
                    Immersion au sein de notre premier incubateur solidaire où
                    douze micro-projets portés par des jeunes ruraux ont vu le
                    jour ce trimestre.
                  </p>
                </div>
                <a
                  href="/journal"
                  className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold"
                >
                  <span>Voir les récits publiés</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="w-full py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center gap-3">
            <span className="font-eyebrow text-eyebrow text-on-tertiary-container uppercase tracking-widest">
              IMPLICATION CITOYENNE
            </span>
            <h2
              data-reveal
              className="font-headline-lg text-headline-lg text-on-surface tracking-tight"
            >
              Prendre part au changement
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chaque voix, chaque talent et chaque engagement compte pour
              accélérer la transition durable au Kivu.
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
                  Devenir bénévole
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Rejoignez nos brigades d'action directe à Goma, Sake ou
                  Rutshuru : animation d'ateliers, reboisement ou accompagnement
                  logistique sur le terrain.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-3 px-5 rounded-xl transition-colors"
                href="/contact"
              >
                Postuler sur le terrain
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
                  Devenir partenaire
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Universités, fondations philanthropiques, ONG partenaires :
                  co-construisons des programmes durables régis par la
                  co-responsabilité et l'intégrité.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md py-3 px-5 rounded-xl transition-colors"
                href="/contact"
              >
                Initier un partenariat
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
                  Soutenir nos actions
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
                  Participez directement au financement d'arbres, de kits
                  scolaires ruraux ou de matériel pour les pépinières
                  villageoises avec un suivi transparent.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md py-3 px-5 rounded-xl transition-colors shadow-sm"
                href="/#don"
              >
                Faire un don direct
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
