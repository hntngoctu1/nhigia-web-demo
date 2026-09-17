import { NextRequest, NextResponse } from "next/server";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import {
  jsonBodyTooLarge,
  MAX_CONTACT_BODY_BYTES,
} from "@/lib/chat/validation.mjs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_CONTACT_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }
    if (jsonBodyTooLarge(body, 12_000)) {
      return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }
    const data = (body && typeof body === "object" ? body : {}) as Record<
      string,
      unknown
    >;
    const source = String(data.source || "").trim();
    let name = String(data.name || "").trim();
    const company = String(data.company || "").trim().slice(0, 120);
    const phone = String(data.phone || "").trim();
    const email = String(data.email || "").trim();
    let message = String(data.message || "").trim();
    const service = String(data.service || "").trim();

    if (source === "chat") {
      if (!name) name = "Khách chat web";
      if (!message || message.length < 10) {
        message = "Yêu cầu gọi lại từ chatbot website Nhị Gia.";
      }
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "invalid_name" },
        { status: 400 }
      );
    }
    if (!phone || !/^[0-9+\s()-]{8,20}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "invalid_phone" },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 }
      );
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "invalid_message" },
        { status: 400 }
      );
    }

    const lead = {
      at: new Date().toISOString(),
      ip,
      source: source || "form",
      name,
      company: company || null,
      phone,
      email: email || null,
      service: service || null,
      message: message.slice(0, 2000),
    };
    try {
      const dir = path.join(process.cwd(), "data", "leads");
      await mkdir(dir, { recursive: true });
      await appendFile(
        path.join(dir, "inbox.jsonl"),
        `${JSON.stringify(lead)}\n`,
        "utf8"
      );
    } catch (storeErr) {
      console.error("[contact] persist", storeErr);
    }
    console.log("[contact]", { at: lead.at, source: lead.source, service: lead.service });

    return NextResponse.json({
      ok: true,
      message:
        "Đã nhận thông tin. Chuyên viên sẽ liên hệ sớm — hoặc gọi ngay 1900 6654.",
    });
  } catch (err) {
    console.error("/api/contact", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
