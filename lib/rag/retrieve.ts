import { loadCorpus } from "./corpus";
import { foldDiacritics } from "./normalize";
import type { DestinationId } from "./intent";
import type { RagChunk, ScoredChunk } from "./types";

const VI_STOP = new Set(
  [
    "va", "cua", "cho", "voi", "cac", "la", "duoc", "mot", "nhung", "co",
    "trong", "de", "ve", "nay", "khi", "tai", "hay", "hoac", "the", "a", "an",
    "to", "of", "in", "on", "for", "and", "or", "is", "are", "be", "da",
    "anh", "chi", "em", "minh", "ban", "thi", "nao", "gi", "sao", "nhu",
  ].map((t) => foldDiacritics(t))
);

function tokenize(text: string): string[] {
  return foldDiacritics(text)
    .replace(/[^\p{L}\p{N}\s+-]/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !VI_STOP.has(t));
}

function buildIdf(docs: string[][]): Map<string, number> {
  const df = new Map<string, number>();
  const n = docs.length || 1;
  for (const tokens of docs) {
    const uniq = new Set(tokens);
    for (const t of uniq) df.set(t, (df.get(t) || 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log(1 + n / (1 + count)) + 1);
  }
  return idf;
}

function tfMap(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  const len = tokens.length || 1;
  for (const [k, v] of m) m.set(k, v / len);
  return m;
}

function cosine(
  a: Map<string, number>,
  b: Map<string, number>,
  idf: Map<string, number>
): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) {
    const wa = (a.get(k) || 0) * (idf.get(k) || 1);
    const wb = (b.get(k) || 0) * (idf.get(k) || 1);
    dot += wa * wb;
    na += wa * wa;
    nb += wb * wb;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

type Index = {
  n: number;
  docs: string[][];
  idf: Map<string, number>;
};

let indexCache: Index | null = null;

function getIndex(): Index {
  const corpus = loadCorpus();
  if (indexCache && indexCache.n === corpus.length) return indexCache;
  const docs = corpus.map((c) => tokenize(`${c.id} ${c.text}`));
  indexCache = { n: corpus.length, docs, idf: buildIdf(docs) };
  return indexCache;
}

/** Test helper after corpus edits in a long-lived process */
export function clearRetrieveCache() {
  indexCache = null;
}

function keywordBoost(query: string, chunk: RagChunk): number {
  const q = foldDiacritics(query);
  const t = foldDiacritics(chunk.text);
  const id = foldDiacritics(chunk.id);
  let boost = 0;
  const pairs: [RegExp, number][] = [
    [/e-?\s*visa|thi thuc dien tu/, 0.35],
    [/gpld|giay phep lao dong|work\s*permit/, 0.35],
    [/visa\s*viet\s*nam|visa\s*vn/, 0.3],
    [/lien he|hotline|email|dia chi|1900/, 0.35],
    [/gio lam viec|gio mo cua/, 0.45],
    [/quy trinh|5 buoc|tu van/, 0.3],
    [/the tam tru|cong van|hop phap hoa|bao lanh/, 0.3],
    [/ho chieu|apec|ly lich tu phap|lltp/, 0.25],
    [/hoi huong|nhap tich|thue nha/, 0.25],
    [/visa my|sang my|hoa ky/, 0.35],
    [/trung quoc/, 0.3],
    [/dai loan|han quoc|nhat ban/, 0.2],
    [/phi|bao nhieu tien|cam ket|dam bao dau|bang gia/, 0.4],
    [/meo|tip|luu y|checklist|chuan bi/, 0.2],
  ];
  for (const [re, w] of pairs) {
    if (re.test(q) && (re.test(t) || re.test(id))) boost += w;
  }
  if (
    id.includes("safety") &&
    /phi|bao nhieu|dam bao|cam ket|chac chan dau|bang gia/.test(q)
  ) {
    boost += 0.5;
  }
  // Don't let work-permit chunks steal office-hours questions.
  if (
    /gio lam viec|gio mo cua|lam viec the nao/.test(q) &&
    /gpld|giay phep lao dong|work permit/.test(`${id} ${t}`)
  ) {
    boost -= 0.4;
  }
  return boost;
}

function destBoost(dest: DestinationId | null | undefined, chunk: RagChunk): number {
  if (!dest) return 0;
  const t = foldDiacritics(`${chunk.id} ${chunk.text}`);
  if (dest === "us") {
    if (/hoa ky|visa my|united states/.test(t)) return 0.4;
    if (
      /trung quoc|bao lanh|cong van|evisa|visa viet nam|gpld|tam tru/.test(t) &&
      !/hoa ky|visa my/.test(t)
    ) {
      return -0.5;
    }
  }
  if (dest === "cn") {
    if (/trung quoc/.test(t)) return 0.4;
    if (/visa my|hoa ky/.test(t) && !/trung quoc/.test(t)) return -0.3;
  }
  const labels: Record<DestinationId, RegExp> = {
    us: /hoa ky|visa my/,
    cn: /trung quoc/,
    kr: /han quoc/,
    jp: /nhat ban/,
    au: /\buc\b|australia/,
    tw: /dai loan/,
    uk: /anh quoc/,
    schengen: /schengen|chau au/,
    sg: /singapore/,
  };
  if (labels[dest].test(t)) return 0.35;
  return 0;
}

export function chunksByIds(ids: string[]): ScoredChunk[] {
  const corpus = loadCorpus();
  const out: ScoredChunk[] = [];
  ids.forEach((id, i) => {
    const chunk = corpus.find((c) => c.id === id);
    if (chunk) out.push({ ...chunk, score: 1 - i * 0.04 });
  });
  return out;
}

export function retrieve(
  query: string,
  topK = 4,
  dest?: DestinationId | null
): ScoredChunk[] {
  const corpus = loadCorpus();
  const { docs, idf } = getIndex();
  const qTokens = tokenize(query);
  const qTf = tfMap(qTokens);

  const scored: ScoredChunk[] = corpus.map((chunk, i) => {
    const tf = tfMap(docs[i]);
    const base = cosine(qTf, tf, idf);
    const score =
      base + keywordBoost(query, chunk) + destBoost(dest, chunk);
    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0.02)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
