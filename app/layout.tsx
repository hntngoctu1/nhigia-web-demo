import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import MobileCtaBar from "@/components/MobileCtaBar";
import DesktopStickyCta from "@/components/DesktopStickyCta";
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"], // medium(500) used in nav/forms
  display: "swap",
});

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3020";

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Nhị Gia | Dịch vụ visa & di trú trọn gói",
    template: "%s | Nhị Gia",
  },
  description:
    "Nhị Gia — hơn 20 năm đồng hành visa Việt Nam, GPLĐ, E-Visa, thẻ tạm trú và thủ tục di trú. Hotline 1900 6654 · TP.HCM & Hà Nội.",
  keywords: [
    "visa Việt Nam",
    "giấy phép lao động",
    "E-Visa",
    "thẻ tạm trú",
    "Nhị Gia",
    "di trú",
    "công văn nhập cảnh",
  ],
  authors: [{ name: "Nhị Gia" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/images/brand/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/images/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: site,
    siteName: "Nhị Gia",
    title: "Nhị Gia | Dịch vụ visa & di trú trọn gói",
    description:
      "Dịch vụ trọn gói an tâm mọi hành trình — visa, GPLĐ, E-Visa. Hotline 1900 6654.",
    images: [{ url: "/images/og.webp", width: 1200, height: 630, alt: "Nhị Gia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nhị Gia | Visa & di trú trọn gói",
    description: "Hơn 20 năm kinh nghiệm · Hotline 1900 6654",
    images: ["/images/og.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.variable} antialiased`}>
        <I18nProvider>
          <a href="#main-content" className="skip-link">
            Skip / Bỏ qua
          </a>
          <JsonLd />
          <Header />
          {children}
          <MobileCtaBar />
          <DesktopStickyCta />
          <ChatWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
