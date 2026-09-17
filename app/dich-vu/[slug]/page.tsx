import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { SERVICES, getService } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Dịch vụ" };
  return {
    title: s.title,
    description: s.summary,
    alternates: { canonical: `/dich-vu/${s.slug}` },
    openGraph: {
      images: [{ url: s.image, alt: s.title }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const related = (s.related || []).map((r) => getService(r)).filter(Boolean);

  return (
    <>
      <main id="main-content">
        <div className="relative aspect-[21/9] max-h-[340px] w-full overflow-hidden bg-navy/10 sm:aspect-[3/1]">
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/35 to-navy/10"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8">
            <nav className="mb-3 text-xs text-blue-200" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white">
                Trang chủ
              </Link>
              <span className="mx-2 opacity-60" aria-hidden>
                /
              </span>
              <Link href="/dich-vu" className="hover:text-white">
                Dịch vụ
              </Link>
              <span className="mx-2 opacity-60" aria-hidden>
                /
              </span>
              <span className="text-white">{s.title}</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-gold">
              {s.audience}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {s.title}
            </h1>
          </div>
        </div>
        <article className="section-y mx-auto max-w-3xl px-4">
          <p className="text-lg leading-relaxed text-slate-700">{s.summary}</p>
          <ul className="mt-8 space-y-3">
            {s.bullets.map((b) => (
              <li
                key={b}
                className="card flex gap-3 px-4 py-3 text-sm text-slate-700 hover:shadow-md"
              >
                <span className="mt-0.5 font-bold text-[color:var(--gold)]" aria-hidden>
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border border-[color:rgb(201_162_39_/_0.28)] bg-navy p-6 text-white sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--gold-soft)]">
              Bước tiếp theo
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Gửi thông tin sơ bộ (quốc tịch, mục đích, thời điểm dự kiến) — chuyên
              viên rà soát điều kiện trước khi hẹn lịch. Không báo phí ảo trên web.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/lien-he" className="btn-gold">
              Nhận tư vấn miễn phí
            </Link>
            <a href="tel:19006654" className="btn-secondary">
              Gọi 1900 6654
            </a>
            <Link
              href="/dich-vu"
              className="rounded-full px-5 py-3 text-sm font-semibold text-slate-600 hover:text-navy"
            >
              ← Tất cả dịch vụ
            </Link>
          </div>
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="text-lg font-bold text-navy">Dịch vụ liên quan</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((r) =>
                  r ? (
                    <li key={r.slug}>
                      <a
                        href={`/dich-vu/${r.slug}`}
                        className="card flex overflow-hidden hover:border-gold/40 hover:shadow-md"
                      >
                        <span className="relative block h-16 w-24 shrink-0 bg-navy/10">
                          <Image
                            src={r.image}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </span>
                        <span className="flex items-center px-4 py-3 text-sm font-semibold text-navy">
                          {r.title}
                        </span>
                      </a>
                    </li>
                  ) : null
                )}
              </ul>
            </section>
          )}
          <p className="mt-10 text-xs text-muted">
            Thông tin mang tính tham khảo. Phí và khả năng phê duyệt phụ thuộc hồ
            sơ thực tế — vui lòng liên hệ chuyên viên để được tư vấn chính xác.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
