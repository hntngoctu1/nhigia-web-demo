import { NextResponse } from "next/server";
import { loadCorpus, hasXaiKey, xaiConfig } from "@/lib/rag";

export const runtime = "nodejs";

export async function GET() {
  let corpusCount = 0;
  let corpusOk = false;
  try {
    corpusCount = loadCorpus().length;
    corpusOk = corpusCount > 0;
  } catch (e) {
    console.error("health corpus", e);
  }

  const llm = hasXaiKey();
  const { model, base } = xaiConfig();

  const status = corpusOk ? (llm ? "ok" : "degraded") : "error";

  return NextResponse.json(
    {
      status,
      service: "nhigia-web-demo",
      time: new Date().toISOString(),
      rag: { ok: corpusOk, chunks: corpusCount },
      llm: {
        configured: llm,
        model: llm ? model : null,
        base: llm ? base : null,
        note: llm
          ? "hybrid LLM + online search when RAG is thin"
          : "API key missing — FAQ/instant + local fallback only",
      },
      chat: {
        rateLimitPerMin: 30,
        streaming: true,
        modes: ["instant", "safety", "hybrid", "fallback"],
        intents: true,
        leadCapture: true,
      },
    },
    { status: corpusOk ? 200 : 503 }
  );
}
