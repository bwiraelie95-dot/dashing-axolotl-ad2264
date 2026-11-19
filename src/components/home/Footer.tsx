import {contentModel} from "@/models/contentModel";
import { getLanguage } from "@/lib/public/cms";
export default async function Footer() {
 const language = await getLanguage();
 const english = language === "en";
 const t = (french: string, englishText: string) => english ? englishText : french;
 const settings=(await contentModel.list<Record<string,unknown>&{id:string}>("siteSettings"))[0]||{};
  return (
    <footer
      id="contact"
      className="w-full bg-inverse-surface text-inverse-on-surface relative"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-primary-container via-on-tertiary-container to-secondary"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold tracking-tight">
                Africa Community Village
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-surface-dim leading-relaxed">
              {t("Ancrage communautaire, souveraineté et résilience au cœur de Goma et du Nord-Kivu. Bâtir un futur durable par et pour les communautés locales.", "Community-led resilience and self-determination in Goma and North Kivu. Building a sustainable future with and for local communities.")}
            </p>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider">
              {t("Nord-Kivu · République Démocratique du Congo", "North Kivu · Democratic Republic of the Congo")}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
              {t("Organisation", "Organization")}
            </h3>
            <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-surface-dim">
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/notre-histoire"
                >
                  {t("Notre histoire", "Our story")}
                </a>
              </li>


              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  data-path="rapport-impact"
                  href="/rapport-impact"
                >
                  {t("Rapport d'impact", "Impact report")}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
              {t("Programmes", "Programs")}
            </h3>
            <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-surface-dim">
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/education-jeunesse"
                >
                  {t("Éducation & jeunesse", "Education & youth")}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/nature-biodiversite"
                >
                  {t("Nature & biodiversité", "Nature & biodiversity")}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/agriculture"
                >
                  {t("Agriculture régénérative", "Regenerative agriculture")}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/sante"
                >
                  {t("Santé communautaire", "Community health")}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/autonomisation"
                >
                  {t("Autonomie & artisanat", "Self-reliance & crafts")}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
              {t("Contact & Terrain", "Contact & field")}
            </h3>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm text-surface-dim">
              <p>{String(settings.address||"")}</p>
              <p><a href={`mailto:${settings.email}`}>{String(settings.email||"")}</a></p><p>{String(settings.phone||"")}</p>
              <div className="footer-socials">{['instagram','facebook','twitter','linkedin'].map(key=>settings[key+'Active']&&settings[key+'Url']?<a key={key} href={String(settings[key+'Url'])} target="_blank" rel="noopener noreferrer" aria-label={key==='twitter'?'X / Twitter':key==='linkedin'?'LinkedIn':key}><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d={key==='facebook'?'M14 22v-9h3l.5-4H14V7c0-1 .5-2 2-2h2V1.5A23 23 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v9Z':key==='instagram'?'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z':key==='linkedin'?'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.11 20.45H3.56V9h3.55v11.45ZM22.22 0H1.78C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z':'M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.4L5.3 22H2l8.3-9.5L1 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L6.5 4H4.7Z'}/></svg></a>:null)}</div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-surface-dim">
          <div className="flex flex-wrap items-center gap-6">
            <a
              className="hover:text-surface-container-lowest transition-colors"
              data-path="mentions-legales"
              href="/mentions-legales"
            >
              {t("Mentions légales", "Legal notice")}
            </a>
            <a
              className="hover:text-surface-container-lowest transition-colors"
              data-path="politique-confidentialite"
              href="/politique-confidentialite"
            >
              {t("Politique de confidentialité", "Privacy policy")}
            </a>
            <a
              className="flex items-center gap-1 hover:text-secondary-fixed transition-colors"
              href="/admin/login"
            >
              <span className="material-symbols-outlined text-[16px]">
                lock
              </span>
              <span>{t("Espace administration", "Administration")}</span>
            </a>
          </div>
          <p>© {new Date().getFullYear()} Africa Community Village. {t("Tous droits réservés.", "All rights reserved.")}</p>
        </div>
      </div>
    </footer>
  );
}
