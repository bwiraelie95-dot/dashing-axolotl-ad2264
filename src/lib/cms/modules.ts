export type Field = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "image"
    | "gallery"
    | "password";
  options?: string[];
  required?: boolean;
};
const bilingual = (
  key: string,
  label: string,
  type: Field["type"] = "text",
): Field[] =>
  ["Fr", "En"].map((lang) => ({
    key: key + lang,
    label: `${label} (${lang.toUpperCase()})`,
    type,
  }));
const status: Field = {
  key: "status",
  label: "Publication",
  type: "select",
  options: ["draft", "published", "archived"],
};
const order: Field = { key: "order", label: "Ordre", type: "number" };
const image: Field = {
  key: "coverImage",
  label: "Image principale",
  type: "image",
};
const gallery: Field = {
  key: "gallery",
  label: "Galerie photographique",
  type: "gallery",
};
export const pillars = [
  "education-youth",
  "environment-nature",
  "sustainable-agriculture",
  "community-health",
  "socio-economic-empowerment",
];
export const modules: Record<string, { label: string; fields: Field[] }> = {
  banners: {
    label: "Hero / Slides",
    fields: [
      ...bilingual("title", "Titre"),
      ...bilingual("eyebrow", "Surtitre"),
      ...bilingual("subtitle", "Sous-titre"),
      ...bilingual("description", "Description", "textarea"),
      {
        key: "imageUrl",
        label: "Image ordinateur",
        type: "image",
        required: true,
      },
      { key: "imageMobile", label: "Image mobile", type: "image" },
      ...bilingual("ctaText", "Bouton principal"),
      { key: "ctaLink", label: "Lien principal" },
      ...bilingual("secondaryText", "Bouton secondaire"),
      { key: "secondaryUrl", label: "Lien secondaire" },
      ...bilingual("centralText", "Bouton central"),
      { key: "centralUrl", label: "Lien central" },
      {
        key: "textAlignment",
        label: "Alignement",
        type: "select",
        options: ["left", "center", "right"],
      },
      order,
      { key: "active", label: "Diapositive active", type: "checkbox" },
      status,
    ],
  },
  pages: {
    label: "Pages & contenus",
    fields: [
      { key: "slug", label: "Clé de section", required: true },
      ...bilingual("title", "Titre"),
      ...bilingual("subtitle", "Sous-titre"),
      ...bilingual("content", "Paragraphes", "textarea"),
      image,
      ...bilingual("buttonText", "Bouton"),
      { key: "buttonUrl", label: "Lien du bouton" },
      {
        key: "villageCouncilVerified",
        label: "Vérification documentée par les conseils de village",
        type: "checkbox",
      },
      {
        key: "verificationSource",
        label: "Document / source de vérification",
        type: "textarea",
      },
      order,
      status,
    ],
  },
  articles: {
    label: "Journal & articles",
    fields: [
      ...bilingual("title", "Titre"),
      { key: "slug", label: "Slug SEO", required: true },
      ...bilingual("excerpt", "Extrait", "textarea"),
      ...bilingual("content", "Contenu", "textarea"),
      image,
      gallery,
      { key: "category", label: "Catégorie", required: true },
      { key: "programExternalId", label: "Programme associé (identifiant)" },
      { key: "author", label: "Auteur" },
      { key: "publishedDate", label: "Date de publication (AAAA-MM-JJ)" },
      status,
    ],
  },
  programs: {
    label: "Programmes & activités",
    fields: [
      { key: "activityDate", label: "Date de l’activité (AAAA-MM-JJ)" },
      ...bilingual("title", "Titre"),
      { key: "slug", label: "Slug SEO", required: true },
      { key: "pillarId", label: "Pilier", type: "select", options: pillars },
      ...bilingual("summary", "Résumé", "textarea"),
      ...bilingual("description", "Présentation", "textarea"),
      ...bilingual("objectivesText", "Objectifs", "textarea"),
      ...bilingual("activitiesText", "Activités", "textarea"),
      image,
      gallery,
      { key: "location", label: "Zone d’intervention" },
      {
        key: "programStatus",
        label: "État du projet",
        type: "select",
        options: ["planned", "active", "completed"],
      },
      order,
      status,
    ],
  },
  team: {
    label: "Notre équipe",
    fields: [
      {
        key: "demo",
        label: "Profil de démonstration (désactiver après remplacement)",
        type: "checkbox",
      },
      { key: "name", label: "Nom complet", required: true },
      ...bilingual("role", "Fonction"),
      ...bilingual("bio", "Biographie", "textarea"),
      { key: "photoUrl", label: "Photographie", type: "image" },
      {
        key: "category",
        label: "Groupe",
        type: "select",
        options: ["ExecutiveCouncil", "Staff"],
      },
      order,
      {
        key: "status",
        label: "Visibilité",
        type: "select",
        options: ["visible", "hidden"],
      },
    ],
  },
  stats: {
    label: "Statistiques",
    fields: [
      { key: "suffix", label: "Suffixe (ex. +)" },
      ...bilingual("label", "Indicateur"),
      { key: "value", label: "Valeur", type: "number", required: true },
      {
        key: "scope",
        label: "Portée",
        type: "select",
        options: ["global", "program"],
      },
      { key: "programExternalId", label: "Programme (identifiant)" },
      { key: "period", label: "Période", required: true },
      {
        key: "source",
        label: "Source de vérification",
        type: "textarea",
        required: true,
      },
      { key: "verified", label: "Validation officielle", type: "checkbox" },
      {
        key: "status",
        label: "Visibilité",
        type: "select",
        options: ["active", "hidden"],
      },
    ],
  },
  siteSettings: {
    label: "Paramètres du site",
    fields: [
      { key: "organizationName", label: "Organisation" },
      { key: "logo", label: "Logo", type: "image" },
      { key: "favicon", label: "Favicon", type: "image" },
      ...bilingual("description", "Description", "textarea"),
      { key: "address", label: "Adresse" },
      { key: "email", label: "E-mail" },
      { key: "phone", label: "Téléphone" },
      { key: "secondaryPhone", label: "Coordination terrain" },
      ...bilingual("officeHours", "Horaires"),
      { key: "mapUrl", label: "Lien carte" },
      {
        key: "coordinatesVerified",
        label: "Coordonnées vérifiées",
        type: "checkbox",
      },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
      {
        key: "bannerSpeedMs",
        label: "Durée du hero en millisecondes",
        type: "number",
      },
      {
        key: "defaultLanguage",
        label: "Langue principale",
        type: "select",
        options: ["fr", "en"],
      },
      { key: "timezone", label: "Fuseau horaire" },
      ...bilingual("footerText", "Texte du footer", "textarea"),
      ...bilingual("seoTitle", "Titre SEO"),
      ...bilingual("seoDescription", "Description SEO", "textarea"),
      { key: "defaultOgImage", label: "Image de partage", type: "image" },
      { key: "primaryColor", label: "Couleur principale (#RRGGBB)" },
      ...bilingual("donationTitle", "Titre de la campagne"),
      ...bilingual(
        "donationDescription",
        "Description de la campagne",
        "textarea",
      ),
      {
        key: "donationsEnabled",
        label: "Dons de TEST activés (clés serveur requises)",
        type: "checkbox",
      },
      {
        key: "donationAmounts",
        label: "Montants proposés (séparés par virgules)",
      },
      { key: "donationCurrencies", label: "Devises (USD,EUR)" },
      ...["instagram", "facebook", "linkedin", "twitter"].flatMap((key) => [
        { key: key + "Url", label: key + " URL" },
        {
          key: key + "Active",
          label: key + " activé",
          type: "checkbox" as const,
        },
      ]),
    ],
  },
  users: {
    label: "Utilisateurs & accès",
    fields: [
      { key: "name", label: "Nom", required: true },
      { key: "email", label: "E-mail", required: true },
      {
        key: "password",
        label:
          "Mot de passe initial / réinitialisation (12 caractères minimum)",
        type: "password",
      },
      {
        key: "role",
        label: "Rôle",
        type: "select",
        options: [
          "super-admin",
          "admin",
          "editor",
          "communication-manager",
          "program-manager",
          "finance-manager",
          "viewer",
        ],
      },
      {
        key: "status",
        label: "État",
        type: "select",
        options: ["active", "suspended"],
      },
    ],
  },
};
