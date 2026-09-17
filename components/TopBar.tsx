"use client";

import { useI18n } from "@/lib/i18n";

export default function TopBar() {
  const { m } = useI18n();
  return (
    <div
      className="bg-navy text-[11px] text-white/75"
      role="complementary"
      aria-label={m.top.aria}
    >
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 tracking-[0.04em]">
          <span className="truncate">{m.top.hours}</span>
          <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
          <span className="hidden sm:inline">{m.top.cities}</span>
          <span className="hidden h-3 w-px bg-white/15 md:block" aria-hidden />
          <a
            className="hidden transition hover:text-[color:var(--gold-soft)] md:inline"
            href="mailto:info@nhigia.vn"
          >
            info@nhigia.vn
          </a>
        </div>
        <a
          className="shrink-0 font-semibold tracking-[0.16em] text-[color:var(--gold-soft)] transition hover:text-white"
          href="tel:19006654"
          aria-label={m.top.call}
        >
          1900 6654
        </a>
      </div>
    </div>
  );
}
