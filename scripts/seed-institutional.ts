import "dotenv/config";
import data from "../prisma/content/institutional.json";
import { prisma } from "../src/models/prisma/client";
import { saveCms } from "../src/models/cmsModel";
async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: "super-admin", status: "active" },
  });
  if (!admin) throw new Error("Un compte Super Admin existant est requis.");
  let inserted = 0;
  for (const page of data.pages) {
    if (await prisma.page.findUnique({ where: { slug: page.slug } })) continue;
    await saveCms("pages", null, page, admin.externalId, false);
    inserted++;
  }
  if (
    !(await prisma.program.findUnique({ where: { slug: data.program.slug } }))
  ) {
    await saveCms("programs", null, data.program, admin.externalId, false);
    inserted++;
  }
  const defaults = {
    organizationName: "Africa Community Village (ACV)",
    logo: "/assets/brand/acv-logo.jpeg",
    address:
      "184 Avenue de la Paix, Quartier Himbi, Goma, Nord-Kivu, République Démocratique du Congo",
    email: "info@acv-drc.org",
    phone: "+243 975 131 159",
    secondaryPhone: "+243 977 531 777",
    coordinatesVerified: false,
    bannerSpeedMs: 300000,
    defaultLanguage: "fr",
    timezone: "Africa/Lubumbashi",
    footerTextFr:
      "Des communautés résilientes, en bonne santé et autonomes, guidées par leurs jeunes.",
    footerTextEn:
      "Resilient, healthy, empowered communities — led by their own youth.",
    seoTitleFr: "Africa Community Village — Goma, RDC",
    seoTitleEn: "Africa Community Village — Goma, DRC",
    seoDescriptionFr:
      "Éducation, environnement, agriculture, santé et moyens de subsistance dans l’Est de la RDC.",
    seoDescriptionEn:
      "Education, environment, agriculture, health and livelihoods across Eastern DRC.",
    donationsEnabled: false,
    donationAmounts: "25,50,100,250",
    donationCurrencies: "USD,EUR",
    instagramUrl: "https://www.instagram.com/africa.community.village",
    instagramActive: true,
    facebookUrl:
      "https://www.facebook.com/people/Africa-Community-Village/61566422018591/",
    facebookActive: true,
    twitterUrl: "https://x.com/africomvillage",
    twitterActive: true,
    linkedinUrl:
      "https://www.linkedin.com/company/smart-climate-inititives-drc/",
    linkedinActive: false,
  };
  for (const [settingKey, settingValue] of Object.entries(defaults))
    await prisma.setting.upsert({
      where: { settingKey },
      create: {
        settingKey,
        settingValue,
        isPublic: true,
        groupName: "general",
      },
      update: {},
    });
  console.log(
    `${inserted} contenus institutionnels ajoutés. Données existantes conservées. Aucun compte ou chiffre créé.`,
  );
}
main().finally(() => prisma.$disconnect());
