const site = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3020";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Nhị Gia",
  alternateName: "Công ty Cổ phần Đầu tư Thương mại và Dịch vụ Nhị Gia",
  url: "https://nhigia.vn",
  telephone: "19006654",
  email: "info@nhigia.vn",
  taxID: "0318691849",
  image: `${site}/images/og.webp`,
  logo: `${site}/images/brand/logo-color.webp`,
  sameAs: ["https://nhigia.vn"],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "186-188 Nguyễn Duy, P.Chánh Hưng",
      addressLocality: "Hồ Chí Minh",
      addressCountry: "VN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "T608 phố Tôn Quang Phiệt, phường Nghĩa Đô",
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
  areaServed: "VN",
  description:
    "Dịch vụ visa Việt Nam, giấy phép lao động, E-Visa, thẻ tạm trú và thủ tục di trú trọn gói. Hơn 20 năm kinh nghiệm.",
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Nhị Gia làm những dịch vụ gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nhị Gia chuyên visa, GPLĐ, thẻ tạm trú, công văn nhập cảnh, E-Visa, hợp pháp hóa lãnh sự; hộ chiếu, thẻ APEC, lý lịch tư pháp; và dịch vụ VIP như hồi hương, nhập tịch.",
      },
    },
    {
      "@type": "Question",
      name: "Liên hệ Nhị Gia thế nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gọi 1900 6654 hoặc email info@nhigia.vn. TP.HCM: 186-188 Nguyễn Duy, P.Chánh Hưng. Hà Nội: T608 Tôn Quang Phiệt, Nghĩa Đô.",
      },
    },
    {
      "@type": "Question",
      name: "Có làm giấy phép lao động không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có. Nhị Gia hỗ trợ giấy phép lao động cho người nước ngoài, kèm tư vấn visa/thẻ tạm trú nếu cần.",
      },
    },
    {
      "@type": "Question",
      name: "Có làm E-Visa Việt Nam không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có. Nhị Gia hỗ trợ tư vấn và hoàn tất thủ tục E-Visa theo quy định hiện hành.",
      },
    },
  ],
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
