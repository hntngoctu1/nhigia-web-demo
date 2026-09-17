import SectionHeader from "@/components/SectionHeader";

const items = [
  {
    role: "Doanh nghiệp FDI · GPLĐ",
    text: "Được hướng dẫn rõ giấy tờ cần cho giấy phép lao động. Tiến độ báo đúng các mốc đã thống nhất.",
  },
  {
    role: "Đoàn công tác · Visa",
    text: "Tư vấn trách nhiệm khi nhóm cần visa gấp. Sắp xếp lịch phù hợp lịch trình công tác.",
  },
  {
    role: "Cá nhân · Di trú",
    text: "Giải thích quy trình và giấy tờ cần thiết. Phản hồi nhanh trong giờ hành chính.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white section-y">
      <div className="container-page">
        <SectionHeader
          eyebrow="Phản hồi"
          title="Những gì khách thường kể lại"
          lead="Minh họa trải nghiệm tư vấn — không phải khảo sát định lượng hay cam kết kết quả."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <blockquote key={t.role} className="card relative flex flex-col p-7">
              <span
                className="pointer-events-none absolute right-5 top-2 select-none font-serif text-6xl leading-none text-gold/20"
                aria-hidden
              >
                “
              </span>
              <p className="relative z-[1] flex-1 text-sm leading-relaxed text-slate-700">
                {t.text}
              </p>
              <footer className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-navy">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
