import Link from "next/link";
import type { ReactNode } from "react";

const SPLIT =
  /(1900[\s.]?6654|info@nhigia\.vn|\/dich-vu\/[a-z0-9-]+)/gi;

function Linked({ text, keyBase }: { text: string; keyBase: string }) {
  const parts = text.split(SPLIT);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        const key = `${keyBase}-${i}`;
        if (/^1900[\s.]?6654$/i.test(part)) {
          return (
            <a
              key={key}
              href="tel:19006654"
              className="font-semibold underline decoration-[color:var(--gold)]/50 underline-offset-2 hover:decoration-[color:var(--gold)]"
            >
              {part}
            </a>
          );
        }
        if (/^info@nhigia\.vn$/i.test(part)) {
          return (
            <a
              key={key}
              href="mailto:info@nhigia.vn"
              className="font-semibold underline decoration-[color:var(--gold)]/50 underline-offset-2 hover:decoration-[color:var(--gold)]"
            >
              {part}
            </a>
          );
        }
        if (/^\/dich-vu\//.test(part)) {
          return (
            <Link
              key={key}
              href={part}
              className="font-semibold underline decoration-[color:var(--gold)]/50 underline-offset-2 hover:decoration-[color:var(--gold)]"
            >
              xem dịch vụ
            </Link>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </>
  );
}

export function RichText({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  let n = 0;

  const flushList = () => {
    if (!list.length) return;
    const items = list;
    list = [];
    const id = n++;
    nodes.push(
      <ul key={`ul-${id}`} className="mt-1.5 space-y-1 pl-0">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
            <span className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-[color:var(--gold)]" />
            <span className="min-w-0">
              <Linked text={item} keyBase={`li-${id}-${i}`} />
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const flushPara = () => {
    if (!para.length) return;
    const body = para.join(" ").trim();
    para = [];
    if (!body) return;
    const id = n++;
    nodes.push(
      <p key={`p-${id}`} className={id === 0 ? "" : "mt-1.5"}>
        <Linked text={body} keyBase={`p-${id}`} />
      </p>
    );
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    if (/^[•\-–]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[•\-–]\s+/, ""));
      continue;
    }
    flushList();
    para.push(line);
  }
  flushList();
  flushPara();

  return <>{nodes}</>;
}
