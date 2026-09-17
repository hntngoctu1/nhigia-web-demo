export type Insight = {
  slug: string;
  tag: string;
  date: string;
  dateLabel: string;
  title: string;
  excerpt: string;
  image: string;
};

export const INSIGHTS: Insight[] = [
  {
    slug: "di-trung-quoc-co-can-visa-khong",
    tag: "Cẩm nang",
    date: "2025-08-12",
    dateLabel: "12/08/2025",
    title: "Đi Trung Quốc có cần visa không? Quy định mới",
    excerpt:
      "Với công dân Việt Nam mang hộ chiếu phổ thông, nên xác nhận điều kiện trước khi khởi hành.",
    image: "/images/news/di-trung-quoc-co-can-visa-khong.webp",
  },
  {
    slug: "mien-visa-qua-canh-trung-quoc-240-gio",
    tag: "Cập nhật",
    date: "2025-07-28",
    dateLabel: "28/07/2025",
    title: "Miễn visa quá cảnh Trung Quốc trong 240 giờ",
    excerpt:
      "Cập nhật chính sách quá cảnh — kiểm tra điều kiện áp dụng trước chuyến đi.",
    image: "/images/news/mien-visa-qua-canh.webp",
  },
  {
    slug: "viet-nam-ap-dung-cong-uoc-apostille",
    tag: "Pháp lý",
    date: "2025-06-15",
    dateLabel: "15/06/2025",
    title: "Việt Nam áp dụng Công ước Apostille",
    excerpt:
      "Một dấu mốc mới trong chứng nhận giấy tờ xuyên biên giới — ảnh hưởng hồ sơ di trú và pháp lý.",
    image: "/images/news/viet-nam-ap-dung-cong-uoc-apostille.webp",
  },
  {
    slug: "thong-bao-nghi-le-2-9",
    tag: "Thông báo",
    date: "2025-08-30",
    dateLabel: "30/08/2025",
    title: "Thông báo nghỉ lễ 2/9 — Nhị Gia",
    excerpt: "Lịch nghỉ và kênh liên hệ hỗ trợ khách hàng trong kỳ nghỉ lễ.",
    image: "/images/news/thong-bao-nghi-le-2-9-nhi-gia.webp",
  },
  {
    slug: "doanh-nghiep-chuan-bi-nhan-su-xuyen-bien-gioi",
    tag: "Doanh nghiệp",
    date: "2025-05-20",
    dateLabel: "20/05/2025",
    title: "Doanh nghiệp chuẩn bị gì cho nhân sự xuyên biên giới?",
    excerpt:
      "Gợi ý checklist GPLĐ, tạm trú và visa khi mở rộng đội ngũ quốc tế.",
    image: "/images/news/doanh-nghiep-can-chuan-bi.webp",
  },
  {
    slug: "viet-nam-efta-ket-thuc-dam-phan-fta",
    tag: "Cập nhật",
    date: "2025-04-08",
    dateLabel: "08/04/2025",
    title: "Việt Nam – EFTA kết thúc đàm phán FTA",
    excerpt:
      "Bối cảnh hội nhập và lưu ý thủ tục liên quan cho doanh nghiệp và chuyên gia.",
    image: "/images/news/viet-nam-efta.webp",
  },
];

export function getInsight(slug: string) {
  return INSIGHTS.find((p) => p.slug === slug);
}
