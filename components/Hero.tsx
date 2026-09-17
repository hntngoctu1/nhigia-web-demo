"use client";

import HeroCarousel, { type HeroSlide } from "./HeroCarousel";
import { useI18n } from "@/lib/i18n";

const SRCS = [
  "/images/hero/hero-consult.webp",
  "/images/hero/hero-skyline.webp",
  "/images/hero/hero-boardroom.webp",
  "/images/hero/hero-passport.webp",
];

export default function Hero() {
  const { m } = useI18n();
  const slides: HeroSlide[] = m.hero.slides.map((s, i) => ({
    src: SRCS[i],
    alt: s.alt,
    kicker: s.kicker,
    title: s.title,
  }));

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy text-white"
      aria-labelledby="hero-heading"
    >
      <HeroCarousel
        slides={slides}
        lead={m.hero.lead}
        book={m.hero.book}
        call={m.hero.call}
        services={m.hero.services}
        biz={m.hero.biz}
        personal={m.hero.personal}
        slidesAria={m.hero.slidesAria}
      />

      <div className="relative z-[5] border-t border-white/10 bg-navy">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          {m.hero.proof.map((p) => (
            <div key={p.label} className="px-4 py-5 text-center sm:py-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--gold-soft)]">
                {p.label}
              </div>
              <div className="mt-1.5 text-xs text-white/70 sm:text-sm">{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
