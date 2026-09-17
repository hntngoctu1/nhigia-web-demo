"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function MobileCtaBar() {
  const { m } = useI18n();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onChat = (e: Event) => {
      const detail = (e as CustomEvent<{ open?: boolean }>).detail;
      setChatOpen(!!detail?.open);
    };
    window.addEventListener("nhigia:chat-state", onChat);
    return () => window.removeEventListener("nhigia:chat-state", onChat);
  }, []);

  if (chatOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 shadow-[0_-8px_24px_-12px_rgb(15_23_42_/_0.15)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="navigation"
      aria-label={m.mobile.aria}
    >
      <div className="mx-auto flex max-w-lg items-stretch gap-2 px-3 py-2">
        <a
          href="tel:19006654"
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl bg-navy px-2 py-2.5 text-center text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="text-[11px] font-bold leading-none">{m.mobile.call}</span>
          <span className="text-[10px] opacity-80">1900 6654</span>
        </a>
        <button
          type="button"
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl bg-[color:var(--gold)] px-2 py-2.5 text-center text-navy shadow-sm"
          aria-label="Mở khung chat tư vấn"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("nhigia:open-chat"));
          }}
        >
          <span className="text-[11px] font-bold leading-none">{m.mobile.chat}</span>
          <span className="text-[10px] opacity-80">{m.mobile.advise}</span>
        </button>
        <a
          href="/lien-he"
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border border-slate-200/90 bg-surface px-2 py-2.5 text-center text-navy"
          aria-label="Mở form liên hệ"
        >
          <span className="text-[11px] font-bold leading-none">{m.mobile.contact}</span>
          <span className="text-[10px] text-muted">{m.mobile.form}</span>
        </a>
      </div>
    </div>
  );
}
