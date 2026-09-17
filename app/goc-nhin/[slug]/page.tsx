import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { INSIGHTS, getInsight } from "@/lib/insights";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INSIGHTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return { title: "Góc nhìn" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/goc-nhin/${article.slug}` },
  };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  return (
    <>
      <main id="main-content" className="min-h-screen bg-surface py-16 sm:py-24">
        <article className="container-page max-w-3xl">
          <Link
            href="/#tin-tuc"
            className="text-sm font-semibold text-navy hover:underline"
          >
            ← Về Góc nhìn
          </Link>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
              <span>{article.tag}</span>
              <time dateTime={article.date}>{article.dateLabel}</time>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {article.excerpt}
            </p>
            <div className="mt-10 border-t border-slate-100 pt-8 text-sm leading-8 text-slate-700">
              <p>
                Nội dung tư vấn phụ thuộc hồ sơ và quy định tại thời điểm xử lý.
                Nhị Gia khuyến nghị kiểm tra điều kiện cụ thể trước khi chuẩn bị
                giấy tờ hoặc đặt lịch khởi hành.
              </p>
              <p className="mt-4">
                Để được rà soát trường hợp của bạn, hãy{" "}
                <Link href="/lien-he" className="font-bold text-navy underline">
                  đặt lịch tư vấn
                </Link>{" "}
                hoặc gọi 1900 6654.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
