"use client";

import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const reasons = [
  {
    title: "Hơn 20 năm kinh nghiệm",
    desc: "Đồng hành cùng khách hàng doanh nghiệp và cá nhân trên nhiều lĩnh vực visa · di trú.",
  },
  {
    title: "Minh bạch hợp đồng",
    desc: "Phạm vi công việc, phí và trách nhiệm được nêu rõ trước khi triển khai — không khoản ẩn.",
  },
  {
    title: "Cập nhật tiến độ",
    desc: "Thường xuyên thông báo trạng thái hồ sơ; bạn nắm được từng bước đang xử lý.",
  },
  {
    title: "Không cam kết đậu ảo",
    desc: "Không hứa bảo đảm đậu visa / GPLĐ. Kết quả thuộc thẩm quyền cơ quan nhà nước.",
  },
  {
    title: "Xử lý hồ sơ linh hoạt",
    desc: "Rà soát và xử lý phù hợp theo từng trường hợp cụ thể, không khuôn mẫu cứng.",
  },
  {
    title: "Hỗ trợ hai đầu HCM · HN",
    desc: "Văn phòng TP.HCM và Hà Nội — hotline 1900 6654 trong giờ làm việc.",
  },
];

const compliance = [
  {
    title: "Minh bạch hợp đồng",
    desc: "Nội dung dịch vụ và chi phí được thống nhất bằng văn bản trước khi nhận hồ sơ.",
  },
  {
    title: "Cập nhật tiến độ",
    desc: "Theo dõi và phản hồi tiến độ theo từng mốc thủ tục quan trọng.",
  },
  {
    title: "Không cam kết đậu ảo",
    desc: "Tư vấn dựa trên quy định hiện hành; không quảng cáo tỷ lệ đậu bịa đặt.",
  },
];

const photos = [
  {
    src: "/images/hero/hero-consult.webp",
    alt: "Buổi tư vấn hồ sơ tại văn phòng",
  },
  {
    src: "/images/hero/mood-reception.webp",
    alt: "Không gian tiếp khách chuyên nghiệp",
  },
  {
    src: "/images/hero/hero-boardroom.webp",
    alt: "Làm việc với doanh nghiệp và chuyên gia",
  },
  {
    src: "/images/hero/hero-skyline.webp",
    alt: "Hai đầu hỗ trợ tại thành phố lớn",
  },
];

export default function Trust() {
  const { m } = useI18n();
  return (
    <section
      id="uy-tin"
      className="bg-surface section-y"
      aria-labelledby="trust-heading"
    >
      <div className="container-page">
        <SectionHeader
          eyebrow={m.trust.eye}
          title={m.trust.title}
          lead={m.trust.title}
        />
        <h2 id="trust-heading" className="sr-only">
          Uy tín và cam kết
        </h2>

        <div className="mb-12 grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-4">
          {photos.map((p) => (
            <div
              key={p.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)+0.125rem)] bg-navy/10 shadow-[0_8px_24px_-12px_rgb(15_23_42_/_0.2)] ring-1 ring-slate-200/70"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="reveal card card-lift p-6 sm:p-7">
              <div
                className="mb-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-[color:var(--gold)] to-[color:var(--gold-soft)]"
                aria-hidden
              />
              <h3 className="text-[0.95rem] font-bold text-navy sm:text-base">{r.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Compliance / trust row — honest disclaimers */}
        <div
          className="mt-12 rounded-[1.25rem] border border-[color:rgb(201_162_39_/_0.28)] bg-gradient-to-br from-navy via-navy to-navy-2 p-7 text-white shadow-[0_20px_40px_-16px_rgb(10_26_50_/_0.45)] sm:p-9"
          role="region"
          aria-label="Cam kết minh bạch"
        >
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold-soft)]">
            Cam kết làm việc
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {compliance.map((c) => (
              <div key={c.title}>
                <h3 className="text-sm font-extrabold tracking-tight text-white">{c.title}</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-blue-100/95 sm:text-[0.8rem]">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 border-t border-white/12 pt-7 sm:grid-cols-4">
            {[
              ["Hơn 20 năm", "Kinh nghiệm đồng hành"],
              ["HCM & HN", "Hai điểm hỗ trợ"],
              ["MST 0318691849", "Doanh nghiệp đăng ký"],
              ["1900 6654", "Tổng đài tư vấn"],
            ].map(([n, l]) => (
              <div key={l} className="text-center sm:text-left">
                <div className="text-sm font-extrabold text-[color:var(--gold-soft)] sm:text-base">
                  {n}
                </div>
                <div className="mt-1 text-[11px] text-blue-100">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
