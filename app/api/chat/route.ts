import { NextRequest, NextResponse } from "next/server";
import {
  decideAnswer,
  toSources,
  streamGrokReply,
  completeGrokReply,
  hasXaiKey,
  HOTLINE,
  EMAIL,
  SAFETY_REPLY,
  looksLikeInventedPrice,
  searchOnline,
  publicSourceChips,
  DEST_LABEL,
  type ChatMessage,
  type ChatSource,
  type ChatCitation,
  type DestinationId,
  type WebSnippet,
} from "@/lib/rag";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import {
  jsonBodyTooLarge,
  MAX_CHAT_BODY_BYTES,
  normalizeChatMessages,
} from "@/lib/chat/validation.mjs";

export const runtime = "nodejs";

function wantsStream(req: NextRequest, body: { stream?: boolean }): boolean {
  if (body.stream === true) return true;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/event-stream");
}

function softenMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, (block) =>
      block.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim()
    )
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[*-] /gm, "• ")
    .trim();
}

function ensureHotline(text: string): string {
  if (/1900\s*6654/.test(text)) return text;
  return `${text}\n\nNhị Gia hỗ trợ tư vấn hồ sơ này — anh/chị gọi 1900 6654 khi cần chuyên viên rà soát ạ.`;
}

function sanitizeReply(text: string, fallback: string): string {
  const trimmed = softenMarkdown((text || "").trim());
  if (!trimmed) return fallback;
  if (looksLikeInventedPrice(trimmed)) return SAFETY_REPLY;
  return ensureHotline(trimmed);
}

