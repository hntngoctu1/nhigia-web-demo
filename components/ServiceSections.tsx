"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { serviceImage } from "@/lib/services";
import SectionHeader from "@/components/SectionHeader";

type Card = { title: string; desc: string; slug: string };

function Grid({
  title,
  subtitle,
  items,
  id,
}: {
  title: string;
  subtitle: string;
  items: Card[];
  id?: string;
}) {
  return (
    <div id={id}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-navy sm:text-2xl">{title}</h3>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/dich-vu/${item.slug}`}
            className="card card-lift group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[16/11] overflow-hidden bg-navy/10">
              <Image
                src={serviceImage(item.slug)}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent"
                aria-hidden
              />
              <h4 className="absolute inset-x-0 bottom-0 p-5 text-base font-bold leading-snug text-white drop-shadow-sm sm:text-[1.05rem]">
                {item.title}
              </h4>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy transition group-hover:gap-2">
                Xem chi tiết →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const foreign: Card[] = [
  {
    slug: "visa-viet-nam",
    title: "Visa Việt Nam",
    desc: "Hỗ trợ xin visa Việt Nam cho người nước ngoài nhập cảnh, lưu trú đúng quy định.",
  },
  {
    slug: "giay-phep-lao-dong",
    title: "Giấy phép lao động (GPLĐ)",
    desc: "Tư vấn và hoàn thiện hồ sơ giấy phép lao động cho người nước ngoài.",
  },
  {
    slug: "the-tam-tru",
    title: "Thẻ tạm trú",
    desc: "Làm thẻ tạm trú — lựa chọn ưu tiên cho lưu trú dài hạn tại Việt Nam.",
  },
  {
    slug: "cong-van-nhap-canh",
    title: "Công văn nhập cảnh",
    desc: "Công văn nhập cảnh giúp người nước ngoài nhập cảnh theo đúng thủ tục.",
  },
  {
    slug: "e-visa-viet-nam",
    title: "E-Visa Việt Nam",
    desc: "Hỗ trợ thị thực điện tử (E-Visa) theo quy định hiện hành.",
  },
  {
    slug: "hop-phap-hoa-lanh-su",
    title: "Hợp pháp hóa lãnh sự",
    desc: "Chứng nhận con dấu, chữ ký trên giấy tờ phục vụ thủ tục pháp lý.",
  },
];

const vn: Card[] = [
  {
    slug: "ho-chieu",
    title: "Hộ chiếu",
    desc: "Hỗ trợ thủ tục hộ chiếu Việt Nam phục vụ xuất cảnh và đi lại quốc tế.",
  },
  {
    slug: "the-apec",
    title: "Thẻ APEC",
    desc: "Tư vấn thẻ APEC cho doanh nhân — hạn 5 năm, hồ sơ theo quy định.",
  },
  {
    slug: "ly-lich-tu-phap",
    title: "Lý lịch tư pháp",
    desc: "Phiếu lý lịch tư pháp cho xin việc, chứng chỉ hành nghề, visa và thủ tục hành chính.",
  },
];

const vip: Card[] = [
  {
    slug: "hoi-huong",
    title: "Hồi hương",
    desc: "Thủ tục hồi hương cho Việt kiều muốn về nước định cư đúng điều kiện pháp luật.",
  },
  {
    slug: "nhap-tich",
    title: "Nhập tịch",
    desc: "Tư vấn điều kiện, hồ sơ nhập tịch Việt Nam cho người nước ngoài.",
  },
  {
    slug: "thue-nha-chuyen-gia",
    title: "Thuê nhà cho chuyên gia",
    desc: "Hỗ trợ thuê nhà gần nơi làm việc, thuận tiện di chuyển cho chuyên gia.",
  },
];

export default function ServiceSections() {
  const { m } = useI18n();
  return (
    <section id="dich-vu" className="bg-surface section-y">
      <div className="container-page space-y-14">
        <SectionHeader
          eyebrow={m.svcSec.eye}
          title={m.svcSec.title}
          lead={m.svcSec.lead}
          cta={
            <Link href="/dich-vu" className="btn-secondary text-sm">
              {m.svcSec.all}
            </Link>
          }
        />
        <Grid
          title={m.svcSec.nnTitle}
          subtitle={m.svcSec.nnSub}
          items={foreign}
        />
        <Grid
          title={m.svcSec.vnTitle}
          subtitle={m.svcSec.vnSub}
          items={vn}
        />
        <Grid
          title={m.svcSec.vipTitle}
          subtitle={m.svcSec.vipSub}
          items={vip}
        />
      </div>
    </section>
  );
}
