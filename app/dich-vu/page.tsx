import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import {
  SERVICE_GROUPS,
  SERVICES,
  servicesByPath,
  type ServicePath,
} from "@/lib/services";

export const metadata: Metadata = {
  title: "Danh mục dịch vụ",
  description:
    "Visa Việt Nam, GPLĐ, E-Visa, thẻ tạm trú, hộ chiếu, APEC và dịch vụ VIP tại Nhị Gia.",
  alternates: { canonical: "/dich-vu" },
};

type Props = {
  searchParams: Promise<{ for?: string }>;
};

export default async function DichVuIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const forParam =
    sp.for === "dn" || sp.for === "cn" ? (sp.for as ServicePath) : null;
  const filtered = servicesByPath(forParam);

  const filterLabel =
    forParam === "dn"
      ? "Doanh nghiệp"
      : forParam === "cn"
        ? "Cá nhân / chuyên gia"
        : null;

  const groups = SERVICE_GROUPS.map((g) => ({
    ...g,
    items: filtered.filter((s) => s.group === g.id),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <main id="main-content">
        <div className="relative overflow-hidden bg-navy text-white">
          <div className="absolute inset-0">
            <Image
              src="/images/hero/hero-skyline.webp"
              alt="Bối cảnh dịch vụ visa và di trú Nhị Gia"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/60"
              aria-hidden
            />
          </div>
          <div className="relative container-page py-12 md:py-16">
            <nav className="text-xs text-blue-200" aria-label="Breadcrumb">
              <a href="/" className="hover:text-white">
                Trang chủ
              </a>
              <span className="mx-2 opacity-60" aria-hidden>
                /
              </span>
              <span className="text-white">Dịch vụ</span>
              {filterLabel ? (
                <>
                  <span className="mx-2 opacity-60" aria-hidden>
                    /
                  </span>
                  <span className="text-[color:var(--gold-soft)]">
                    {filterLabel}
                  </span>
                </>
              ) : null}
            </nav>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold-soft)]">
              Danh mục
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {filterLabel
                ? `Dịch vụ cho ${filterLabel}`
                : "Danh mục dịch vụ Nhị Gia"}
            </h1>
            <p className="mt-3 max-w-2xl text-blue-100">
              Chọn dịch vụ phù hợp — tư vấn miễn phí qua hotline 1900 6654 hoặc
              form liên hệ. Không cam kết kết quả đậu ảo.
            </p>

            <div
              className="mt-6 inline-flex flex-wrap items-center gap-1.5 rounded-full border border-white/15 bg-black/20 p-1.5 backdrop-blur-sm"
              role="group"
              aria-label="Lọc theo đối tượng"
            >
              <span className="hidden px-2 text-[10px] font-bold uppercase tracking-wider text-blue-200/70 sm:inline">
                Đối tượng
              </span>
              <a
                href="/dich-vu"
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  !forParam
                    ? "bg-white text-navy shadow-sm ring-1 ring-gold/40"
                    : "text-blue-50 hover:bg-white/15"
                }`}
                aria-current={!forParam ? "page" : undefined}
              >
                Tất cả
              </a>
              <a
                href="/dich-vu?for=dn"
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  forParam === "dn"
                    ? "bg-white text-navy shadow-sm ring-1 ring-gold/40"
                    : "text-blue-50 hover:bg-white/15"
                }`}
                aria-current={forParam === "dn" ? "page" : undefined}
              >
                DN
                <span className="ml-1 hidden font-semibold opacity-70 sm:inline">
                  · Doanh nghiệp
                </span>
              </a>
              <a
                href="/dich-vu?for=cn"
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  forParam === "cn"
                    ? "bg-white text-navy shadow-sm ring-1 ring-gold/40"
                    : "text-blue-50 hover:bg-white/15"
                }`}
                aria-current={forParam === "cn" ? "page" : undefined}
              >
                CN
                <span className="ml-1 hidden font-semibold opacity-70 sm:inline">
                  · Cá nhân
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="section-y">
          <div className="container-page space-y-12">
            {groups.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                Không có dịch vụ trong bộ lọc này.{" "}
                <a href="/dich-vu" className="prose-link font-semibold">
                  Xem tất cả
                </a>
              </p>
            ) : (
              groups.map((g) => (
                <section key={g.id} id={g.id} className="scroll-mt-28">
                  <h2 className="section-title text-navy">{g.label}</h2>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((s) => (
                      <li key={s.slug}>
                        <a
                          href={`/dich-vu/${s.slug}`}
                          className="card group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 hover:shadow-md"
                        >
                          <span className="relative block aspect-[16/10] overflow-hidden bg-navy/10">
                            <Image
                              src={s.image}
                              alt={`Dịch vụ ${s.title} — Nhị Gia`}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span
                              className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent"
                              aria-hidden
                            />
                          </span>
                          <span className="block p-5">
                            <span className="block font-semibold text-navy">
                              {s.title}
                            </span>
                            <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                              {s.summary}
                            </p>
                            <span className="mt-3 inline-block text-sm font-semibold text-navy">
                              Chi tiết →
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}

            <p className="text-center text-sm text-muted">
              Đang hiển thị {filtered.length}/{SERVICES.length} dịch vụ
              {filterLabel ? ` · lọc “${filterLabel}”` : ""}.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
