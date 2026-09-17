"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

const fieldBase =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_2px_rgb(15_23_42_/_0.02)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 focus:border-navy focus:ring-[3px] focus:ring-navy/15 disabled:opacity-60";

const labelClass = "text-sm font-semibold text-slate-700";

export default function ContactForm() {
  const { m } = useI18n();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [serverMsg, setServerMsg] = useState("");

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim() || name.trim().length < 2)
      e.name = "Vui lòng nhập họ tên (tối thiểu 2 ký tự).";
    if (!phone.trim() || !/^[0-9+\s()-]{8,20}$/.test(phone.trim())) {
      e.phone = "Số điện thoại không hợp lệ.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Email không hợp lệ.";
    }
    if (!message.trim() || message.trim().length < 10) {
      e.message = "Nội dung cần ít nhất 10 ký tự.";
    }
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("loading");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company: company.trim() || undefined,
          phone,
          email,
          service,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("err");
        setServerMsg("Gửi không thành công. Vui lòng gọi 1900 6654.");
        return;
      }
      setStatus("ok");
      setServerMsg(data.message || "Đã nhận thông tin. Chúng tôi sẽ liên hệ sớm.");
      setName("");
      setCompany("");
      setPhone("");
      setEmail("");
      setService("");
      setMessage("");
    } catch {
      setStatus("err");
      setServerMsg("Lỗi kết nối. Vui lòng gọi 1900 6654.");
    }
  }

  function fieldClass(hasError?: boolean) {
    return `${fieldBase} ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : ""
    }`;
  }

  if (status === "ok") {
    return (
      <div
        className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 to-white p-8 text-center shadow-sm sm:p-10"
        role="status"
        aria-live="polite"
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          aria-hidden
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-bold text-navy">{m.form.ok}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
          {serverMsg}
        </p>
        <p className="mt-3 text-xs text-muted">
          {m.form.urgent}{" "}
          <a href="tel:19006654" className="font-bold text-navy hover:underline">
            1900 6654
          </a>
        </p>
        <button
          type="button"
          className="btn-secondary mt-6 text-xs"
          onClick={() => {
            setStatus("idle");
            setServerMsg("");
          }}
        >
          {m.form.another}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8"
      noValidate
      aria-labelledby="contact-form-title"
    >
      <h2 id="contact-form-title" className="text-lg font-bold text-navy">
        {m.form.title}
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        {m.form.note}{" "}
        <a href="/chinh-sach-bao-mat" className="underline hover:text-navy">
          {m.form.privacy}
        </a>
        .
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Họ và tên <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-name"
            className={fieldClass(!!errors.name)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          {errors.name && (
            <p id="err-name" className="mt-1.5 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Công ty / tổ chức{" "}
            <span className="font-normal text-muted">(tuỳ chọn)</span>
          </label>
          <input
            id="contact-company"
            className={fieldClass()}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
            placeholder="Công ty TNHH…"
            maxLength={120}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Số điện thoại <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-phone"
            className={fieldClass(!!errors.phone)}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            placeholder="09xx xxx xxx"
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "err-phone" : undefined}
          />
          {errors.phone && (
            <p id="err-phone" className="mt-1.5 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            className={fieldClass(!!errors.email)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="ban@email.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {errors.email && (
            <p id="err-email" className="mt-1.5 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-service" className={labelClass}>
            Dịch vụ quan tâm
          </label>
          <select
            id="contact-service"
            className={fieldClass()}
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">— Chọn —</option>
            <option value="visa-vn">Visa Việt Nam</option>
            <option value="gpld">Giấy phép lao động</option>
            <option value="e-visa">E-Visa</option>
            <option value="tam-tru">Thẻ tạm trú</option>
            <option value="bao-lanh">Công văn / bảo lãnh</option>
            <option value="dn">Gói doanh nghiệp</option>
            <option value="khac">Khác</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            Nội dung <span className="text-red-600">*</span>
          </label>
          <textarea
            id="contact-message"
            className={`${fieldClass(!!errors.message)} min-h-[130px] resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mô tả ngắn nhu cầu (visa, GPLĐ, thời gian dự kiến…)"
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "err-message" : undefined}
          />
          {errors.message && (
            <p id="err-message" className="mt-1.5 text-xs text-red-600">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold mt-6 w-full !py-3 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
            {m.form.sending}
          </span>
        ) : (
          m.form.submit
        )}
      </button>

      {status === "err" && serverMsg ? (
        <p
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          role="alert"
        >
          {serverMsg}
        </p>
      ) : null}
    </form>
  );
}
