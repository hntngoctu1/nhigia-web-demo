"use client";

import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

export default function Process() {
  const { m } = useI18n();
  const steps = m.process.steps.map((s, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: s.title,
    desc: s.desc,
  }));
  return (
    <section id="quy-trinh" className="bg-navy section-y text-white">
      <div className="container-page">
        <SectionHeader
          tone="dark"
          eyebrow={m.process.eye}
          title={m.process.title}
          lead={m.process.lead}
        />

        {/* Mobile: vertical timeline */}
        <ol className="relative grid gap-0 md:hidden">
          <div
            className="pointer-events-none absolute bottom-4 left-[1.35rem] top-4 w-px bg-gradient-to-b from-gold/50 via-white/20 to-transparent"
            aria-hidden
          />
          {steps.map((s, i) => {
            const isFirst = i === 0;
            return (
              <li key={s.n} className="relative flex gap-4 pb-5 last:pb-0">
                <div
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ring-4 ring-navy ${
                    isFirst
                      ? "bg-gold text-navy shadow-[0_0_20px_rgb(196_160_53_/_0.35)]"
                      : "border border-white/25 bg-navy-2 text-gold-soft"
                  }`}
                >
                  {s.n}
                </div>
                <div
                  className={`flex-1 rounded-2xl border p-4 ${
                    isFirst
                      ? "border-gold/35 bg-white/[0.08]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <h3 className="section-h3 text-white">{s.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-blue-100/90">
                    {s.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* md+: horizontal stepper with segment connectors */}
        <ol className="relative hidden md:grid md:grid-cols-5 md:gap-4 lg:gap-5">
          {steps.map((s, i) => {
            const isFirst = i === 0;
            const isLast = i === steps.length - 1;
            return (
              <li key={s.n} className="relative flex flex-col items-start">
                {!isLast ? (
                  <div
                    className="pointer-events-none absolute left-[2.75rem] right-[-0.65rem] top-[1.35rem] h-[2px]"
                    aria-hidden
                  >
                    <div
                      className={`h-full rounded-full ${
                        isFirst
                          ? "bg-gradient-to-r from-gold via-gold-soft/80 to-white/20"
                          : "bg-gradient-to-r from-white/25 via-white/15 to-white/10"
                      }`}
                    />
                  </div>
                ) : null}
                <div
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-xs font-extrabold transition ${
                    isFirst
                      ? "bg-gold text-navy shadow-[0_0_24px_rgb(196_160_53_/_0.4)] ring-2 ring-gold-soft/50"
                      : "border-2 border-gold/45 bg-navy text-gold-soft shadow-lg shadow-black/25"
                  }`}
                >
                  {s.n}
                </div>
                <div
                  className={`mt-5 w-full rounded-2xl border p-4 transition duration-300 hover:border-gold/30 hover:bg-white/[0.09] ${
                    isFirst
                      ? "border-gold/30 bg-white/[0.08]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <h3 className="section-h3 text-white">{s.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-blue-100/90">
                    {s.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
