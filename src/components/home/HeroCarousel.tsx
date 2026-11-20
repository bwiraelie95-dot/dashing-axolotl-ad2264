"use client";
import { useEffect, useState } from "react";
import ArrowIcon from "@/components/public/ArrowIcon";
const fallbackPhotos = Array.from({ length: 5 }, (_, i) => `/assets/banners/home-${i + 1}.jpg`);

const INTERVAL_MS = 300_000;
type Banner = Record<string, unknown> & { id: string };
type Language = "fr" | "en";
function localized(item: Banner, key: string, language: Language) {
  const preferred = key + (language === "en" ? "En" : "Fr");
  const alternate = key + (language === "en" ? "Fr" : "En");
  return String(item[preferred] || item[alternate] || "");
}
export default function HeroCarousel({
  banners = [],
  language = "fr",
}: {
  banners?: Banner[];
  language?: Language;
}) {
  const cmsSlides = banners
    .map((banner) => ({
      image: String(banner.imageUrl || banner.image || ""),
      mobileImage: String(banner.imageMobile || ""),
      title: localized(banner, "title", language),
      subtitle: localized(banner, "subtitle", language),
      description: localized(banner, "description", language),
      ctaText: localized(banner, "ctaText", language),
      ctaLink: String(banner.ctaLink || "/programmes"),
    }))
    .filter((banner) => banner.image);
  const slides = cmsSlides.length
    ? cmsSlides
    : fallbackPhotos.map((image) => ({
        image,
        mobileImage: "",
        title: "",
        subtitle: "",
        description: "",
        ctaText: "",
        ctaLink: "/programmes",
      }));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setPaused(true);
  }, []);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const schedule = () => {
      clearInterval(timer);
      if (!paused && !document.hidden)
        timer = setInterval(
        () => setIndex((i) => (i + 1) % slides.length),
          INTERVAL_MS,
        );
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [paused, revision, slides.length]);
  function select(next: number) {
    setIndex((next + slides.length) % slides.length);
    setRevision((r) => r + 1);
  }
  const activeSlide = slides[index] || slides[0];
  const nextIndex = (index + 1) % slides.length;
  return (
    <section
      id="hero"
      aria-label={language === "en" ? "ACV community photos" : "Photos de la communauté ACV"}
      aria-roledescription="carrousel"
      className="hero relative w-full h-[640px] flex items-end overflow-hidden"
    >
      <div className="absolute inset-0" id="hero-slides">
        {slides.map((slide, i) =>
          i === index || i === nextIndex ? (
            <picture
              key={slide.image}
              className={`hero-slide ${i === index ? "is-active" : ""}`}
              aria-hidden="true"
            >
              {slide.mobileImage && (
                <source
                  media="(max-width: 650px)"
                  srcSet={slide.mobileImage}
                />
              )}
              <img
                src={slide.image}
                alt=""
                loading={i === index ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i === index ? "high" : "low"}
              />
            </picture>
          ) : null,
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-28">
        <div className="max-w-3xl flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-on-tertiary-container text-tertiary font-eyebrow text-eyebrow tracking-widest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span>{language === "en" ? "GOMA · NORTH KIVU · DRC" : "GOMA · NORD-KIVU · RDC"}</span>
          </div>
          <h1 className="font-display text-headline-lg lg:text-display text-surface-container-lowest tracking-tight leading-[1.08] text-balance">
            {activeSlide?.title ||
              (language === "en"
                ? "Together, growing a future for our communities."
                : "Ensemble, faisons grandir l’avenir des communautés.")}
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high/90 max-w-2xl leading-relaxed">
            {activeSlide?.description ||
              activeSlide?.subtitle ||
              (language === "en"
                ? "Led by Congolese youth at the foot of the Virunga, an integrated approach to autonomy, ecological regeneration, and local prosperity."
                : "Portée par la jeunesse congolaise au pied des Virunga, une approche intégrée pour l'autonomie, la régénération écologique et la prospérité locale.")}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-3 w-full sm:w-auto">
            <a
              className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
              href={activeSlide?.ctaLink || "/programmes"}
            >
              <span>{activeSlide?.ctaText || (language === "en" ? "Discover our programs" : "Découvrir nos programmes")}</span>
              <ArrowIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest/15 backdrop-blur-md hover:bg-surface-container-lowest/25 text-surface-container-lowest font-label-md text-label-md px-7 py-3.5 rounded-xl transition-all duration-200"
              href="/#don"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                favorite
              </span>
              <span>{language === "en" ? "Donate" : "Faire un don"}</span>
            </a>
          </div>
          <div className="hero-controls" aria-label="Commandes du carrousel">
            <button
              type="button"
              id="hero-prev"
              onClick={() => select(index - 1)}
              aria-label={language === "en" ? "Previous photo" : "Photo précédente"}
            >
              ‹
            </button>
            {slides.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                className="hero-dot"
                aria-label={language === "en" ? `Show photo ${i + 1} of ${slides.length}` : `Afficher la photo ${i + 1} sur ${slides.length}`}
                aria-pressed={i === index}
                onClick={() => select(i)}
              >
                <span />
              </button>
            ))}
            <button
              type="button"
              id="hero-next"
              onClick={() => select(index + 1)}
              aria-label={language === "en" ? "Next photo" : "Photo suivante"}
            >
              ›
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
