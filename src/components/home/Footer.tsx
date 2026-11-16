export default function Footer() {
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
              <p>Goma, Nord-Kivu, RDC</p>
              <p>contact@africacommunityvillage.org</p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  aria-label="Localisation"
                  className="w-8 h-8 rounded-full bg-inverse-surface/80 flex items-center justify-center text-surface-dim hover:text-surface-container-lowest hover:bg-surface-container-high/20 transition-all"
                  href="https://www.openstreetmap.org/search?query=Goma%2C%20RDC"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    pin_drop
                  </span>
                </a>
                <a
                  aria-label="Courriel"
                  className="w-8 h-8 rounded-full bg-inverse-surface/80 flex items-center justify-center text-surface-dim hover:text-surface-container-lowest hover:bg-surface-container-high/20 transition-all"
                  href="/contact"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    mail
                  </span>
                </a>
                <a
                  aria-label="Contacter l’équipe"
                  className="w-8 h-8 rounded-full bg-inverse-surface/80 flex items-center justify-center text-surface-dim hover:text-surface-container-lowest hover:bg-surface-container-high/20 transition-all"
                  href="/contact"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    forum
                  </span>
                </a>
              </div>
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
          <p>© 2025 Africa Community Village. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
