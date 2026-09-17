import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import OpenChatButton from "@/components/OpenChatButton";
import { Flow, RouterDiagram } from "@/components/AiModels";

export const metadata: Metadata = {
  title: "Mô hình chatbot AI",
  description:
    "Cách Nhị Gia dùng AI: điều phối intent, FAQ đã duyệt, RAG trên dữ liệu công ty, kết hợp nguồn chính thống — không bịa phí hay cam kết đậu.",
  alternates: { canonical: "/mo-hinh-ai" },
  robots: { index: true, follow: true },
};

const MODELS = [
  {
    id: "faq",
    kicker: "Mô hình 1",
    title: "FAQ tức thì — kiến thức đã duyệt",
    lead: "Dùng khi câu hỏi là sự thật cố định của công ty. Nhanh, đúng, không tốn AI.",
    why: "Khách yên tâm vì giờ làm việc, địa chỉ, MST, “có làm GPLĐ không?” không do máy “sáng tác”.",
    steps: [
      {
        n: "01",
        title: "Nhận diện chủ đề",
        body: "Giờ làm việc, liên hệ, từng dịch vụ, giấy tờ theo mạch hội thoại.",
        tone: "cream" as const,
      },
      {
        n: "02",
        title: "Lấy đúng FAQ",
        body: "Kho tri thức Nhị Gia — văn bản đã rà, không bảng giá ảo.",
        tone: "navy" as const,
      },
      {
        n: "03",
        title: "Trả lời ngay",
        body: "Không gọi mô hình ngôn ngữ. Độ trễ thấp, nội dung kiểm soát được.",
        tone: "gold" as const,
      },
    ],
  },
  {
    id: "rag",
    kicker: "Mô hình 2",
    title: "RAG — AI chỉ nói trên dữ liệu công ty",
    lead: "Retrieval-Augmented Generation: máy tìm đoạn liên quan trong kho Nhị Gia, rồi viết câu trả lời trên những đoạn đó.",
    why: "Không “AI bịa”. Sự thật công ty (dịch vụ, quy trình, hotline) chỉ lấy từ ngữ cảnh đã nạp.",
    steps: [
      {
        n: "01",
        title: "Chuẩn hóa câu hỏi",
        body: "Hiểu không dấu, typo, quốc gia (“sang my” = visa Mỹ).",
        tone: "cream" as const,
      },
      {
        n: "02",
        title: "Truy xuất corpus",
        body: "Xếp hạng đoạn FAQ / dịch vụ / mẹo hồ sơ của Nhị Gia.",
        tone: "navy" as const,
      },
      {
        n: "03",
        title: "LLM viết trên ngữ cảnh",
        body: "Chỉ được dùng thông tin trong đoạn đã lấy + quy tắc an toàn.",
        tone: "gold" as const,
      },
    ],
  },
  {
    id: "hybrid",
    kicker: "Mô hình 3",
    title: "Lai — RAG công ty + nguồn chính thống",
    lead: "Khi câu hỏi không có checklist trong kho (visa Mỹ, thủ tục lãnh sự…): giữ sự thật Nhị Gia, bổ sung nguồn công khai.",
    why: "Khách nhận được hướng dẫn hữu ích, có chip nguồn Đại sứ quán / Wikipedia, và vẫn được mời chuyên viên rà hồ sơ.",
    steps: [
      {
        n: "01",
        title: "Sự thật Nhị Gia",
        body: "Công ty có làm dịch vụ đó không, hotline, quy trình 5 bước.",
        tone: "navy" as const,
      },
      {
        n: "02",
        title: "Nguồn chính thống",
        body: "Đại sứ quán, .gov, Wikipedia — không lấy giá từ web đối thủ.",
        tone: "cream" as const,
      },
      {
        n: "03",
        title: "Viết một câu mượt",
        body: "AI kết hợp hai nguồn. Ghi chú tham khảo. Không bịa phí / ngày tuyệt đối.",
        tone: "gold" as const,
      },
    ],
  },
  {
    id: "safety",
    kicker: "Mô hình 4",
    title: "An toàn & bàn giao chuyên viên",
    lead: "AI hỗ trợ tư vấn sơ bộ. Quyết định phí, đậu/rớt, thời gian hồ sơ vẫn thuộc chuyên viên.",
    why: "Đúng kỳ vọng ngành di trú: chatbot không thay luật sư hay cam kết kết quả.",
    steps: [
      {
        n: "01",
        title: "Chặn phí & cam kết",
        body: "Câu hỏi giá / “đậu 100%” → từ chối số liệu, mời 1900 6654.",
        tone: "cream" as const,
      },
      {
        n: "02",
        title: "Lọc câu trả lời",
        body: "Nếu AI lỡ viết số tiền, hệ thống thay bằng thông điệp an toàn.",
        tone: "navy" as const,
      },
      {
        n: "03",
        title: "Để lại SĐT",
        body: "Lead chỉ dùng để gọi lại. Không bán dữ liệu, không lưu thẻ.",
        tone: "gold" as const,
      },
    ],
  },
];

