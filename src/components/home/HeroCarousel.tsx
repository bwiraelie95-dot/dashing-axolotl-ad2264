"use client";
import { useEffect, useState } from "react";
const photos = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYwRbrJKRQ3CobFoji4x06iRzXRtw2GQQwYJdeVAifd6tLoTukoRVDVbvPZM2t-ziZ1PO_1BtTWMvSw3wzkV-pxD1iwTfI0qmbwpbL44Rn6RS73MLGwFoOcDABHlyafW3t4VEbWDw-Ojr9KLoYKt4Nk7zVDDnWEAI6fh9hE0T7K-sZ6mNIRKRWughzBBIvPe_BV5hU1nabmTqAHL6gbnWkR39r1y6c6R30jo-pQOg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDP2muwB54BpZjvTNWwwpWtdtgAP_lseid6-rOP6bw7NqvxuH8BceTVI6q54sKBYzoRsxPjYkA5OxSmUP16m506PHn49ksc4uAmxdf3jMw-PO9jpWzMMs1KBTqSniYV0lYb49vHRuJ_RUXkvr51mDSWeCIF1CKao7kUpHTlDjVQXMIzCT4NfF2gFFxWOnBX-N5TTa-e8urMUDZ-6iiwkbyjb2-Qx4tBDHdmJIUiKqc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPob2d-opxKAWMwOZoX9nz8iV6_a2aqvJXWpZ5edXQ1LLmdqZ0sJzXzwFFFFNOrRKuGUcajgGIEEVbVjk3_fLnHgPwaxFXnMA1Nw15_W7W_GrW7apmSsu6zgD6wYrXDgqmXh6kRMYAwcYab_G1ewa7bFeNtAkbqcgok3kllgZhIgOZ9G06ok-WwybbuuH4iZlbib9RswQwBT0VIpKUrqI5KL2R3VEdl3ejLS8gDaU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkCWtgi5GorQ8qExfo7b19HsQsyVvvi-esnLeI5lh2XjstWJgieQ49d9sFOTsFJh3sFrNiACfVYGHFMHstqnjM49yIt-zwlKjSzhNNMIaHHWiDBTDM3o8u92Qx-UMKYz1pzNCWE4wDRhBtA6Ujm902xPhsD93Y_Go1iGr3PFiX1Zypsq0iv3oTK-j0wiV8aMkdXNwlsUteIuFX_hB66oR1uk4Nu0sc0vh-pF1sFrI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDT1Z7886-qhfQ3v5XxyMr0RoxeLLYnXkcS8Sw0q83aWwzrNjFp4i-jy7DYbgzR7ZLhZ1vx6YnS8yiu-wWecQtDVPDiqi8jTE2YYeXhAYieJ_ha0P3gM0fmzjE38P3mT0eWIzYRIErEGWM6pwjDV2dBjjEuVUQyy1G03hF0L0GRTeguVO2a2SqLO9q3m7n9PwQStG3p7hVRO0Ta3sEcFBxEzTcnTZ8fiLktfl2Ul4o",
];

const INTERVAL_MS = 300_000;
export default function HeroCarousel() {
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
          () => setIndex((i) => (i + 1) % photos.length),
          INTERVAL_MS,
        );
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [paused, revision]);
  function select(next: number) {
    setIndex((next + photos.length) % photos.length);
    setRevision((r) => r + 1);
  }
  return (
    <section
      id="hero"
      aria-label="Photos de la communauté ACV"
      aria-roledescription="carrousel"
      className="hero relative w-full h-[640px] flex items-end overflow-hidden"
    >
      <div className="absolute inset-0" id="hero-slides">
        {photos.map((photo, i) => (
          <img
            key={photo}
            className={`hero-slide ${i === index ? "is-active" : ""}`}
            src={photo}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-28">
        <div className="max-w-3xl flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-on-tertiary-container text-tertiary font-eyebrow text-eyebrow tracking-widest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span>GOMA · NORD-KIVU · RDC</span>
          </div>
          <h1 className="font-display text-headline-lg lg:text-display text-surface-container-lowest tracking-tight leading-[1.08] text-balance">
            Ensemble, faisons grandir l’avenir des communautés.
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high/90 max-w-2xl leading-relaxed">
            Portée par la jeunesse congolaise au pied des Virunga, une approche
            intégrée pour l'autonomie, la régénération écologique et la
            prospérité locale.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-3 w-full sm:w-auto">
            <a
              className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
              href="/programmes"
            >
              <span>Découvrir nos programmes</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest/15 backdrop-blur-md hover:bg-surface-container-lowest/25 text-surface-container-lowest font-label-md text-label-md px-7 py-3.5 rounded-xl transition-all duration-200"
              href="/#don"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                favorite
              </span>
              <span>Faire un don</span>
            </a>
          </div>
          <div className="hero-controls" aria-label="Commandes du carrousel">
            <button
              type="button"
              id="hero-prev"
              onClick={() => select(index - 1)}
              aria-label="Photo précédente"
            >
              ‹
            </button>
            {photos.map((photo, i) => (
              <button
                key={photo}
                type="button"
                className="hero-dot"
                aria-label={`Afficher la photo ${i + 1} sur 5`}
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
              aria-label="Photo suivante"
            >
              ›
            </button>
            <button
              type="button"
              id="hero-pause"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused
                  ? "Reprendre le défilement"
                  : "Mettre le défilement en pause"
              }
            >
              {paused ? "Reprendre" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
