"use client";

import FaqAccordion from "@/components/FaqAccordion";
import SectionHeader from "@/components/SectionHeader";
import { useI18n } from "@/lib/i18n";

export default function HomeFaq() {
  const { m } = useI18n();
  return (
    <section id="faq" className="bg-white section-y">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              className="mb-0 md:mb-0"
              eyebrow={m.faq.eye}
              title={m.faq.title}
              lead={m.faq.lead}
              cta={
                <a href="/lien-he" className="btn-gold">
                  {m.faq.cta}
                </a>
              }
            />
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion />
          </div>
        </div>
      </div>
    </section>
  );
}
