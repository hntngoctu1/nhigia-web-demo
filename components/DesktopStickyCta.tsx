"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function DesktopStickyCta() {
  const { m } = useI18n();
  const [show, setShow] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onChat = (e: Event) => {
      const detail = (e as CustomEvent<{ open?: boolean }>).detail;
      setChatOpen(!!detail?.open);
    };
    window.addEventListener("nhigia:chat-state", onChat);
    return () => window.removeEventListener("nhigia:chat-state", onChat);
  }, []);

  const visible = show && !chatOpen;

  return (
    <div
      className={`fixed bottom-6 z-40 hidden transition-all duration-300 md:block ${
        chatOpen ? "right-[27rem]" : "right-[10.5rem]"
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <a
        href="/lien-he"
        tabIndex={visible ? 0 : -1}
        className="btn-gold shadow-lg shadow-navy/20"
      >
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--gold-soft)]"
          aria-hidden
        />
        {m.sticky}
      </a>
    </div>
  );
}
