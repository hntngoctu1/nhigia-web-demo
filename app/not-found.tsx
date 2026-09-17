import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
};

export default function NotFound() {
  return (
    <>
      <main
        id="main-content"
        className="relative overflow-hidden bg-navy section-y text-white"
      >
        <div
          className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,#60a5fa,transparent_45%)]"
          aria-hidden
        />
        <div className="relative container-page flex flex-col items-center text-center">
          <Image
            src="/images/brand/logo-white.webp"
            alt="Nhị Gia — Trọn gói an tâm"
            width={160}
            height={48}
            className="h-10 w-auto"
          />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-gold">
            404
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Không tìm thấy trang
          </h1>
          <span className="gold-rule mx-auto" aria-hidden />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100 sm:text-base">
            Đường dẫn có thể đã đổi hoặc không còn tồn tại. Quay về trang chủ hoặc liên
            hệ tổng đài để được hỗ trợ.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-gold">
              Về trang chủ
            </Link>
            <Link
              href="/lien-he"
              className="rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20"
            >
              Liên hệ tư vấn
            </Link>
            <a
              href="tel:19006654"
              className="rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-blue-50 transition hover:bg-white/10"
            >
              Gọi 1900 6654
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
