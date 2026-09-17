type Step = {
  n: string;
  title: string;
  body: string;
  tone?: "navy" | "gold" | "cream" | "safe";
};

const TONE: Record<NonNullable<Step["tone"]>, string> = {
  navy: "bg-navy text-white",
  gold: "bg-[color:var(--gold)] text-navy",
  cream: "bg-[#f6edd4] text-navy ring-1 ring-[color:var(--gold)]/35",
  safe: "bg-white text-navy ring-1 ring-navy/10",
};

function Arrow() {
  return (
    <div
      className="hidden shrink-0 items-center text-[color:var(--gold)] md:flex"
      aria-hidden
    >
      <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
        <path
          d="M0 6h24M20 1.5L25.5 6 20 10.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Flow({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
      {steps.map((s, i) => (
        <li key={s.n} className="flex flex-1 flex-col md:flex-row md:items-stretch md:gap-2">
          <div
            className={`flex-1 rounded-2xl p-4 ${TONE[s.tone || "safe"]}`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">
              {s.n}
            </p>
            <p className="mt-1.5 text-[15px] font-bold leading-snug">{s.title}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed opacity-85">
              {s.body}
            </p>
          </div>
          {i < steps.length - 1 ? (
            <div className="flex justify-center py-0.5 md:py-0">
              <span className="rotate-90 text-[color:var(--gold)] md:hidden" aria-hidden>
                ↓
              </span>
              <Arrow />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function RouterDiagram() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-navy p-5 text-white sm:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--gold-soft)]">
        Bộ điều phối — mô hình đang chạy
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
        Mỗi câu hỏi được phân loại trước khi gọi AI. LLM không được tự ý trả lời
        phí, địa chỉ hay cam kết đậu.
      </p>
      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_1.4fr]">
        <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--gold-soft)]">
            01 · Đầu vào
          </p>
          <p className="mt-2 font-semibold">Khách hỏi trên website</p>
          <p className="mt-1 text-[13px] text-white/70">
            Hiểu không dấu, typo, mạch hội thoại (vd. “du lịch” sau visa Mỹ).
          </p>
        </div>
        <div className="hidden items-center lg:flex" aria-hidden>
          <svg width="36" height="12" viewBox="0 0 36 12" fill="none">
            <path
              d="M0 6h32M28 1.5L34.5 6 28 10.5"
              stroke="#ead7a0"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="rounded-2xl bg-[color:var(--gold)] p-4 text-navy">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
              Nhánh A · An toàn
            </p>
            <p className="mt-1 font-bold">Hỏi phí / cam kết đậu</p>
            <p className="mt-1 text-[13px] opacity-80">
              Không bịa số tiền. Mời 1900 6654 — chuyên viên thẩm định hồ sơ.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-navy">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/50">
              Nhánh B · FAQ tức thì
            </p>
            <p className="mt-1 font-bold">Giờ làm việc, địa chỉ, “có làm GPLĐ?”</p>
            <p className="mt-1 text-[13px] text-navy/70">
              Lấy đúng câu đã duyệt trong kho tri thức. Không gọi LLM.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f6edd4] p-4 text-navy ring-1 ring-[color:var(--gold)]/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
              Nhánh C · RAG + nguồn chính thống
            </p>
            <p className="mt-1 font-bold">Visa Mỹ, thủ tục chi tiết, câu ngoài FAQ</p>
            <p className="mt-1 text-[13px] text-navy/70">
              Kết hợp dữ liệu Nhị Gia + Đại sứ quán / Wikipedia. Ghi nguồn. Không bịa phí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
