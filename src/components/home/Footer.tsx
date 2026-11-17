import {contentModel} from "@/models/contentModel";
export default async function Footer() {
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
              Ancrage communautaire, souveraineté et résilience au cœur de Goma
              et du Nord-Kivu. Bâtir un futur durable par et pour les
              communautés locales.
            </p>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-wider">
              Nord-Kivu · République Démocratique du Congo
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
              Organisation
            </h3>
            <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-surface-dim">
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/notre-histoire"
                >
                  Notre histoire
                </a>
              </li>


              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  data-path="rapport-impact"
                  href="/rapport-impact"
                >
                  Rapport d'impact
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
              Programmes
            </h3>
            <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-surface-dim">
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/education-jeunesse"
                >
                  Éducation & jeunesse
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/nature-biodiversite"
                >
                  Nature & biodiversité
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/agriculture"
                >
                  Agriculture régénérative
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/sante"
                >
                  Santé communautaire
                </a>
              </li>
              <li>
                <a
                  className="hover:text-surface-container-lowest transition-colors"
                  href="/autonomisation"
                >
                  Autonomie & artisanat
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
              Contact & Terrain
            </h3>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm text-surface-dim">
              <p>{String(settings.address||"")}</p>
              <p><a href={`mailto:${settings.email}`}>{String(settings.email||"")}</a></p><p>{String(settings.phone||"")}</p>
              <div className="footer-socials">{['instagram','facebook','twitter','linkedin'].map(key=>settings[key+'Active']&&settings[key+'Url']?<a key={key} href={String(settings[key+'Url'])} target="_blank" rel="noopener noreferrer" aria-label={key==='twitter'?'X / Twitter':key}><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d={key==='facebook'?'M14 22v-9h3l.5-4H14V7c0-1 .5-2 2-2h2V1.5A23 23 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v9Z':key==='instagram'?'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z':'M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.4L5.3 22H2l8.3-9.5L1 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L6.5 4H4.7Z'}/></svg></a>:null)}</div>
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
              Mentions légales
            </a>
            <a
              className="hover:text-surface-container-lowest transition-colors"
              data-path="politique-confidentialite"
              href="/politique-confidentialite"
            >
              Politique de confidentialité
            </a>
            <a
              className="flex items-center gap-1 hover:text-secondary-fixed transition-colors"
              href="/admin/login"
            >
              <span className="material-symbols-outlined text-[16px]">
                lock
              </span>
              <span>Espace administration</span>
            </a>
          </div>
          <p>© {new Date().getFullYear()} Africa Community Village. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
