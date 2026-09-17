"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { RichText } from "@/lib/chat/richText";
import { useI18n } from "@/lib/i18n";

type Citation = { label: string; url: string };
type Msg = {
  role: "user" | "assistant";
  content: string;
  at?: number;
  citations?: Citation[];
};

function clock(at?: number) {
  if (!at) return "";
  return new Date(at).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
type Suggestion = { label: string; text: string };

const MAX_INPUT_CHARS = 500;
const STORAGE_KEY = "nhigia-chat-v3";
const TEASER_KEY = "nhigia-chat-teaser-off";


class StreamReplyError extends Error {}

async function readSseReply(
  res: Response,
  onToken: (t: string) => void,
  onMeta?: (meta: { suggestions?: Suggestion[]; citations?: Citation[] }) => void,
): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) {
    const data = (await res.json().catch(() => ({}))) as {
      reply?: string;
      error?: string;
      suggestions?: Suggestion[];
    };
    if (!res.ok) throw new Error(data.reply || data.error || "request_failed");
    if (data.suggestions) onMeta?.({ suggestions: data.suggestions });
    return String(data.reply || "");
  }
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop() || "";
    for (const line of parts) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          type?: string;
          content?: string;
          reply?: string;
          message?: string;
          suggestions?: Suggestion[];
          citations?: Citation[];
        };
        if (json.type === "meta") {
          onMeta?.({
            suggestions: json.suggestions,
            citations: json.citations,
          });
        }
        if (json.type === "token" && json.content) {
          full += json.content;
          onToken(json.content);
        } else if (json.type === "replace" && json.reply) {
          full = json.reply;
        } else if (json.type === "done") {
          if (json.reply) full = json.reply;
          if (json.suggestions || json.citations) {
            onMeta?.({
              suggestions: json.suggestions,
              citations: json.citations,
            });
          }
        } else if (json.type === "error") {
          throw new StreamReplyError(json.message || "stream_failed");
        }
      } catch (error) {
        if (error instanceof StreamReplyError) throw error;
      }
    }
  }
  return full;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-0.5 py-0.5" aria-hidden>
      <span className="chat-dot" />
      <span className="chat-dot chat-dot-2" />
      <span className="chat-dot chat-dot-3" />
    </div>
  );
}

const BOT_SRC = "/images/brand/chat-bot.webp";

function BotAvatar({
  size,
  className = "",
}: {
  size: number;
  className?: string;
}) {
  return (
    <Image
      src={BOT_SRC}
      alt=""
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      aria-hidden
    />
  );
}

function AssistantMark() {
  return (
    <span className="mt-1 flex h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-[color:var(--gold)]/45">
      <BotAvatar size={28} className="h-7 w-7" />
    </span>
  );
}