function sseResponse(
  payload: {
    reply: string;
    mode: string;
    sources: unknown;
    suggestions?: unknown;
    topic?: string;
    citations?: ChatCitation[];
  },
  remaining: number
) {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "meta",
            mode: payload.mode,
            sources: payload.sources,
            suggestions: payload.suggestions || [],
            topic: payload.topic,
            citations: payload.citations || [],
          })}\n\n`
        )
      );
      const parts = payload.reply.match(/[\s\S]{1,48}/g) || [payload.reply];
      for (const p of parts) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "token", content: p })}\n\n`
          )
        );
      }
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "done",
            reply: payload.reply,
            sources: payload.sources,
            suggestions: payload.suggestions || [],
            topic: payload.topic,
          })}\n\n`
        )
      );
      controller.close();
    },
  });
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}

function jsonReply(
  payload: {
    reply: string;
    mode: string;
    sources: unknown;
    suggestions?: unknown;
    topic?: string;
    citations?: ChatCitation[];
  },
  remaining: number,
  status = 200
) {
  return NextResponse.json(
    {
      reply: payload.reply,
      sources: payload.sources,
      mode: payload.mode,
      suggestions: payload.suggestions || [],
      topic: payload.topic,
      citations: payload.citations || [],
    },
    { status, headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_CHAT_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`chat:${ip}`, 30, 60_000);
  if (!rl.ok) {
    const payload = {
      reply: `Dạ hệ thống đang nhận nhiều yêu cầu. Anh/chị thử lại sau ít phút hoặc gọi ${HOTLINE}.`,
      mode: "fallback",
      sources: [],
      suggestions: [],
    };
    return jsonReply(payload, 0, 429);
  }

  try {
    let body: { messages?: unknown; stream?: boolean; lang?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    if (jsonBodyTooLarge(body)) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
    }
    const normalized = normalizeChatMessages(body?.messages);
    if (!normalized.ok) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }
    const messages = normalized.messages as ChatMessage[];
    const lang: "vi" | "en" = body.lang === "en" ? "en" : "vi";

    const decision = decideAnswer(messages);
    if (lang === "en") {
      const { EN_INSTANT, EN_SUGGEST } = await import("@/lib/i18n/chat-en");
      const topic = (decision.topic || "unknown") as import("@/lib/rag/intent").Topic;
      if (EN_INSTANT[topic]) decision.reply = EN_INSTANT[topic];
      if (EN_SUGGEST[topic]) decision.suggestions = EN_SUGGEST[topic];
      if (!decision.reply && EN_INSTANT.contact) {
        decision.reply = `I may need a specialist for that. Please call ${HOTLINE} or email ${EMAIL}.`;
      }
    }
    const stream = wantsStream(req, body);
    const localFallback =
      decision.reply ||
      (lang === "en"
        ? `Sorry, I could not answer that. Please call ${HOTLINE}.`
        : `Xin lỗi, em chưa trả lời được. Vui lòng gọi ${HOTLINE}.`);

    let web: WebSnippet[] = [];
    const dest = (decision.destination || null) as DestinationId | null;
    if (decision.kind === "hybrid" && hasXaiKey()) {
      web = await searchOnline(decision.query, { dest, budgetMs: 3200 });
    }
    const citations = publicSourceChips(web, dest);
    const sources: ChatSource[] = [
      ...decision.sources,
      ...web.map((s) => ({
        id: s.id,
        section: s.title,
        score: 0.5,
        excerpt: (s.text || "").replace(/\s+/g, " ").slice(0, 160),
        url: s.url,
      })),
    ];
    const llmOpts = {
      web,
      destLabel: dest ? DEST_LABEL[dest] : null,
      enableSearch: false,
      lang,
    };

    const localPayload = {
      reply: localFallback,
      mode: decision.kind === "hybrid" ? "fallback" : decision.kind,
      sources,
      suggestions: decision.suggestions,
      topic: decision.topic,
      citations,
    };

    if (decision.kind !== "hybrid" || !hasXaiKey()) {
      return stream
        ? sseResponse(localPayload, rl.remaining)
        : jsonReply(localPayload, rl.remaining);
    }

    if (stream) {
      let upstream: Response;
      try {
        upstream = await streamGrokReply(messages, decision.chunks, llmOpts);
      } catch (err) {
        console.error("streamGrokReply failed", err);
        return sseResponse(
          { ...localPayload, reply: localFallback, mode: "fallback" },
          rl.remaining
        );
      }

      if (!upstream.ok || !upstream.body) {
        const t = await upstream.text().catch(() => "");
        console.error("xAI stream error", upstream.status, t.slice(0, 300));
        try {
          const text = sanitizeReply(
            await completeGrokReply(messages, decision.chunks, llmOpts),
            localFallback
          );
          return sseResponse(
            { ...localPayload, reply: text, mode: "hybrid" },
            rl.remaining
          );
        } catch {
          return sseResponse(
            {
              ...localPayload,
              reply: `Dạ AI tạm gián đoạn. Liên hệ ${HOTLINE} / ${EMAIL}.`,
              mode: "fallback",
            },
            rl.remaining
          );
        }
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      const suggestions = decision.suggestions || [];
      const topic = decision.topic;

      const readable = new ReadableStream({
        async start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "meta",
                mode: "hybrid",
                sources,
                suggestions,
                topic,
                citations,
              })}\n\n`
            )
          );
          const reader = upstream.body!.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;
                const data = trimmed.slice(5).trim();
                if (data === "[DONE]") continue;
                try {
                  const json = JSON.parse(data) as {
                    choices?: { delta?: { content?: string } }[];
                  };
                  const token = json.choices?.[0]?.delta?.content;
                  if (token) {
                    full += token;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "token", content: token })}\n\n`
                      )
                    );
                  }
                } catch {
                  /* ignore partial JSON */
                }
              }
            }
            const reply = sanitizeReply(full, localFallback);
            if (reply !== full) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "replace", reply })}\n\n`
                )
              );
            }
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "done",
                  reply,
                  sources,
                  citations,
                  suggestions,
                  topic,
                })}\n\n`
              )
            );
          } catch (e) {
            console.error("SSE pipe error", e);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "error",
                  message: `Lỗi stream. Gọi ${HOTLINE}.`,
                })}\n\n`
              )
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      });
    }

    try {
      const text = sanitizeReply(
        await completeGrokReply(messages, decision.chunks, llmOpts),
        localFallback
      );
      return jsonReply(
        { ...localPayload, reply: text, mode: "hybrid" },
        rl.remaining
      );
    } catch (err) {
      console.error("completeGrokReply failed", err);
      return jsonReply(
        {
          ...localPayload,
          reply: `Dạ AI tạm gián đoạn. Liên hệ ${HOTLINE} / ${EMAIL}.`,
          mode: "fallback",
          sources: toSources(decision.chunks.slice(0, 4)),
        },
        rl.remaining
      );
    }
  } catch (err) {
    console.error("/api/chat error", err);
    return NextResponse.json(
      {
        reply: `Xin lỗi, hệ thống chat tạm thời gặp sự cố. Vui lòng gọi ${HOTLINE} hoặc email ${EMAIL}.`,
        sources: [],
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
