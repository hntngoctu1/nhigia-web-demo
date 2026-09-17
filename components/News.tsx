"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { INSIGHTS } from "@/lib/insights";
import { useI18n } from "@/lib/i18n";

export default function News() {
  const { m } = useI18n();
  const [featured, ...rest] = INSIGHTS;

  return (
    <section
      id="tin-tuc"
      className="bg-surface section-y"
      aria-labelledby="insights-heading"
    >
      <div className="container-page">
        <SectionHeader
          eyebrow={m.news.eye}
          title={m.news.title}
          lead={m.news.lead}
        />
        <h2 id="insights-heading" className="sr-only">
          Góc nhìn và cập nhật
        </h2>

        <div className="grid gap-7 lg:grid-cols-5 lg:gap-9">
          <article className="reveal card card-lift group lg:col-span-3">
            <Link href={`/goc-nhin/${featured.slug}`} className="block">
              <div className="relative aspect-[16/10] overflow-hidden bg-navy/10">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold uppercase tracking-[0.12em] text-navy/55">
                    {featured.tag}
                  </span>
                  <time dateTime={featured.date} className="font-medium text-muted">
                    {featured.dateLabel}
                  </time>
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-navy sm:text-2xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {featured.excerpt}
                </p>
                <span className="mt-4 inline-flex text-sm font-bold text-navy">
                  Đọc bài →
                </span>
              </div>
            </Link>
          </article>

          <div className="flex flex-col gap-3.5 lg:col-span-2">
            {rest.map((p) => (
              <article key={p.slug} className="reveal card transition hover:shadow-lg">
                <Link href={`/goc-nhin/${p.slug}`} className="flex gap-3.5 p-3.5 sm:gap-4 sm:p-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-navy/10 sm:h-24 sm:w-28">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="font-bold uppercase tracking-[0.12em] text-navy/50">
                        {p.tag}
                      </span>
                      <time dateTime={p.date} className="text-muted">
                        {p.dateLabel}
                      </time>
                    </div>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-navy line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1 hidden text-xs text-slate-600 line-clamp-2 sm:block">
                      {p.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
