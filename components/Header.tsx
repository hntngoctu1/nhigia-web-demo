"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SERVICE_GROUPS, servicesByGroup } from "@/lib/services";
import { useI18n } from "@/lib/i18n";

function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  if (e.key !== "Tab") return;
  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function navClass(active: boolean, openState = false) {
  return [
    "group relative inline-flex items-center gap-1.5 py-2 text-[13px] font-medium tracking-[0.09em] transition-colors duration-200 focus-visible:outline-none",
    active || openState
      ? "text-[color:var(--gold-soft)]"
      : "text-white/90 hover:text-[color:var(--gold-soft)]",
  ].join(" ");
}

function NavUnderline({ show }: { show: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[color:var(--gold)] transition-transform duration-300 ${
        show ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

export default function Header() {
  const { m, lang, setLang } = useI18n();
  const pathname = usePathname() || "/";
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [mobileSvcOpen, setMobileSvcOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const panelId = useId();
  const svcPanelId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const svcBtnRef = useRef<HTMLButtonElement>(null);
  const svcPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeSvc = useCallback(() => {
    clearTimers();
    setSvcOpen(false);
  }, [clearTimers]);

  const openSvcDelayed = useCallback(() => {
    clearTimers();
    hoverTimer.current = setTimeout(() => setSvcOpen(true), 120);
  }, [clearTimers]);

  const closeSvcDelayed = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setSvcOpen(false), 160);
  }, [clearTimers]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash.replace(/^#/, ""));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
        return;
      }
      if (panelRef.current) trapFocus(panelRef.current, e);
    };
    document.addEventListener("keydown", onKey);
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!svcOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSvc();
        svcBtnRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeSvc();
      }
    };
    const onScrollClose = () => closeSvc();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("scroll", onScrollClose, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("scroll", onScrollClose);
    };
  }, [svcOpen, closeSvc]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isHome = pathname === "/";
  const isDichVu = pathname === "/dich-vu" || pathname.startsWith("/dich-vu/");
  const isLienHe = pathname === "/lien-he" || pathname.startsWith("/lien-he/");
  const floatOverHero = isHome && !scrolled && !open;

  const isLinkActive = (l: { href: string; hash: string | null }) => {
    if (l.href === "/lien-he") return isLienHe;
    if (l.href === "/mo-hinh-ai") return pathname === "/mo-hinh-ai";
    if (!l.hash) return false;
    return isHome && hash === l.hash;
  };

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 text-white transition-[background,box-shadow,backdrop-filter] duration-300 ${
        floatOverHero
          ? "bg-gradient-to-b from-[#06101f]/90 via-[#06101f]/50 to-transparent"
          : "bg-[#06101f]/95 shadow-[0_18px_40px_-24px_rgb(0_0_0_/_0.65)] backdrop-blur-md"
      }`}
      role="banner"
    >
      <div className="relative z-20 hidden border-b border-white/10 sm:block">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-between gap-4 px-4 text-[11px] tracking-[0.04em] text-white/70 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate">{m.top.hours}</span>
            <span className="hidden h-3 w-px bg-white/20 md:block" aria-hidden />
            <span className="hidden md:inline">{m.top.cities}</span>
            <span className="hidden h-3 w-px bg-white/20 lg:block" aria-hidden />
            <a
              className="hidden transition hover:text-[color:var(--gold-soft)] lg:inline"
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
      <div
        className={`relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6 ${
          scrolled ? "h-16" : "h-[4.35rem] sm:h-[4.75rem]"
        } transition-[height] duration-200`}
      >
        <Link href="/#top" className="flex shrink-0 items-center">
          <Image
            src="/images/brand/logo-white.webp"
            alt="Nhị Gia"
            width={220}
            height={66}
            className={`w-auto transition-[height] duration-200 ${
              scrolled ? "h-11 sm:h-12" : "h-12 sm:h-[3.35rem]"
            }`}
            priority
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-6 xl:gap-9 lg:flex"
          aria-label={m.nav.main}
          onMouseLeave={closeSvcDelayed}
        >
          <div className="relative" onMouseEnter={openSvcDelayed}>
            <button
              ref={svcBtnRef}
              type="button"
              className={navClass(isDichVu, svcOpen)}
              aria-expanded={svcOpen}
              aria-haspopup="true"
              aria-controls={svcPanelId}
              onClick={() => {
                clearTimers();
                setSvcOpen((v) => !v);
              }}
            >
              {m.nav.services}
              <span
                aria-hidden
                className={`text-[9px] opacity-70 transition-transform duration-200 ${
                  svcOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
              <NavUnderline show={isDichVu || svcOpen} />
            </button>
          </div>

          {(
            [
              { href: "/#visa-nuoc-ngoai", label: m.nav.visa, hash: "visa-nuoc-ngoai" },
              { href: "/#quy-trinh", label: m.nav.process, hash: "quy-trinh" },
              { href: "/#uy-tin", label: m.nav.trust, hash: "uy-tin" },
              { href: "/#tin-tuc", label: m.nav.news, hash: "tin-tuc" },
              { href: "/mo-hinh-ai", label: m.nav.tech, hash: null as string | null },
              { href: "/lien-he", label: m.nav.contact, hash: null as string | null },
            ] as const
          ).map((l) => {
            const active = isLinkActive(l);
            return (
              <a
                key={l.href}
                href={l.href}
                className={navClass(active)}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
                <NavUnderline show={active} />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden items-center gap-0.5 rounded-full border border-white/12 bg-white/5 px-0.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white/55 sm:flex"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              className={`rounded-full px-2 py-1 ${lang === "vi" ? "bg-white/15 text-[color:var(--gold-soft)]" : "hover:text-white"}`}
              onClick={() => setLang("vi")}
            >
              VI
            </button>
            <button
              type="button"
              className={`rounded-full px-2 py-1 ${lang === "en" ? "bg-white/15 text-[color:var(--gold-soft)]" : "hover:text-white"}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
          <Link href="/lien-he" className="btn-gold hidden sm:inline-flex">
            {m.nav.book}
          </Link>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className="relative flex h-4 w-5 flex-col justify-center gap-[5px]"
              aria-hidden
            >
              <span
                className={`block h-px w-full bg-current transition duration-200 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition duration-200 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      <div
        className="h-px bg-gradient-to-r from-transparent via-[color:var(--gold)]/55 to-transparent"
        aria-hidden
      />

      {svcOpen ? (
        <div className="absolute left-0 right-0 top-full z-10 hidden lg:block">
          <div
            className="mega-backdrop fixed inset-0 top-0 -z-10 bg-slate-950/40 backdrop-blur-[2px]"
            aria-hidden
            onClick={closeSvc}
            onMouseEnter={closeSvc}
          />
          <div
            className="border-t border-white/10 bg-white text-navy shadow-[0_28px_64px_-24px_rgb(0_0_0_/_0.45)]"
            onMouseEnter={openSvcDelayed}
            onMouseLeave={closeSvcDelayed}
          >
            <div
              id={svcPanelId}
              ref={svcPanelRef}
              role="navigation"
              aria-label="Nhóm dịch vụ"
              className="mega-panel mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
            >
              <div className="grid gap-8 lg:grid-cols-4">
                {SERVICE_GROUPS.map((g) => {
                  const items = servicesByGroup(g.id).slice(0, 4);
                  return (
                    <div key={g.id} className="min-w-0">
                      <Link
                        href={g.href}
                        className="block text-[11px] font-bold uppercase tracking-[0.14em] text-navy/55 transition hover:text-navy"
                        onClick={closeSvc}
                      >
                        {m.groups[g.id]}
                      </Link>
                      <ul className="mt-4 space-y-1">
                        {items.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/dich-vu/${s.slug}`}
                              className="group/link flex items-center justify-between gap-2 py-1.5 text-sm text-slate-700 transition hover:text-navy"
                              onClick={closeSvc}
                            >
                              <span className="truncate">{s.title}</span>
                              <ChevronIcon className="shrink-0 text-slate-300 opacity-0 transition group-hover/link:translate-x-0.5 group-hover/link:text-gold group-hover/link:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                <div className="flex flex-col justify-between rounded-2xl bg-navy p-6 text-white">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--gold-soft)]">
                      {m.nav.consult}
                    </p>
                    <p className="mt-3 text-lg font-semibold leading-snug">
                      {m.nav.consultLead}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {m.nav.consultBody}
                    </p>
                  </div>
                  <div className="mt-6 space-y-3">
                    <a
                      href="tel:19006654"
                      className="block text-sm font-semibold tracking-[0.08em] text-[color:var(--gold-soft)]"
                      onClick={closeSvc}
                    >
                      1900 6654
                    </a>
                    <Link
                      href="/lien-he"
                      className="btn-gold w-full"
                      onClick={closeSvc}
                    >
                      {m.nav.book}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <p className="text-xs tracking-wide text-muted">
                  Visa · GPLĐ · Di trú · Pháp lý
                </p>
                <Link
                  href="/dich-vu"
                  className="text-sm font-semibold text-navy hover:text-[color:var(--gold)]"
                  onClick={closeSvc}
                >
                  {m.nav.all}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="lg:hidden" role="presentation">
          <div
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[3px] animate-[mega-fade_0.2s_ease-out]"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            ref={panelRef}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,22rem)] flex-col bg-[#071221] text-white shadow-2xl animate-[mega-sheet_0.28s_cubic-bezier(0.22,1,0.36,1)]"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                Menu
              </span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
                aria-label="Đóng menu"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <nav
              className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
              aria-label="Menu di động"
            >
              <p className="pb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--gold-soft)]/80">
                {m.nav.services}
              </p>
              <div className="space-y-1">
                {SERVICE_GROUPS.map((g) => {
                  const items = servicesByGroup(g.id);
                  const expanded = mobileSvcOpen === g.id;
                  return (
                    <div key={g.id} className="border-b border-white/10">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-medium"
                        aria-expanded={expanded}
                        onClick={() =>
                          setMobileSvcOpen((cur) => (cur === g.id ? null : g.id))
                        }
                      >
                        <span>{g.label}</span>
                        <span
                          aria-hidden
                          className={`text-[10px] text-white/40 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                      {expanded ? (
                        <ul className="space-y-0.5 pb-3">
                          {items.map((s) => (
                            <li key={s.slug}>
                              <Link
                                href={`/dich-vu/${s.slug}`}
                                className="block py-2 pl-1 text-sm text-white/70 hover:text-white"
                                onClick={() => setOpen(false)}
                              >
                                {s.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-col">
                {(
                  [
                    { href: "/#visa-nuoc-ngoai", label: m.nav.visa },
                    { href: "/#quy-trinh", label: m.nav.process },
                    { href: "/#uy-tin", label: m.nav.trust },
                    { href: "/#tin-tuc", label: m.nav.news },
                    { href: "/mo-hinh-ai", label: m.nav.tech },
                    { href: "/lien-he", label: m.nav.contact },
                  ] as const
                ).map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="border-b border-white/10 py-3.5 text-sm font-medium tracking-[0.04em] text-white/85"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] ${lang === "vi" ? "bg-white/15 text-[color:var(--gold-soft)]" : "text-white/50"}`}
                    onClick={() => setLang("vi")}
                  >
                    VI
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] ${lang === "en" ? "bg-white/15 text-[color:var(--gold-soft)]" : "text-white/50"}`}
                    onClick={() => setLang("en")}
                  >
                    EN
                  </button>
                </div>
              </div>
            </nav>
            <div className="shrink-0 space-y-2 border-t border-white/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a href="tel:19006654" className="btn-gold w-full !py-3">
                Gọi 1900 6654
              </a>
              <Link
                href="/lien-he"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 py-3 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {m.nav.book}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
    {!isHome ? (
      <div className="h-[4.35rem] sm:h-[6.85rem]" aria-hidden />
    ) : null}
    </>
  );
}
