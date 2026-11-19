"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitch from "@/components/public/LanguageSwitch";
export default function Header({
  language = "fr",
}: {
  language?: "fr" | "en";
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const english = language === "en";
  return (
    <header
      id="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") setMenuOpen(false);
      }}
      className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="header-inner max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 shrink-0">
          <img
            alt="Logo ACV"
            className="h-8 w-auto object-contain"
            src="/assets/brand/acv-logo.jpeg"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">
              Africa Community Village
            </span>
            <span className="font-eyebrow text-eyebrow text-outline uppercase tracking-wider">
              ACV · Goma, DRC
            </span>
          </div>
        </div>
        <nav
          id="main-navigation"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
          aria-label={english ? "Main navigation" : "Navigation principale"}
          className={`main-navigation ${menuOpen ? "is-open" : ""}`}
          data-active-classes="text-primary-container font-headline-sm border-b-2 border-primary-container"
        >
          <div className="header-language-mobile">
            <LanguageSwitch language={language} />
          </div>
          <a
            aria-current={pathname === "/" ? "page" : undefined}
            className={`transition-colors py-2 ${pathname === "/" ? "text-primary-container border-b-2 border-primary-container" : "text-on-surface-variant"}`}
            href="/"
          >
            {english ? "Home" : "Accueil"}
          </a>
          <div className="relative group py-2">
            <button
              className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              type="button"
            >
              <span>{english ? "About" : "À propos"}</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                expand_more
              </span>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:flex group-focus-within:flex flex-col bg-surface-container-lowest rounded-xl shadow-[0_12px_28px_-4px_rgba(68,48,30,0.08)] py-2 min-w-[200px] z-50">
              <a
                className="px-4 py-2 font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                href="/notre-histoire"
              >
                {english ? "Our story" : "Notre histoire"}
              </a>


              <a
                className="px-4 py-2 font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                href="/notre-equipe"
              >
                {english ? "Our team" : "Notre équipe"}
              </a>
            </div>
          </div>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-2"
            href="/programmes"
          >
            {english ? "Programs" : "Programmes"}
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-2"
            href="/notre-approche"
          >
            {english ? "Our approach" : "Notre approche"}
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-2"
            href="/journal"
          >
            {english ? "Journal" : "Journal"}
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-2"
            href="/contact"
          >
            {english ? "Contact" : "Contact"}
          </a>
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <div className="header-language-desktop">
            <LanguageSwitch language={language} />
          </div>
          <a
            className="hidden sm:inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_16px_-2px_rgba(68,48,30,0.05)] active:scale-98"
            href="/#don"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              favorite
            </span>
            <span>{english ? "Donate" : "Faire un don"}</span>
          </a>
          <Link
            href="/admin/login"
            aria-label={english ? "Administrator login" : "Connexion administrateur"}
            title={english ? "Administrator login" : "Connexion administrateur"}
            className="admin-login-link w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </Link>
        </div>
      </div>
      <button
        type="button"
        id="menu-toggle"
        aria-controls="main-navigation"
        aria-expanded={menuOpen}
        aria-label={
          menuOpen
            ? english
              ? "Close menu"
              : "Fermer le menu"
            : english
              ? "Open menu"
              : "Ouvrir le menu"
        }
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "×" : "☰"}
      </button>
    </header>
  );
}
