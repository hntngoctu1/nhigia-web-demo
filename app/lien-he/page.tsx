import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ Nhị Gia — hotline 1900 6654, email info@nhigia.vn, văn phòng TP.HCM và Hà Nội.",
  alternates: { canonical: "/lien-he" },
};

const offices = [
  {
    city: "TP. Hồ Chí Minh",
    role: "Trụ sở",
    address: "186–188 Nguyễn Duy, Phường Chánh Hưng, TP. Hồ Chí Minh",
    mapQuery: "186-188 Nguyễn Duy, Chánh Hưng, Hồ Chí Minh",
    email: "info@nhigia.vn",
    tel: "[84-28] 3834 5588",
    telHref: "tel:+842838345588",
  },
  {
    city: "Hà Nội",
    role: "Văn phòng",
    address: "Tòa T608, phố Tôn Quang Phiệt, phường Nghĩa Đô, Hà Nội",
    mapQuery: "Tòa T608 Tôn Quang Phiệt Nghĩa Đô Hà Nội",
    email: "vphn@nhigia.vn",
    tel: null as string | null,
    telHref: null as string | null,
  },
];

export default function LienHePage() {
  return (
    <>
      <main id="main-content">
        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              as="h1"
              eyebrow="Liên hệ"
              title="Để lại thông tin — chúng tôi sẽ gọi lại"
              lead="Hoặc gọi ngay tổng đài 1900 6654 / email info@nhigia.vn. Hai văn phòng TP.HCM & Hà Nội sẵn sàng tiếp nhận."
              cta={
                <div className="flex flex-wrap gap-3">
                  <a href="tel:19006654" className="btn-gold">
                    Gọi 1900 6654
                  </a>
                  <a href="mailto:info@nhigia.vn" className="btn-secondary">
                    Email info@nhigia.vn
                  </a>
                </div>
              }
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {offices.map((o) => {
                const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(o.mapQuery)}&z=15&output=embed`;
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery)}`;
                return (
                  <article
                    key={o.city}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[16/9] bg-navy/10">
                      <iframe
                        title={`Bản đồ ${o.city}`}
                        src={mapSrc}
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-5 sm:p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-gold">
                        {o.role}
                      </p>
                      <h2 className="mt-1 text-xl font-extrabold text-navy">
                        {o.city}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {o.address}
                      </p>
                      <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="font-semibold text-navy">Email</dt>
                          <dd>
                            <a
                              className="prose-link font-medium"
                              href={`mailto:${o.email}`}
                            >
                              {o.email}
                            </a>
                          </dd>
                        </div>
                        {o.tel && o.telHref ? (
                          <div className="flex flex-wrap gap-x-2">
                            <dt className="font-semibold text-navy">Điện thoại</dt>
                            <dd>
                              <a className="prose-link font-medium" href={o.telHref}>
                                {o.tel}
                              </a>
                            </dd>
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="font-semibold text-navy">Hotline</dt>
                          <dd>
                            <a className="prose-link font-bold" href="tel:19006654">
                              1900 6654
                            </a>
                          </dd>
                        </div>
                      </dl>
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary mt-5 text-xs"
                      >
                        Mở trên Google Maps
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold">
                  Giờ làm việc
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  T2–T6: 08:00–17:30
                  <br />
                  T7: 08:00–12:00
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold">
                  Email chung
                </p>
                <p className="mt-2 text-sm">
                  <a className="prose-link font-semibold" href="mailto:info@nhigia.vn">
                    info@nhigia.vn
                  </a>
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold">
                  Mã số thuế
                </p>
                <p className="mt-2 text-sm font-semibold text-navy">0318691849</p>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              <aside className="lg:col-span-2">
                <h2 className="text-lg font-bold text-navy">Câu hỏi thường gặp</h2>
                <p className="mt-1 text-sm text-muted">
                  Thông tin tham khảo — không thay thế tư vấn hồ sơ cụ thể.
                </p>
                <FaqAccordion className="mt-5" />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
