"use client";

import { useEffect } from "react";

/** Optional IntersectionObserver for `.reveal` elements; respects reduced-motion. */
export default function Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    if (reduce) {
      nodes.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
