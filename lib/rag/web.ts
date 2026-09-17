import {
  DEST_LABEL,
  detectDestination,
  rewriteForSearch,
  type DestinationId,
} from "./intent";

export type WebSnippet = {
  id: string;
  title: string;
  url: string;
  text: string;
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const DEST_SOURCES: Record<
  DestinationId,
  { wiki: string; official: string[] }
> = {
  us: {
    wiki: "Chính sách thị thực của Hoa Kỳ",
    official: [
      "https://vn.usembassy.gov/vi/required-documents/",
      "https://vn.usembassy.gov/visas/",
    ],
  },
  cn: {
    wiki: "Chính sách thị thực của Trung Quốc",
    official: ["https://vn.china-embassy.gov.cn/vn/"],
  },
  kr: {
    wiki: "Chính sách thị thực của Hàn Quốc",
    official: ["https://www.visa.go.kr/"],
  },
  jp: {
    wiki: "Chính sách thị thực của Nhật Bản",
    official: ["https://www.vn.emb-japan.go.jp/itpr_vi/visa.html"],
  },
  au: {
    wiki: "Chính sách thị thực của Úc",
    official: ["https://immi.homeaffairs.gov.au/visas/getting-a-visa"],
  },
  tw: {
    wiki: "Chính sách thị thực của Đài Loan",
    official: ["https://www.boca.gov.tw/mp-2.html"],
  },
  uk: {
    wiki: "Chính sách thị thực của Anh",
    official: ["https://www.gov.uk/browse/visas-immigration"],
  },
  schengen: {
    wiki: "Thị thực Schengen",
    official: ["https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en"],
  },
  sg: {
    wiki: "Chính sách thị thực của Singapore",
    official: ["https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements"],
  },
};

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function htmlToText(html: string): string {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function officialScore(url: string): number {
  if (
    /\.gov(\.|$)/i.test(url) ||
    /embassy|consulate|emb-japan|usembassy/i.test(url)
  ) {
    return 3;
  }
  if (/wikipedia\.org/i.test(url)) return 2;
  if (/(visa|immigration|mofa|homeaffairs|xuatnhapcanh)/i.test(url)) return 1;
  return 0;
}

export function parseDdgLite(html: string): WebSnippet[] {
  const out: WebSnippet[] = [];
  const re =
    /href="([^"]*uddg=[^"]+)"[^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>[\s\S]*?class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html)) && i < 8) {
    const href = decodeHtml(m[1]);
    const uddg = href.match(/uddg=([^&]+)/);
    let url = "";
    if (uddg) {
      try {
        url = decodeURIComponent(uddg[1]);
      } catch {
        url = uddg[1];
      }
    }
    if (!url.startsWith("http")) continue;
    const title = htmlToText(m[2]).slice(0, 160);
    const text = htmlToText(m[3]).slice(0, 420);
    if (!title && !text) continue;
    i += 1;
    out.push({
      id: `web-ddg-${i}`,
      title: title || url,
      url,
      text: text || title,
    });
  }
  return out.sort((a, b) => officialScore(b.url) - officialScore(a.url));
}

async function fetchText(url: string, timeoutMs = 6500): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
      "Accept-Language": "vi,en;q=0.9",
    },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return await res.text();
}

