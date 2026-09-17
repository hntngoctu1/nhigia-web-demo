"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type HeroSlide = {
  src: string;
  alt: string;
  kicker: string;
  title: string;
};

const AUTOPLAY_MS = 5500;
const FADE_MS = 700;
const SWIPE_THRESHOLD = 40;

type Props = {
  slides: HeroSlide[];
  lead: string;
  book: string;
  call: string;
  services: string;
  biz: string;
  personal: string;
  slidesAria: string;
};

function isNearby(i: number, index: number, count: number) {
  if (count <= 1) return i === 0;
  const prev = (index - 1 + count) % count;
  const next = (index + 1) % count;
  return i === index || i === prev || i === next;
}

export default function HeroCarousel({
  slides,
  lead,
  book,
  call,
  services,
  biz,
  personal,
  slidesAria,
}: Props) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [pageHidden, setPageHidden] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  /** Once a slide has been nearby, keep it mounted so crossfade decode is instant. */
  const [everNearby, setEverNearby] = useState<Set<number>>(() => new Set([0]));

  const regionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const wasAutoplay = useRef(false);
  const labelId = useId();

  const count = slides.length;
  const current = slides[index] ?? slides[0];
  const effectivelyPaused = reducedMotion || interactionPaused || pageHidden;
  const autoplayActive = !effectivelyPaused && count > 1;

  const syncInteractionPause = useCallback(() => {
    setInteractionPaused(hoverRef.current || focusRef.current);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      const normalized = ((next % count) + count) % count;
      setIndex(normalized);
      setProgressKey((k) => k + 1);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    setEverNearby((prev) => {
      const next = new Set(prev);
      for (let i = 0; i < count; i++) {
        if (isNearby(i, index, count)) next.add(i);
      }
      return next.size === prev.size ? prev : next;
    });
  }, [index, count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setIndex(0);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplayActive) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
      setProgressKey((k) => k + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplayActive, count, progressKey]);

  useEffect(() => {
    if (autoplayActive && !wasAutoplay.current) {
      setProgressKey((k) => k + 1);
    }
    wasAutoplay.current = autoplayActive;
  }, [autoplayActive]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    touchStartX.current = e.clientX;
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  const mounted = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < count; i++) {
      if (everNearby.has(i) || isNearby(i, index, count)) set.add(i);
    }
    return set;
  }, [everNearby, index, count]);

  if (!current) return null;

  return (
    <div
      ref={regionRef}
      className="relative isolate min-h-[72vh] w-full outline-none md:min-h-[90vh]"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="hero-heading"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => {
        hoverRef.current = true;
        syncInteractionPause();
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        syncInteractionPause();
      }}
      onFocusCapture={() => {
        focusRef.current = true;
        syncInteractionPause();
      }}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (regionRef.current && next && regionRef.current.contains(next)) return;
        focusRef.current = false;
        syncInteractionPause();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        touchStartX.current = null;
      }}
    >
      <div className="absolute inset-0 overflow-hidden bg-navy" aria-hidden>
        {slides.map((slide, i) => {
          if (!mounted.has(i)) return null;
          const active = i === index;
          return (
            <div
              key={slide.src}
              className={`hero-fade absolute inset-0 ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                transitionDuration: reducedMotion ? "0ms" : `${FADE_MS}ms`,
                zIndex: active ? 1 : 0,
              }}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : "auto"}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-cover object-center ${
                  active && !reducedMotion ? "ken-burns" : ""
                }`}
              />
            </div>
          );
        })}

        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: `
              linear-gradient(
                105deg,
                rgb(6 16 31 / 0.94) 0%,
                rgb(6 16 31 / 0.82) 34%,
                rgb(6 16 31 / 0.48) 58%,
                rgb(6 16 31 / 0.62) 100%
              ),
              linear-gradient(
                to top,
                rgb(6 16 31 / 0.88) 0%,
                rgb(6 16 31 / 0.35) 28%,
                transparent 55%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-[3] mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-4 pb-28 pt-28 md:min-h-[90vh] md:pb-32 md:pt-36">
        <div className="max-w-xl animate-fade-up md:max-w-2xl">
          <p className="mb-3 inline-flex max-w-full items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gold-soft)]/90">
            <span
              className="h-px w-5 shrink-0 bg-[color:var(--gold-soft)]/70"
              aria-hidden
            />
            <span className="truncate">{current.kicker}</span>
          </p>

          <h1
            id="hero-heading"
            className="text-[2.05rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[2.5rem] lg:text-[2.95rem] lg:leading-[1.06]"
          >
            <span className="block">{current.title}</span>
          </h1>

          <span className="gold-rule" aria-hidden />

          <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-blue-100/90 sm:text-[1.0125rem] sm:leading-relaxed">
            {lead}
          </p>

          <div id="tu-van" className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/lien-he" className="btn-gold !px-6 !py-3.5 !text-sm">
              {book}
            </Link>
            <a
              href="tel:19006654"
              className="rounded-full border border-white/35 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-white/10"
            >
              {call}
            </a>
            <Link
              href="/dich-vu"
              className="px-2 py-3.5 text-sm font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline"
            >
              {services}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/dich-vu?for=dn"
              className="rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-blue-50 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {biz}
            </Link>
            <Link
              href="/dich-vu?for=cn"
              className="rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-blue-50 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {personal}
            </Link>
          </div>
        </div>
      </div>

      <div id={labelId} className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {index + 1} / {count}: {current.title}. {current.alt}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[4]">
        <div className="hero-progress-track" aria-hidden>
          {autoplayActive ? (
            <div
              key={progressKey}
              className="hero-progress"
              style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
            />
          ) : (
            <div
              className="hero-progress hero-progress--static"
              style={{ width: `${((index + 1) / count) * 100}%` }}
            />
          )}
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:py-6">
          <div
            className="flex items-center gap-2.5"
            role="tablist"
            aria-label={slidesAria}
          >
            {slides.map((slide, i) => {
              const selected = i === index;
              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Slide ${i + 1}: ${slide.title}`}
                  tabIndex={selected ? 0 : -1}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold-soft)] ${
                    selected
                      ? "w-9 bg-[color:var(--gold-soft)] shadow-[0_0_12px_rgb(240_220_150_/_0.45)]"
                      : "w-2 bg-white/35 hover:bg-white/65"
                  }`}
                  onClick={() => goTo(i)}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="mr-1 hidden text-[11px] font-semibold tracking-[0.12em] text-white/65 sm:inline">
              {String(index + 1).padStart(2, "0")}
              <span className="text-white/35">
                {" "}
                / {String(count).padStart(2, "0")}
              </span>
            </span>
            <button
              type="button"
              aria-label="Slide trước"
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-md transition hover:border-white/45 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold-soft)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Slide tiếp"
              onClick={goNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-md transition hover:border-white/45 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold-soft)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
