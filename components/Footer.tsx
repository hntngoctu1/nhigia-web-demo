"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { m } = useI18n();
  return (
    <footer role="contentinfo" className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div>
          <Link href="/#top" className="inline-flex items-center gap-3">
            <Image
              src="/images/brand/logo-white.webp"
              alt="Nhị Gia — Trọn gói an tâm"
              width={200}
              height={60}
              className="h-12 w-auto sm:h-14"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-blue-100">
            {m.footer.company}
          </p>
          <p className="mt-3 text-sm text-blue-50">
            MST: <span className="font-semibold">0318691849</span>
          </p>
          <p className="mt-2 text-sm">
            Hotline:{" "}
            <a
              className="font-semibold underline decoration-white/40 hover:decoration-white"
              href="tel:19006654"
            >
              1900 6654
            </a>
          </p>
          <p className="mt-1 text-sm">
            Email:{" "}
            <a
              className="underline decoration-white/40 hover:decoration-white"
              href="mailto:info@nhigia.vn"
            >
              info@nhigia.vn
            </a>
          </p>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--gold-soft)]">
            {m.footer.address}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">
            <span className="font-medium text-white">TP.HCM:</span> 186–188
            Nguyễn Duy, P.Chánh Hưng, TP. Hồ Chí Minh
          </p>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">
            <span className="font-medium text-white">Hà Nội:</span> tòa T608 phố
            Tôn Quang Phiệt, phường Nghĩa Đô, Hà Nội
          </p>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--gold-soft)]">
            {m.footer.hours}
          </div>
          <p className="mt-3 text-sm text-blue-100">{m.footer.weekday}</p>
          <p className="mt-1 text-sm text-blue-100">{m.footer.saturday}</p>
          <a href="tel:19006654" className="btn-gold mt-5">
            {m.footer.callNow}
          </a>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--gold-soft)]">
            {m.footer.legal}
          </div>
          <ul className="mt-3 space-y-2.5 text-sm text-blue-100">
            <li>
              <Link className="hover:text-white hover:underline" href="/dich-vu">
                {m.footer.catalog}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/mo-hinh-ai">
                {m.nav.tech}
              </Link>
            </li>
            <li>
              <a className="hover:text-white hover:underline" href="/lien-he">
                {m.footer.contact}
              </a>
            </li>
            <li>
              <a
                className="hover:text-white hover:underline"
                href="/chinh-sach-bao-mat"
              >
                {m.footer.privacy}
              </a>
            </li>
            <li>
              <a className="hover:text-white hover:underline" href="/dieu-khoan">
                {m.footer.terms}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-center text-xs text-blue-200/90 sm:flex-row sm:text-left">
          <p>
            {m.footer.copy}{" "}
            <span className="font-semibold text-blue-100">0318691849</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a className="hover:text-white hover:underline" href="/chinh-sach-bao-mat">
              {m.footer.privacyShort}
            </a>
            <a className="hover:text-white hover:underline" href="/dieu-khoan">
              {m.footer.termsShort}
            </a>
            <a className="hover:text-white hover:underline" href="tel:19006654">
              1900 6654
            </a>
          </div>
        </div>
        <p className="border-t border-white/5 px-4 py-2.5 text-center text-[10px] text-blue-200/55">
          {m.footer.note}
        </p>
      </div>
    </footer>
  );
}
