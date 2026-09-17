"use client";

import { useId, useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "Nhị Gia làm những dịch vụ gì?",
    a: "Nhị Gia chuyên visa Việt Nam, giấy phép lao động, thẻ tạm trú, công văn nhập cảnh, E-Visa và hợp pháp hóa lãnh sự cho người nước ngoài; hộ chiếu, thẻ APEC, lý lịch tư pháp cho khách Việt Nam; cùng các dịch vụ VIP như hồi hương, nhập tịch. Anh/chị cho biết thủ tục cần để được tư vấn cụ thể.",
  },
  {
    q: "Liên hệ Nhị Gia thế nào?",
    a: "Gọi tổng đài 1900 6654 hoặc email info@nhigia.vn. Trụ sở TP.HCM: 186–188 Nguyễn Duy, P.Chánh Hưng. Hà Nội: tòa T608 Tôn Quang Phiệt, Nghĩa Đô. Giờ làm việc T2–T6 08:00–17:30, T7 08:00–12:00.",
  },
  {
    q: "Quy trình làm hồ sơ ra sao?",
    a: "Gồm 5 bước: tư vấn đánh giá hồ sơ miễn phí → ký hợp đồng & nhận hồ sơ → hoàn thiện hồ sơ → nộp và theo dõi tiến độ → bàn giao kết quả và hỗ trợ sau dịch vụ. Thông tin sơ bộ giúp định hướng xử lý phù hợp từng trường hợp.",
  },
  {
    q: "Có làm giấy phép lao động / E-Visa không?",
    a: "Có. Nhị Gia hỗ trợ giấy phép lao động cho người nước ngoài và thị thực điện tử (E-Visa) theo quy định hiện hành. Nên cung cấp quốc tịch, mục đích nhập cảnh/làm việc và tình trạng giấy tờ hiện tại để kiểm tra điều kiện.",
  },
  {
    q: "Có hỗ trợ bảo lãnh / công văn nhập cảnh không?",
    a: "Có. Nhị Gia hỗ trợ công văn nhập cảnh (bảo lãnh) để người nước ngoài nhập cảnh đúng thủ tục. Doanh nghiệp hoặc cá nhân đủ điều kiện có thể nhờ chuẩn bị hồ sơ — vui lòng cho biết quốc tịch khách và mục đích nhập cảnh.",
  },
  {
    q: "Phí dịch vụ và cam kết kết quả như thế nào?",
    a: "Chi phí và thời gian phụ thuộc loại hồ sơ, quốc tịch và quy định tại thời điểm nộp — không có bảng giá chung trên website. Nhị Gia không cam kết chắc chắn đậu visa/GPLĐ trước khi thẩm định hồ sơ. Gọi 1900 6654 hoặc để lại form để được báo phí sau khi rà soát.",
  },
];

type Props = {
  items?: FaqItem[];
  className?: string;
};

export default function FaqAccordion({ items = DEFAULT_FAQS, className = "" }: Props) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, i) => {
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-btn-${i}`;
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-navy transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = (i + 1) % items.length;
                    document.getElementById(`${baseId}-btn-${next}`)?.focus();
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const prev = (i - 1 + items.length) % items.length;
                    document.getElementById(`${baseId}-btn-${prev}`)?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    document.getElementById(`${baseId}-btn-0`)?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    document
                      .getElementById(`${baseId}-btn-${items.length - 1}`)
                      ?.focus();
                  }
                }}
              >
                <span>{item.q}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-base font-normal text-muted transition ${
                    isOpen ? "rotate-45 border-gold/50 bg-gold/10 text-navy" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={isOpen ? "border-t border-slate-100" : undefined}
            >
              {isOpen ? (
                <p className="px-5 py-4 text-sm leading-relaxed text-slate-600">
                  {item.a}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
