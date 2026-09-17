import { retrieve, chunksByIds } from "./retrieve";
import { hasXaiKey } from "./grok";
import {
  DEST_LABEL,
  detectDestination,
  detectTopic,
  docsChunkId,
  expandQuery,
  inboundDocsTopic,
  isAvailabilityQuestion,
  isDetailQuestion,
  suggestionsFor,
  TOPIC_CHUNK,
  type DestinationId,
  type Topic,
} from "./intent";
import type {
  ChatMessage,
  ChatResponse,
  ChatSource,
  InstantDecision,
  ScoredChunk,
} from "./types";

export { isFeeOrGuarantee } from "./intent";

export const HOTLINE = "1900 6654";
export const EMAIL = "info@nhigia.vn";

function excerpt(text: string, n = 160): string {
  const one = text.replace(/\s+/g, " ").trim();
  return one.length <= n ? one : one.slice(0, n - 1) + "…";
}

export function toSources(chunks: ScoredChunk[]): ChatSource[] {
  return chunks.map((c) => ({
    id: c.id,
    section:
      typeof c.metadata?.section === "string" ? c.metadata.section : undefined,
    score: Math.round(c.score * 1000) / 1000,
    excerpt: excerpt(c.text),
  }));
}

function extractQaAnswer(text: string): string | null {
  const m = text.match(/Câu trả lời:\s*([\s\S]+)/i);
  return m ? m[1].trim() : null;
}

function outboundFallback(query: string, destHint?: DestinationId | null): string {
  const dest = destHint || detectDestination(query);
  const name = dest ? DEST_LABEL[dest] : "nước ngoài";
  return (
    `Dạ Nhị Gia hỗ trợ tư vấn/thủ tục visa ${name}. Hồ sơ thường gồm hộ chiếu còn hạn, ảnh đúng quy cách, đơn theo loại thị thực, lịch trình và giấy tờ chứng minh mục đích chuyến đi — danh mục chi tiết phụ thuộc loại visa và thời điểm nộp, em không chốt checklist tuyệt đối trên chat. ` +
    `Anh/chị cho em biết mục đích (du lịch, công tác hay du học), hoặc gọi ${HOTLINE} / email ${EMAIL} để nhận hướng dẫn sát hồ sơ ạ.`
  );
}

const INBOUND_DROP = new Set([
  "qa-docs-generic",
  "qa-docs-gpld",
  "qa-docs-visa",
  "qa-docs-baolanh",
  "qa-docs-tamtru",
  "qa-7",
  "tip-bao-lanh",
  "tip-visa-vn",
  "tip-evisa",
  "qa-6",
]);

function hybridChunks(
  query: string,
  dest: DestinationId | null
): ScoredChunk[] {
  const pinnedIds =
    dest === "cn"
      ? ["qa-visa-countries", "svc-visa-countries", "tip-china-visa", "intro-1"]
      : dest
        ? ["qa-visa-countries", "svc-visa-countries", "intro-1"]
        : ["intro-1", "qa-1"];
  const pinned = chunksByIds(pinnedIds);
  const extra = retrieve(query, 8, dest).filter((c) => {
    if (pinnedIds.includes(c.id)) return false;
    if (dest && INBOUND_DROP.has(c.id)) return false;
    if (dest && !/visa-countries|svc-visa|tip-china|intro-1/.test(c.id)) {
      return false;
    }
    return true;
  });
  return [...pinned, ...extra].slice(0, 5);
}

function pickFallbackReply(
  query: string,
  chunks: ScoredChunk[],
  dest?: DestinationId | null
): string {
  if (dest || (detectDestination(query) && isDetailQuestion(query))) {
    return outboundFallback(query, dest);
  }
  if (!chunks.length) {
    return `Dạ em chưa tìm thấy thông tin đủ chắc trong tài liệu. Anh/chị vui lòng gọi tổng đài ${HOTLINE} hoặc email ${EMAIL} để được chuyên viên Nhị Gia hỗ trợ trực tiếp ạ.`;
  }
  const qa = chunks.find((c) => c.id.startsWith("qa-"));
  if (qa) {
    const ans = extractQaAnswer(qa.text);
    if (ans) return ans;
  }
  const top = chunks[0];
  const body = top.text
    .replace(/^Câu hỏi:.*$/gim, "")
    .replace(/^Câu trả lời:\s*/gim, "")
    .trim();
  const lead =
    "Dạ dựa trên thông tin công khai của Nhị Gia, em xin chia sẻ như sau:\n\n";
  const tail = `\n\nNếu cần hỗ trợ hồ sơ cụ thể, anh/chị gọi ${HOTLINE} hoặc email ${EMAIL} nhé ạ.`;
  return lead + body + tail;
}

export const SAFETY_REPLY =
  `Dạ em không thể báo phí cụ thể hay cam kết chắc chắn đậu visa/GPLĐ trên chatbot (cần thẩm định hồ sơ thực tế). ` +
  `Anh/chị vui lòng liên hệ ${HOTLINE} / ${EMAIL} để chuyên viên tư vấn theo từng trường hợp. ` +
  `Em có thể giới thiệu dịch vụ, mẹo chuẩn bị hồ sơ hoặc quy trình nếu anh/chị cần.`;

