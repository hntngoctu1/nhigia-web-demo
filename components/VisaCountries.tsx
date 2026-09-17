"use client";

import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

const countries = [
  {
    name: "Trung Quốc",
    image: "/images/visa/visa-trung-quoc.webp",
  },
  {
    name: "Mỹ",
    image: "/images/visa/visa-my-1.webp",
  },
  {
    name: "Đài Loan",
    image: "/images/visa/visa-dai-loan.webp",
  },
  {
    name: "Úc",
    image: "/images/visa/visa-uc.webp",
  },
  {
    name: "Hàn Quốc",
    image: "/images/visa/visa-han-quoc.webp",
  },
  {
    name: "Nhật Bản",
    image: "/images/visa/visa-nhat-ban.webp",
  },
];

export default function VisaCountries() {
  const { m } = useI18n();
  return (
    <section id="visa-nuoc-ngoai" className="bg-white section-y">
      <div className="container-page">
        <SectionHeader
          eyebrow={m.countries.eye}
          title={m.countries.title}
          lead={m.countries.lead}
        />
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {countries.map((c) => (
            <div
              key={c.name}
              className="card card-lift group overflow-hidden"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-navy/10">
                <Image
                  src={c.image}
                  alt={`Visa ${c.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
              <div className="px-3 py-3.5 text-center text-sm font-semibold tracking-tight text-navy">
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