async function wikiExtract(title: string): Promise<WebSnippet | null> {
  const url =
    "https://vi.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&format=json&titles=" +
    encodeURIComponent(title);
  const raw = await fetchText(url, 2800);
  const data = JSON.parse(raw) as {
    query?: { pages?: Record<string, { title?: string; extract?: string }> };
  };
  const page = Object.values(data.query?.pages || {})[0];
  const extract = page?.extract?.trim();
  if (!extract || extract.length < 40) return null;
  return {
    id: "web-wiki",
    title: page.title || title,
    url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(page.title || title)}`,
    text: extract.slice(0, 1200),
  };
}

async function pageSnippet(url: string, id: string): Promise<WebSnippet | null> {
  const html = await fetchText(url, 2800);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? htmlToText(titleMatch[1]).slice(0, 140) : url;
  const text = htmlToText(html).slice(0, 1600);
  if (text.length < 80) return null;
  return { id, title, url, text };
}

async function ddgSearch(query: string): Promise<WebSnippet[]> {
  const url =
    "https://lite.duckduckgo.com/lite/?q=" + encodeURIComponent(query);
  const html = await fetchText(url, 7000);
  return parseDdgLite(html);
}

function dedupe(snips: WebSnippet[]): WebSnippet[] {
  const seen = new Set<string>();
  const out: WebSnippet[] = [];
  for (const s of snips) {
    const key = s.url.replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

async function gather(
  query: string,
  destHint?: DestinationId | null
): Promise<WebSnippet[]> {
  const dest = destHint || detectDestination(query);
  const tasks: Promise<WebSnippet | WebSnippet[] | null>[] = [];
  if (dest) {
    const src = DEST_SOURCES[dest];
    tasks.push(wikiExtract(src.wiki).catch(() => null));
    if (src.official[0]) {
      tasks.push(
        pageSnippet(src.official[0], "web-official").catch(() => null)
      );
    }
  } else {
    tasks.push(
      ddgSearch(rewriteForSearch(query, dest))
        .then((list) => list.filter((s) => officialScore(s.url) >= 2))
        .catch(() => [])
    );
  }
  const settled = await Promise.all(tasks);
  const snips: WebSnippet[] = [];
  for (const item of settled) {
    if (!item) continue;
    if (Array.isArray(item)) snips.push(...item);
    else snips.push(item);
  }
  return dedupe(snips)
    .filter((s) => officialScore(s.url) >= 2)
    .sort((a, b) => officialScore(b.url) - officialScore(a.url))
    .slice(0, 4);
}

/** Best-effort web snippets. Never throws; empty if search is slow/down. */
export async function searchOnline(
  query: string,
  opts?: { dest?: DestinationId | null; budgetMs?: number }
): Promise<WebSnippet[]> {
  const q = query.trim();
  if (!q) return [];
  const budgetMs = opts?.budgetMs ?? 3200;
  try {
    const result = await Promise.race([
      gather(q, opts?.dest),
      new Promise<WebSnippet[]>((resolve) =>
        setTimeout(() => resolve([]), budgetMs)
      ),
    ]);
    return result;
  } catch {
    return [];
  }
}

export function officialLabel(url: string): string | null {
  const u = url.toLowerCase();
  if (u.includes("usembassy") || u.includes("travel.state.gov")) {
    return "Đại sứ quán Mỹ";
  }
  if (u.includes("china-embassy") || u.includes("visaforchina")) {
    return "ĐSQ Trung Quốc";
  }
  if (u.includes("visa.go.kr")) return "Visa Hàn Quốc";
  if (u.includes("emb-japan") || u.includes("mofa.go.jp")) {
    return "ĐSQ Nhật Bản";
  }
  if (u.includes("homeaffairs.gov.au")) return "Immigration Úc";
  if (u.includes("boca.gov.tw")) return "BOCA Đài Loan";
  if (u.includes("gov.uk")) return "GOV.UK";
  if (u.includes("europa.eu")) return "EU Schengen";
  if (u.includes("ica.gov.sg")) return "ICA Singapore";
  if (u.includes("wikipedia.org")) return "Wikipedia";
  if (/\.gov(\.|$)/i.test(u) || /embassy|consulate/.test(u)) {
    return "Nguồn chính thức";
  }
  return null;
}

export function destOfficialChips(
  dest: DestinationId | null | undefined
): { label: string; url: string }[] {
  if (!dest) return [];
  const url = DEST_SOURCES[dest].official[0];
  if (!url) return [];
  return [{ label: officialLabel(url) || `Nguồn ${DEST_LABEL[dest]}`, url }];
}

export function publicSourceChips(
  snips: WebSnippet[],
  dest?: DestinationId | null
): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  for (const s of snips) {
    const label = officialLabel(s.url);
    if (!label) continue;
    if (out.some((c) => c.url === s.url || c.label === label)) continue;
    out.push({ label, url: s.url });
  }
  if (!out.length) out.push(...destOfficialChips(dest));
  else {
    for (const chip of destOfficialChips(dest)) {
      if (!out.some((c) => c.label === chip.label)) out.unshift(chip);
    }
  }
  return out.slice(0, 3);
}

export function webToContext(snips: WebSnippet[]): string {
  if (!snips.length) return "";
  return snips
    .map(
      (s, i) =>
        `[web ${i + 1} ${s.title} | ${s.url}]\n${s.text}`
    )
    .join("\n\n");
}

export function destLabelFor(query: string): string | null {
  const id = detectDestination(query);
  return id ? DEST_LABEL[id] : null;
}