function instantFromIds(
  ids: string[],
  query: string,
  topic: Topic,
  prevTopic: Topic
): InstantDecision | null {
  const chunks = chunksByIds(ids);
  if (!chunks.length) return null;
  const qa = chunks.find((c) => c.id.startsWith("qa-") || c.id === "safety");
  const ans = qa ? extractQaAnswer(qa.text) : null;
  const reply =
    topic === "fee"
      ? SAFETY_REPLY
      : ans || pickFallbackReply(query, chunks);
  return {
    kind: topic === "fee" ? "safety" : "instant",
    reply,
    sources: toSources(chunks.slice(0, 4)),
    chunks,
    query,
    topic,
    suggestions: suggestionsFor(topic, prevTopic),
  };
}

/**
 * Decide instant FAQ/policy path vs hybrid LLM vs local fallback.
 * Known intents (hours, contact, each service…) never go through TF-IDF/Grok.
 */
export function decideAnswer(messages: ChatMessage[]): InstantDecision {
  const { query, topic, prevTopic, destination } = expandQuery(messages);
  const suggestions = suggestionsFor(topic, prevTopic, destination);

  if (!query) {
    return {
      kind: "instant",
      reply: `Xin chào! Em là trợ lý của Nhị Gia. Anh/chị cần tư vấn Visa VN, GPLĐ, E-Visa, bảo lãnh hay liên hệ? Hotline ${HOTLINE}.`,
      sources: [],
      chunks: [],
      query: "",
      topic: "unknown",
      suggestions,
    };
  }

  if (topic === "fee") {
    const decided = instantFromIds(["safety"], query, topic, prevTopic);
    if (decided) return decided;
    return {
      kind: "safety",
      reply: SAFETY_REPLY,
      sources: [],
      chunks: [],
      query,
      topic,
      suggestions,
    };
  }

  if (topic === "docs" && inboundDocsTopic(prevTopic)) {
    const decided = instantFromIds(
      [docsChunkId(prevTopic), "qa-docs-generic"],
      query,
      topic,
      prevTopic
    );
    if (decided) return decided;
  }

  if (
    topic === "time" &&
    !destination &&
    prevTopic !== "visa-countries"
  ) {
    const decided = instantFromIds(["qa-time"], query, topic, prevTopic);
    if (decided) return decided;
  }

  const mapped = TOPIC_CHUNK[topic];
  const visaDetail =
    topic === "visa-countries" &&
    (isDetailQuestion(query) || !isAvailabilityQuestion(query));
  if (mapped?.length && !visaDetail) {
    const decided = instantFromIds(mapped, query, topic, prevTopic);
    if (decided) return decided;
  }
  // "Có tư vấn visa Mỹ không?" stays instant FAQ; "visa sang Mỹ cần chuẩn bị gì" goes hybrid.

  const dest = destination || detectDestination(query);
  const chunks =
    visaDetail || dest
      ? hybridChunks(query, dest)
      : retrieve(query, 5, dest);
  const sources = toSources(chunks.slice(0, 4));
  const top = chunks[0];
  const qaHit = chunks.find((c) => c.id.startsWith("qa-") && c.score >= 0.35);
  const policyHit = chunks.find(
    (c) =>
      (c.metadata?.type === "policy" || c.id === "safety") && c.score >= 0.4
  );

  const weakRag =
    !chunks.length ||
    !top ||
    top.score < 0.42 ||
    top.id === "qa-docs-generic" ||
    (dest && isDetailQuestion(query));
  const needsOnline =
    visaDetail ||
    topic === "unknown" ||
    (topic === "docs" && !inboundDocsTopic(prevTopic)) ||
    (topic === "time" && (Boolean(dest) || prevTopic === "visa-countries")) ||
    weakRag;

  if (needsOnline) {
    return {
      kind: "hybrid",
      reply: pickFallbackReply(query, chunks, dest),
      sources,
      chunks,
      query,
      topic,
      suggestions,
      destination: dest,
    };
  }

  if (qaHit && (qaHit.score >= 0.45 || qaHit === top)) {
    const ans = extractQaAnswer(qaHit.text);
    if (ans) {
      return {
        kind: "instant",
        reply: ans,
        sources,
        chunks,
        query,
        topic: detectTopic(query),
        suggestions,
      };
    }
  }

  if (policyHit) {
    return {
      kind: "instant",
      reply: pickFallbackReply(query, [policyHit]),
      sources,
      chunks,
      query,
      topic,
      suggestions,
    };
  }

  return {
    kind: "fallback",
    reply: pickFallbackReply(query, chunks),
    sources,
    chunks,
    query,
    topic,
    suggestions,
  };
}

export function answerChat(messages: ChatMessage[]): ChatResponse {
  const d = decideAnswer(messages);
  if (d.kind === "hybrid") {
    return {
      reply: pickFallbackReply(
        d.query,
        d.chunks,
        (d.destination as DestinationId | null) || null
      ),
      sources: d.sources,
      mode: hasXaiKey() ? "hybrid" : "fallback",
      topic: d.topic,
      suggestions: d.suggestions,
    };
  }
  return {
    reply: d.reply || pickFallbackReply(d.query, d.chunks),
    sources: d.sources,
    mode:
      d.kind === "safety"
        ? "safety"
        : d.kind === "instant"
          ? "instant"
          : "fallback",
    topic: d.topic,
    suggestions: d.suggestions,
  };
}
