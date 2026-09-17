import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { INSIGHTS } from "@/lib/insights";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3020";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "/lien-he",
    "/mo-hinh-ai",
    "/chinh-sach-bao-mat",
    "/dieu-khoan",
    "/dich-vu",
  ].map((path) => ({
    url: `${site}${path || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const services = SERVICES.map((s) => ({
    url: `${site}/dich-vu/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const insights = INSIGHTS.map((p) => ({
    url: `${site}/goc-nhin/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...services, ...insights];
}