export default function ChatWidget() {
  const { m, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "" },
  ]);
  const [failedPrompt, setFailedPrompt] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [online, setOnline] = useState(true);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "saving" | "ok" | "err">(
    "idle"
  );
  const [hydrated, setHydrated] = useState(false);
  const [teaserOff, setTeaserOff] = useState(true);

  const endRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stoppedRef = useRef(false);
  const titleId = useId();
  const descId = useId();

  const userTurns = messages.filter((m) => m.role === "user").length;
  const isFresh =
    messages.filter((x) => x.role === "user").length === 0;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { messages?: Msg[] };
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages);
          if (parsed.messages.some((m) => m.role === "user")) {
            setSuggestions([]);
          }
        }
      }
      setTeaserOff(sessionStorage.getItem(TEASER_KEY) === "1");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.filter((x) => x.role === "user").length === 0) {
        return [{ role: "assistant", content: m.chat.welcome }];
      }
      return prev;
    });
  }, [lang, m.chat.welcome]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages }));
    } catch {
      /* ignore */
    }
  }, [messages, hydrated]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading, leadOpen]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input, open]);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("nhigia:open-chat", openChat);
    return () => window.removeEventListener("nhigia:open-chat", openChat);
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nhigia:chat-state", { detail: { open } })
    );
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setOnline(d?.rag?.ok !== false))
      .catch(() => setOnline(false));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        openBtnRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]'
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_INPUT_CHARS);
    if (!content || loading) return;
    const history = messages.filter(
      (message) => !(message.role === "assistant" && !message.content)
    );
    const now = Date.now();
    const next = [...history, { role: "user" as const, content, at: now }];
    setMessages([...next, { role: "assistant", content: "", at: now }]);
    setInput("");
    setFailedPrompt(null);
    setSuggestions([]);
    setLoading(true);
    stoppedRef.current = false;
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 50_000);

    const replaceLast = (reply: string, citations?: Citation[]) => {
      setMessages((current) => {
        const copy = [...current];
        const prev = copy[copy.length - 1];
        copy[copy.length - 1] = {
          role: "assistant",
          content: reply,
          at: prev?.at || Date.now(),
          citations: citations || prev?.citations,
        };
        return copy;
      });
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ messages: next, stream: true, lang }),
        signal: controller.signal,
      });
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("text/event-stream")) {
        const reply = await readSseReply(
          res,
          (token) => {
            setMessages((current) => {
              const copy = [...current];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: last.content + token,
                  at: last.at,
                  citations: last.citations,
                };
              }
              return copy;
            });
          },
          (meta) => {
            if (meta.suggestions?.length) setSuggestions(meta.suggestions);
            if (meta.citations?.length) {
              setMessages((current) => {
                const copy = [...current];
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") {
                  copy[copy.length - 1] = {
                    ...last,
                    citations: meta.citations,
                  };
                }
                return copy;
              });
            }
          }
        );
        replaceLast(
          reply || "Xin lỗi, em chưa trả lời được. Vui lòng gọi 1900 6654."
        );
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          reply?: string;
          error?: string;
          suggestions?: Suggestion[];
          citations?: Citation[];
        };
        if (!res.ok) throw new Error(data.reply || data.error || "request_failed");
        if (data.suggestions?.length) setSuggestions(data.suggestions);
        replaceLast(
          data.reply || "Xin lỗi, em chưa trả lời được. Vui lòng gọi 1900 6654.",
          data.citations
        );
      }
    } catch (error) {
      if (stoppedRef.current) {
        setMessages((current) => {
          const copy = [...current];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && !last.content) {
            copy[copy.length - 1] = {
              role: "assistant",
              content: "Đã dừng. Anh/chị hỏi tiếp hoặc gọi 1900 6654.",
              at: Date.now(),
            };
          }
          return copy;
        });
      } else {
        const message =
          error instanceof DOMException && error.name === "AbortError"
            ? "Kết nối mất nhiều thời gian. Anh/chị thử lại hoặc gọi 1900 6654 nhé."
            : "Kết nối tạm lỗi. Anh/chị thử lại hoặc gọi 1900 6654 nhé ạ.";
        replaceLast(message);
        setFailedPrompt(content);
      }
    } finally {
      window.clearTimeout(timeout);
      abortRef.current = null;
      stoppedRef.current = false;
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        inputRef.current?.focus();
      }
    }
  }

  function stopReply() {
    stoppedRef.current = true;
    abortRef.current?.abort();
  }

  function resetChat() {
    if (loading) return;
    setMessages([{ role: "assistant", content: m.chat.welcome }]);
    setInput("");
    setFailedPrompt(null);
    setSuggestions([...m.chat.starters]);
    setLeadOpen(false);
    setLeadStatus("idle");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    inputRef.current?.focus();
  }

  function dismissTeaser() {
    setTeaserOff(true);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function submitLead() {
    if (leadStatus === "saving") return;
    setLeadStatus("saving");
    const summary = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .slice(-3)
      .join(" | ");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "chat",
          name: leadName.trim() || "Khách chat web",
          phone: leadPhone.trim(),
          message: `Yêu cầu gọi lại từ chatbot. Nội dung: ${summary || "tư vấn dịch vụ"}`,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setLeadStatus("err");
        return;
      }
      setLeadStatus("ok");
      setLeadOpen(false);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            m.chat.received ||
            "Đã nhận thông tin. Chuyên viên Nhị Gia sẽ gọi lại — hoặc anh/chị gọi 1900 6654.",
          at: Date.now(),
        },
      ]);
    } catch {
      setLeadStatus("err");
    }
  }

  const chips = isFresh ? [...m.chat.starters] : suggestions;
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.content);

  function closeChat() {
    setOpen(false);
    openBtnRef.current?.focus();
  }

  return (
    <>
      {open ? (
        <div className="chat-overlay">
          <button
            type="button"
            className="chat-backdrop absolute inset-0 cursor-default bg-slate-950/40 md:bg-slate-950/20"
            aria-label={m.chat.close}
            onClick={closeChat}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="chat-shell chat-panel-enter relative z-[1] overflow-hidden bg-white shadow-[0_32px_90px_-20px_rgb(6_16_31_/_0.6)] md:rounded-[1.75rem] md:ring-1 md:ring-black/5"
            tabIndex={-1}
          >
          <div className="relative shrink-0 bg-navy px-4 pb-3.5 pt-3.5 text-white">
            <span
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold)] to-transparent"
              aria-hidden
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 rounded-full ring-1 ring-[color:var(--gold)]/45">
                  <BotAvatar size={44} className="h-11 w-11" />
                  <span
                    className={`absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full ring-2 ring-navy ${
                      online ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0">
                  <div
                    id={titleId}
                    className="truncate text-[13px] font-semibold tracking-[0.04em]"
                  >
                    {m.chat.name}
                  </div>
                  <div
                    id={descId}
                    className="mt-0.5 truncate text-[11px] tracking-wide text-white/55"
                  >
                    {online ? m.chat.online : m.chat.faq} · {m.chat.noFee}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  aria-label="Cuộc trò chuyện mới"
                  title="Làm mới"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  onClick={resetChat}
                  disabled={loading}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M4.5 12a7.5 7.5 0 0 1 12.7-5.4M19.5 12a7.5 7.5 0 0 1-12.7 5.4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 4.5v3.2h-3.2M7 19.5v-3.2h3.2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Đóng chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-white/60 transition hover:bg-white/10 hover:text-white"
                  onClick={closeChat}
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div
            className="chat-thread min-h-0 flex-1 space-y-3.5 overflow-y-auto overscroll-contain px-3.5 py-4"
            aria-live="polite"
            aria-busy={loading}
          >
            {isFresh ? (
              <div className="chat-msg-in rounded-[1.35rem] bg-white/85 p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                  {m.chat.teaserKicker}
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-navy">
                  {m.chat.welcome}
                </p>
                <p className="mt-3 text-[10px] tracking-wide text-muted">
                  {m.chat.hoursLine}
                </p>
              </div>
            ) : null}

            {messages.map((m, i) => {
              if (isFresh && m.role === "assistant") {
                return null;
              }
              const isLast = i === messages.length - 1;
              const emptyAssistant = m.role === "assistant" && !m.content;
              if (emptyAssistant && loading && isLast) {
                return (
                  <div key={i} className="chat-msg-in flex items-end gap-2">
                    <AssistantMark />
                    <div className="rounded-2xl rounded-bl-md bg-white/90 px-3.5 py-2.5 shadow-sm ring-1 ring-black/4">
                      <TypingDots />
                    </div>
                  </div>
                );
              }
              if (emptyAssistant) return null;
              if (m.role === "user") {
                return (
                  <div key={i} className="chat-msg-in flex flex-col items-end gap-1">
                    <div className="chat-user max-w-[82%] rounded-2xl rounded-br-md bg-[#f6edd4] px-3.5 py-2.5 text-[13px] leading-relaxed text-navy">
                      {m.content}
                    </div>
                    {m.at ? (
                      <span className="pr-0.5 text-[9px] tracking-wide text-navy/35">
                        {clock(m.at)}
                      </span>
                    ) : null}
                  </div>
                );
              }
              return (
                <div key={i} className="chat-msg-in flex items-end gap-2">
                  <AssistantMark />
                  <div className="max-w-[82%]">
                    <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-800 shadow-sm ring-1 ring-navy/8">
                      <RichText text={m.content} />
                    </div>
                    {m.citations?.length ? (
                      <div className="mt-1.5 flex flex-wrap gap-1 pl-0.5">
                        {m.citations.map((c) => (
                          <a
                            key={c.url}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-navy/10 bg-white/80 px-2 py-0.5 text-[10px] font-medium tracking-wide text-navy/70 transition hover:border-[color:var(--gold)] hover:text-navy"
                          >
                            {c.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                    {m.at ? (
                      <span className="mt-1 block pl-0.5 text-[9px] tracking-wide text-navy/35">
                        {clock(m.at)}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {failedPrompt && !loading ? (
              <div className="flex justify-start pl-9">
                <button
                  type="button"
                  className="rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-900 hover:bg-amber-100"
                  onClick={() => send(failedPrompt)}
                >
                  {m.chat.retry}
                </button>
              </div>
            ) : null}

            {chips.length > 0 && !loading ? (
              <div className="flex flex-wrap gap-1.5 pl-9">
                {chips.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className="rounded-full border border-navy/10 bg-white/80 px-3 py-1 text-[11px] font-medium tracking-[0.02em] text-navy transition hover:border-[color:var(--gold)] hover:text-navy disabled:opacity-50"
                    onClick={() => send(s.text)}
                    disabled={loading}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            ) : null}

            {!loading && userTurns >= 1 && lastAssistant && !leadOpen && leadStatus !== "ok" ? (
              <div className="flex flex-wrap gap-1.5 pl-9 select-none">
                <a
                  href="tel:19006654"
                  className="rounded-full border border-[color:var(--gold)]/50 bg-[#f6edd4] px-3 py-1 text-[11px] font-semibold tracking-wide text-navy"
                >
                  {m.chat.call}
                </a>
                <button
                  type="button"
                  className="rounded-full border border-navy/10 bg-white/80 px-3 py-1 text-[11px] font-medium text-navy"
                  onClick={() => setLeadOpen(true)}
                >
                  {m.chat.leavePhone}
                </button>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          {leadOpen && leadStatus !== "ok" ? (
            <div className="shrink-0 border-t border-navy/10 bg-white px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/70">
                {m.chat.callback}
              </p>
              <div className="mt-2 space-y-2">
                <input
                  id="chat-lead-name"
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-navy"
                  placeholder="Họ tên (tuỳ chọn)"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
                <input
                  id="chat-lead-phone"
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-navy"
                  placeholder="Số điện thoại *"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
                {leadStatus === "err" ? (
                  <p className="text-[11px] text-red-600">
                    Số chưa hợp lệ. Thử lại hoặc gọi 1900 6654.
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={leadStatus === "saving"}
                    className="btn-gold !px-3 !py-1.5 !text-[11px] disabled:opacity-60"
                    onClick={() => void submitLead()}
                  >
                    {leadStatus === "saving" ? m.chat.sending : m.chat.sendReq}
                  </button>
                  <button
                    type="button"
                    className="rounded-full px-2 py-1.5 text-[11px] text-muted hover:text-navy"
                    onClick={() => setLeadOpen(false)}
                  >
                    {m.chat.later}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <form
            className="shrink-0 border-t border-navy/8 bg-[#fffdf8] px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-1 rounded-2xl border border-navy/10 bg-white px-1.5 py-1.5 focus-within:border-[color:var(--gold)]/60 focus-within:ring-[3px] focus-within:ring-[color:var(--gold)]/20">
              <a
                href="tel:19006654"
                className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy/50 transition hover:bg-white hover:text-navy"
                aria-label="Gọi 1900 6654"
                title="Gọi hotline"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 3.8h2.2l1 3.1-1.5 1.5a12.5 12.5 0 0 0 6.9 6.9l1.5-1.5 3.1 1V19a1.8 1.8 0 0 1-1.8 1.8A15.2 15.2 0 0 1 3 5.6 1.8 1.8 0 0 1 4.8 3.8H7Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <label htmlFor="nhigia-chat-input" className="sr-only">
                Nhập câu hỏi
              </label>
              <textarea
                id="nhigia-chat-input"
                ref={inputRef}
                rows={1}
                maxLength={MAX_INPUT_CHARS}
                className="max-h-24 min-h-[36px] flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-[13px] text-navy shadow-none outline-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
                placeholder={m.chat.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                autoComplete="off"
              />
              {loading ? (
                <button
                  type="button"
                  className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-white"
                  aria-label="Dừng trả lời"
                  onClick={stopReply}
                >
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[color:var(--gold)]" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--gold)] text-navy transition hover:bg-[color:var(--gold-soft)] disabled:opacity-35"
                  aria-label="Gửi câu hỏi"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[10px] tracking-wide text-muted">
              <p>
                {m.chat.free}{" "}
                <a
                  href="tel:19006654"
                  className="font-semibold text-navy hover:underline"
                >
                  1900 6654
                </a>
              </p>
              {input.length > 360 ? (
                <span className={input.length > 450 ? "text-amber-700" : ""}>
                  {input.length}/{MAX_INPUT_CHARS}
                </span>
              ) : null}
            </div>
          </form>
          </div>
        </div>
      ) : (
      <div className="fixed bottom-[5.75rem] right-3 z-50 flex flex-col items-end gap-2.5 md:bottom-6 md:right-6">
      {hydrated && !teaserOff ? (
        <div className="chat-teaser-pop relative mr-1 flex max-w-[250px] items-start gap-2 rounded-2xl rounded-br-sm bg-white py-2 pl-2 pr-3.5 text-left shadow-[0_16px_40px_-18px_rgb(6_16_31_/_0.45)] ring-1 ring-black/5">
          <BotAvatar size={36} className="chat-bot-attract mt-0.5 h-9 w-9 shrink-0 ring-1 ring-[color:var(--gold)]/35" />
          <button
            type="button"
            className="absolute right-1.5 top-1 flex h-5 w-5 items-center justify-center text-xs text-muted hover:text-navy"
            aria-label="Ẩn gợi ý"
            onClick={dismissTeaser}
          >
            ×
          </button>
          <button
            type="button"
            className="min-w-0 pr-3 pt-0.5 text-left text-[12px] leading-snug text-navy"
            onClick={() => setOpen(true)}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
              {m.chat.teaserKicker}
            </span>
            <span className="mt-0.5 block">{m.chat.teaser}</span>
          </button>
        </div>
      ) : null}

      <button
        ref={openBtnRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) dismissTeaser();
        }}
        className="chat-fab-glow relative flex h-12 items-center justify-center gap-2 rounded-full bg-navy pl-1.5 pr-4 text-white ring-1 ring-[color:var(--gold)]/45 md:h-14 md:pl-2 md:pr-5"
        aria-label={m.chat.open}
        aria-haspopup="dialog"
        aria-expanded={false}
      >
        <span className="chat-fab-pulse absolute inset-0 rounded-full" aria-hidden />
        <span className="chat-fab-pulse chat-fab-pulse-2 absolute inset-0 rounded-full" aria-hidden />
        <span className="chat-spark" aria-hidden />
        <span className="relative z-[1] flex h-9 w-9 overflow-hidden rounded-full ring-1 ring-[color:var(--gold)]/70 md:h-10 md:w-10">
          <BotAvatar size={40} className="chat-bot-attract h-full w-full" />
        </span>
        <span className="relative z-[1] hidden text-[12px] font-semibold tracking-[0.08em] sm:inline">
          {m.chat.fab}
        </span>
        {hydrated && !teaserOff ? (
          <span
            className="absolute -top-0.5 right-0 z-[2] h-2.5 w-2.5 rounded-full bg-[color:var(--gold)] ring-2 ring-white"
            aria-hidden
          />
        ) : null}
      </button>
    </div>
      )}
    </>
  );
}
