export type ServiceAudience = "nn" | "vn" | "vip";
export type ServicePath = "dn" | "cn";

export type ServiceDetail = {
  slug: string;
  title: string;
  audience: string;
  group: ServiceAudience;
  /** Audience paths for /dich-vu?for=dn|cn */
  paths: ServicePath[];
  summary: string;
  bullets: string[];
  related?: string[];
  /** Cover image under /public/images/ */
  image: string;
};

export const SERVICE_GROUPS: {
  id: ServiceAudience;
  label: string;
  short: string;
  href: string;
}[] = [
  {
    id: "nn",
    label: "Người nước ngoài tại VN",
    short: "NN tại VN",
    href: "/dich-vu?for=dn#nn",
  },
  {
    id: "vn",
    label: "Việt Nam xuất cảnh",
    short: "VN xuất cảnh",
    href: "/dich-vu?for=cn#vn",
  },
  {
    id: "vip",
    label: "Dịch vụ VIP",
    short: "VIP",
    href: "/dich-vu#vip",
  },
];

export const SERVICES: ServiceDetail[] = [
  {
    slug: "visa-viet-nam",
    title: "Visa Việt Nam",
    audience: "Khách nước ngoài",
    group: "nn",
    paths: ["dn", "cn"],
    summary:
      "Hỗ trợ xin visa Việt Nam cho người nước ngoài nhập cảnh, lưu trú đúng quy định — từ tư vấn loại thị thực đến hoàn thiện hồ sơ.",
    bullets: [
      "Tư vấn loại visa phù hợp mục đích (du lịch, công tác, thăm thân…)",
      "Kiểm tra điều kiện theo quốc tịch và thời hạn hộ chiếu",
      "Hướng dẫn giấy tờ và theo dõi tiến độ",
    ],
    related: ["e-visa-viet-nam", "cong-van-nhap-canh", "the-tam-tru"],
    image: "/images/hero/svc-visa.webp",
  },
  {
    slug: "giay-phep-lao-dong",
    title: "Giấy phép lao động (GPLĐ)",
    audience: "Khách nước ngoài",
    group: "nn",
    paths: ["dn"],
    summary:
      "Tư vấn và hoàn thiện hồ sơ giấy phép lao động (work permit) cho người nước ngoài làm việc tại Việt Nam.",
    bullets: [
      "Rà soát điều kiện miễn/cấp GPLĐ theo từng trường hợp",
      "Hướng dẫn hồ sơ doanh nghiệp tiếp nhận và giấy tờ cá nhân",
      "Đồng bộ với visa / thẻ tạm trú khi cần",
    ],
    related: ["the-tam-tru", "visa-viet-nam", "hop-phap-hoa-lanh-su"],
    image: "/images/hero/svc-work.webp",
  },
  {
    slug: "the-tam-tru",
    title: "Thẻ tạm trú",
    audience: "Khách nước ngoài",
    group: "nn",
    paths: ["dn", "cn"],
    summary:
      "Làm thẻ tạm trú — lựa chọn ưu tiên cho lưu trú dài hạn tại Việt Nam gắn với mục đích hợp pháp.",
    bullets: [
      "Tư vấn điều kiện và thời hạn thẻ",
      "Chuẩn bị hồ sơ chứng minh mục đích lưu trú",
      "Hỗ trợ gia hạn / theo dõi tiến độ",
    ],
    related: ["giay-phep-lao-dong", "visa-viet-nam"],
    image: "/images/hero/hero-consult.webp",
  },
  {
    slug: "cong-van-nhap-canh",
    title: "Công văn nhập cảnh (bảo lãnh)",
    audience: "Khách nước ngoài",
    group: "nn",
    paths: ["dn"],
    summary:
      "Công văn nhập cảnh / bảo lãnh giúp người nước ngoài nhập cảnh Việt Nam đúng thủ tục theo mục đích được chấp thuận.",
    bullets: [
      "Tư vấn tư cách đơn vị/cá nhân bảo lãnh",
      "Đối chiếu thông tin hộ chiếu và mục đích nhập cảnh",
      "Hỗ trợ theo dõi kết quả công văn",
    ],
    related: ["visa-viet-nam", "e-visa-viet-nam"],
    image: "/images/hero/svc-invite.webp",
  },
  {
    slug: "e-visa-viet-nam",
    title: "E-Visa Việt Nam",
    audience: "Khách nước ngoài",
    group: "nn",
    paths: ["dn", "cn"],
    summary:
      "Hỗ trợ thị thực điện tử (E-Visa) theo quy định hiện hành — tư vấn điều kiện và hoàn tất thủ tục.",
    bullets: [
      "Kiểm tra quốc tịch thuộc diện E-Visa",
      "Hướng dẫn ảnh/hộ chiếu và thông tin chuyến đi",
      "Lưu ý xuất trình mã xác nhận khi nhập cảnh",
    ],
    related: ["visa-viet-nam", "cong-van-nhap-canh"],
    image: "/images/hero/mood-lounge.webp",
  },
  {
    slug: "hop-phap-hoa-lanh-su",
    title: "Hợp pháp hóa lãnh sự",
    audience: "Khách nước ngoài & Việt Nam",
    group: "nn",
    paths: ["dn", "cn"],
    summary:
      "Chứng nhận con dấu, chữ ký trên giấy tờ phục vụ thủ tục pháp lý (không xác nhận nội dung giấy tờ).",
    bullets: [
      "Tư vấn thứ tự chứng nhận / hợp pháp hóa",
      "Hướng dẫn dịch thuật công chứng khi cần",
      "Phục vụ hồ sơ GPLĐ, học tập, dân sự…",
    ],
    related: ["giay-phep-lao-dong", "ly-lich-tu-phap"],
    image: "/images/hero/mood-dossier.webp",
  },
  {
    slug: "ho-chieu",
    title: "Hộ chiếu",
    audience: "Khách Việt Nam",
    group: "vn",
    paths: ["cn"],
    summary:
      "Hỗ trợ thủ tục hộ chiếu Việt Nam phục vụ xuất cảnh và đi lại quốc tế (các loại theo quy định).",
    bullets: [
      "Tư vấn loại hộ chiếu phù hợp",
      "Hướng dẫn giấy tờ và địa điểm nộp",
      "Đồng bộ với visa nước ngoài nếu cần",
    ],
    related: ["the-apec", "ly-lich-tu-phap"],
    image: "/images/hero/hero-passport.webp",
  },
  {
    slug: "the-apec",
    title: "Thẻ APEC",
    audience: "Khách Việt Nam",
    group: "vn",
    paths: ["dn", "cn"],
    summary:
      "Tư vấn thẻ APEC cho doanh nhân — hạn 5 năm, hồ sơ theo quy định hiện hành.",
    bullets: [
      "Rà soát điều kiện doanh nhân / doanh nghiệp",
      "Hướng dẫn bộ hồ sơ và quy trình",
      "Lưu ý khi thay đổi thông tin doanh nghiệp",
    ],
    related: ["ho-chieu"],
    image: "/images/hero/svc-apec.webp",
  },
  {
    slug: "ly-lich-tu-phap",
    title: "Lý lịch tư pháp",
    audience: "Khách Việt Nam",
    group: "vn",
    paths: ["cn", "dn"],
    summary:
      "Phiếu lý lịch tư pháp phục vụ xin việc, chứng chỉ hành nghề, visa và thủ tục hành chính.",
    bullets: [
      "Tư vấn loại phiếu phù hợp mục đích",
      "Hướng dẫn hồ sơ và thời gian xử lý tham khảo",
      "Hỗ trợ sử dụng trong bộ hồ sơ liên quan",
    ],
    related: ["ho-chieu", "hop-phap-hoa-lanh-su"],
    image: "/images/hero/svc-records.webp",
  },
  {
    slug: "hoi-huong",
    title: "Hồi hương",
    audience: "VIP",
    group: "vip",
    paths: ["cn"],
    summary:
      "Thủ tục hồi hương cho Việt kiều muốn về nước định cư đúng điều kiện pháp luật.",
    bullets: [
      "Tư vấn điều kiện hồi hương",
      "Hướng dẫn giấy tờ chứng minh",
      "Đồng hành các bước liên quan định cư",
    ],
    related: ["nhap-tich"],
    image: "/images/hero/svc-homecoming.webp",
  },
  {
    slug: "nhap-tich",
    title: "Nhập tịch Việt Nam",
    audience: "VIP",
    group: "vip",
    paths: ["cn"],
    summary:
      "Tư vấn điều kiện, hồ sơ nhập tịch Việt Nam cho người nước ngoài.",
    bullets: [
      "Rà soát điều kiện theo luật quốc tịch",
      "Hướng dẫn hồ sơ và lộ trình",
      "Tư vấn quyền lợi công dân liên quan",
    ],
    related: ["hoi-huong", "the-tam-tru"],
    image: "/images/hero/mood-reception.webp",
  },
  {
    slug: "thue-nha-chuyen-gia",
    title: "Thuê nhà cho chuyên gia",
    audience: "VIP",
    group: "vip",
    paths: ["dn", "cn"],
    summary:
      "Hỗ trợ thuê nhà cho chuyên gia gần nơi làm việc, thuận tiện di chuyển.",
    bullets: [
      "Lắng nghe nhu cầu vị trí / ngân sách",
      "Gợi ý khu vực phù hợp lịch làm việc",
      "Hỗ trợ thủ tục thuê cơ bản",
    ],
    related: ["giay-phep-lao-dong", "the-tam-tru"],
    image: "/images/hero/mood-residence.webp",
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

/** Map slug → service cover image (for homepage cards). */
export function serviceImage(slug: string): string {
  return getService(slug)?.image ?? "/images/hero/hero-consult.webp";
}

export function servicesByPath(forParam?: string | null): ServiceDetail[] {
  if (forParam === "dn" || forParam === "cn") {
    return SERVICES.filter((s) => s.paths.includes(forParam));
  }
  return SERVICES;
}

export function servicesByGroup(group: ServiceAudience): ServiceDetail[] {
  return SERVICES.filter((s) => s.group === group);
}
