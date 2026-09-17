"use client";

import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

export default function AudienceSplit() {
  const { m, lang } = useI18n();
  const paths = [
    {
      href: "/dich-vu?for=dn",
      badge: m.audience.dnBadge,
      title: m.audience.dnTitle,
      desc: m.audience.dnDesc,
      points: lang === "en" ? ["Work permit", "Sponsorship", "APEC"] : ["GPLĐ & tạm trú", "Công văn bảo lãnh", "APEC doanh nhân"],
      cta: m.audience.dnCta,
      image: "/images/hero/hero-boardroom.webp",
    },
    {
      href: "/dich-vu?for=cn",
      badge: m.audience.cnBadge,
      title: m.audience.cnTitle,
      desc: m.audience.cnDesc,
      points: lang === "en" ? ["Visa & E-Visa", "Passport", "VIP"] : ["Visa & E-Visa", "Hộ chiếu / LLTP", "VIP hồi hương"],
      cta: m.audience.cnCta,
      image: "/images/hero/hero-passport.webp",
    },
  ];
  return (
    <section
      id="doi-tuong"
      className="border-b border-slate-200/70 bg-gradient-to-b from-white to-surface/60 section-y"
      aria-labelledby="audience-heading"
    >
      <div className="container-page">
        <SectionHeader
          eyebrow={m.audience.eye}
          title={m.audience.title}
          lead={m.audience.lead}
        />
        <h2 id="audience-heading" className="sr-only">
          {m.audience.sr}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {paths.map((p, i) => (
            <a
              key={p.href}
              href={p.href}
              className="reveal card card-lift group relative flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              <span className="relative aspect-[16/8] overflow-hidden bg-navy/10">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-navy/35 to-transparent"
                  aria-hidden
                />
              </span>
              <span className="flex flex-1 flex-col p-7 sm:p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-navy/[0.04] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-navy ring-1 ring-navy/5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-brand" : "bg-[color:var(--gold)]"}`}
                  aria-hidden
                />
                {p.badge}
              </span>
              <span className="mt-5 text-xl font-extrabold tracking-tight text-navy sm:text-[1.65rem] sm:leading-snug">
                {p.title}
              </span>
              <p className="mt-3.5 flex-1 text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
                {p.desc}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-hidden>
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="rounded-full border border-slate-200/90 bg-surface/80 px-3 py-1.5 text-[11px] font-semibold text-slate-700"
                  >
                    {pt}
                  </li>
                ))}
              </ul>
              <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-navy transition group-hover:gap-2.5">
                {p.cta}
                <span aria-hidden>→</span>
              </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
