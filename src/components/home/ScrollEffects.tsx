"use client";

import { useEffect, useRef } from "react";

/** Progressive enhancement: content remains visible without JavaScript. */
export default function ScrollEffects() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    function configure() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            const siblings = [
              ...(element.parentElement?.children ?? []),
            ].filter((child) =>
              child.matches(
                "[data-reveal], .reveal-on-scroll, .team-cards article",
              ),
            );
            const delay =
              Math.min(Math.max(siblings.indexOf(element), 0), 4) * 75;
            const animation = element.animate(
              [
                { opacity: 0, transform: "translateY(22px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 650,
                delay,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "backwards",
              },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
            observer?.unobserve(element);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      document
        .querySelectorAll(
          "[data-reveal], .reveal-on-scroll, .team-cards article, .interior-callout",
        )
        .forEach((element) => observer?.observe(element));
    }
    let frame = 0;
    function update() {
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(window.scrollY / distance, 1) : 0})`;
      document
        .getElementById("site-header")
        ?.toggleAttribute("data-scrolled", window.scrollY > 24);
      frame = 0;
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    configure();
    update();
    preference.addEventListener("change", configure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", configure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
