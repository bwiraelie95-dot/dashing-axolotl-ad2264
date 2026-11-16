export const programPages = [
  [
    "education-jeunesse",
    "Éducation et jeunesse",
    "Accompagner les jeunes dans leurs apprentissages et leur participation à la vie communautaire.",
  ],
  [
    "nature-biodiversite",
    "Nature et biodiversité",
    "Préserver les écosystèmes et soutenir les initiatives locales de restauration des paysages.",
  ],
  [
    "agriculture",
    "Agriculture et sécurité alimentaire",
    "Renforcer les savoirs agricoles et l’accès à une alimentation durable.",
  ],
  [
    "sante",
    "Santé et bien-être",
    "Favoriser la prévention, le bien-être et l’accès aux ressources essentielles.",
  ],
  [
    "autonomisation",
    "Autonomisation socio-économique",
    "Soutenir les compétences, les initiatives économiques et les coopérations locales.",
  ],
] as const;
export const pages: Record<
  string,
  { title: string; intro: string; resource?: string; paragraphs?: string[] }
> = {
  "notre-histoire": {
    title: "Notre histoire",
    intro: "Né à Goma. Bâti pour durer.",
    paragraphs: [
      "Africa Community Village porte une vision du développement ancrée dans les communautés de l’Est de la République démocratique du Congo.",
      "La jeunesse, les savoirs locaux et la coopération sont au cœur de notre approche. Nos cinq piliers relient éducation, environnement, agriculture, santé et autonomie économique.",
    ],
  },
  "notre-equipe": {
    title: "Notre équipe",
    intro: "Les personnes qui font vivre Africa Community Village.",
    resource: "team",
  },
  gouvernance: {
    title: "Gouvernance",
    intro: "Les personnes et responsabilités au service de notre mission.",
    resource: "governance",
  },
  "notes-de-terrain": {
    title: "Notes de terrain",
    intro: "Les nouvelles et observations partagées par nos équipes.",
    resource: "field-notes",
  },
  programmes: {
    title: "Nos programmes",
    intro: "Cinq piliers, un modèle communautaire.",
  },
  "notre-approche": {
    title: "Notre approche",
    intro: "Construire avec les communautés.",
    paragraphs: [
      "Écouter : partir des besoins et des priorités exprimés localement.",
      "Coopérer : associer jeunes, familles et partenaires à la construction des initiatives.",
      "Relier : faire travailler ensemble nos cinq piliers plutôt que traiter chaque enjeu de manière isolée.",
      "Apprendre : partager les enseignements du terrain et adapter nos actions.",
    ],
  },
  journal: {
    title: "Journal",
    intro: "Nos récits et actualités publiés.",
    resource: "articles",
  },
  "rapport-impact": {
    title: "Rapport d’impact",
    intro: "Retrouvez ici les rapports publiés par ACV.",
    paragraphs: [
      "Aucun rapport d’impact n’est actuellement disponible au téléchargement. Vous pouvez contacter l’équipe pour demander des informations.",
    ],
  },
  contact: {
    title: "Contact",
    intro:
      "Une question, une envie de contribuer ou un projet de partenariat ? Écrivez à notre équipe.",
  },
  "mentions-legales": {
    title: "Mentions légales",
    intro: "Informations relatives au site Africa Community Village.",
    paragraphs: [
      "Organisation présentée : Africa Community Village (ACV), Goma, République démocratique du Congo.",
      "Les informations d’enregistrement, de direction de publication et d’hébergement doivent encore être complétées par l’organisation. Pour toute demande, utilisez le formulaire de contact.",
    ],
  },
  "politique-confidentialite": {
    title: "Confidentialité",
    intro: "Les données utilisées sur ce site.",
    paragraphs: [
      "Le formulaire de contact transmet votre nom, votre adresse e-mail, votre sujet et votre message au serveur ACV pour permettre à l’équipe de traiter votre demande.",
      "L’espace administrateur conserve un jeton de session dans le stockage de l’onglet du navigateur. Il est retiré à la déconnexion.",
      "Les images et polices distantes sont chargées depuis des services externes. Les durées de conservation et les coordonnées du responsable du traitement doivent encore être précisées par ACV. Pour une demande concernant vos données, contactez l’équipe.",
    ],
  },
  ...Object.fromEntries(
    programPages.map(([slug, title, intro]) => [
      slug,
      {
        title,
        intro,
        paragraphs: [
          "Ce pilier s’inscrit dans le modèle communautaire intégré d’ACV. Pour connaître les actions en cours ou proposer une collaboration, prenez contact avec notre équipe.",
        ],
      },
    ]),
  ),
};