export default function MoHinhAiPage() {
  return (
    <>
      <main id="main-content">
        <section className="bg-navy text-white">
          <div className="container-page section-y">
            <p className="section-eyebrow !text-[color:var(--gold-soft)]">
              Công nghệ chatbot
            </p>
            <h1 className="mt-3 max-w-3xl text-[2rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
              AI phân tích câu hỏi — không thay chuyên viên, không bịa phí
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-base">
              Concierge trên website Nhị Gia dùng bốn mô hình kết hợp: FAQ đã
              duyệt, RAG trên dữ liệu công ty, nguồn chính thống khi thiếu
              checklist, và lớp an toàn trước khi trả lời khách.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <OpenChatButton className="btn-gold">Thử chatbot</OpenChatButton>
              <a href="tel:19006654" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">
                Gọi 1900 6654
              </a>
            </div>
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              as="h2"
              eyebrow="Tổng quan"
              title="Một bộ điều phối, ba đường trả lời"
              lead="Khách không cần biết “RAG” là gì. Bên trong, mỗi câu đi đúng đường: an toàn, FAQ, hoặc AI có ngữ cảnh."
            />
            <RouterDiagram />
          </div>
        </section>

        <section className="border-t border-navy/8 bg-[#fffdf8] section-y">
          <div className="container-page space-y-16">
            {MODELS.map((model) => (
              <article key={model.id} id={model.id} className="scroll-mt-28">
                <p className="section-eyebrow">{model.kicker}</p>
                <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-navy sm:text-[1.75rem]">
                  {model.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                  {model.lead}
                </p>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-navy/80">
                  {model.why}
                </p>
                <div className="mt-6">
                  <Flow steps={model.steps} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-y">
          <div className="container-page">
            <SectionHeader
              as="h2"
              eyebrow="So sánh"
              title="Vì sao không dùng AI thuần"
              lead="LLM không có ngữ cảnh công ty sẽ bịa phí, nhầm thương hiệu, hoặc trả lời thủ tục đã cũ. Nhị Gia không đi đường đó."
            />
            <div className="overflow-x-auto rounded-[1.5rem] ring-1 ring-navy/10">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-navy text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--gold-soft)]">
                  <tr>
                    <th className="px-5 py-3.5">Mô hình</th>
                    <th className="px-5 py-3.5">Phù hợp</th>
                    <th className="px-5 py-3.5">Rủi ro nếu dùng một mình</th>
                    <th className="px-5 py-3.5">Nhị Gia</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-navy">
                  {[
                    [
                      "FAQ / intent",
                      "Giờ, địa chỉ, có/không làm dịch vụ",
                      "Không trả lời được câu mới",
                      "Đang dùng",
                    ],
                    [
                      "RAG (kho công ty)",
                      "Quy trình, mẹo hồ sơ, dịch vụ",
                      "Checklist quốc gia có thể thiếu",
                      "Đang dùng",
                    ],
                    [
                      "RAG + nguồn .gov",
                      "Visa Mỹ, thủ tục lãnh sự",
                      "Cần lọc nguồn, ghi chú tham khảo",
                      "Đang dùng",
                    ],
                    [
                      "LLM thuần, không kho",
                      "Chat tự do",
                      "Bịa phí, cam kết đậu, nhầm thương hiệu",
                      "Không dùng",
                    ],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-navy/8">
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={`px-5 py-3.5 leading-relaxed ${
                            i === 0 ? "font-semibold" : "text-navy/80"
                          } ${
                            i === 3
                              ? cell === "Không dùng"
                                ? "font-semibold text-red-800"
                                : "font-semibold text-emerald-800"
                              : ""
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "Dữ liệu công ty",
                  d: "Kho FAQ / dịch vụ do Nhị Gia kiểm soát. AI không được bịa chi nhánh hay bảng giá.",
                },
                {
                  t: "Nguồn công khai",
                  d: "Chỉ ưu tiên đại sứ quán, .gov, Wikipedia. Không lấy giá từ website đối thủ.",
                },
                {
                  t: "Con người quyết",
                  d: "Phí, thời gian, đậu/rớt — chuyên viên. Chatbot chỉ tư vấn sơ bộ và chuyển lead.",
                },
              ].map((x) => (
                <li
                  key={x.t}
                  className="rounded-2xl bg-[#fffdf8] p-5 ring-1 ring-navy/8"
                >
                  <p className="font-bold text-navy">{x.t}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                    {x.d}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
