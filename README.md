# Nhị Gia — Sales Demo Website

Next.js (App Router + TypeScript + Tailwind) marketing site inspired by [nhigia.vn](https://nhigia.vn/), with a production-style grounded chatbot (RAG + optional hybrid Grok).

## Quick start

```bash
cp .env.example .env.local   # leave XAI_API_KEY empty unless you have one
npm install
npm run dev -- -H 127.0.0.1 -p 3020
```

Open **http://127.0.0.1:3020**

Env (server-only): `CE_AI_BASE_URL` / `CE_AI_API_KEY` / `CE_AI_MODEL` (default `ag/gemini-3.7-flash-medium` at `https://api.ce.com.vn/v1`). `XAI_*` aliases still work. Without a key, `/api/health` is `degraded` and chat uses FAQ instant + local fallback (no crash). Questions outside the RAG corpus go hybrid: company context + online search, synthesized by the LLM.

## What’s included

- Vietnamese marketing site: hero + social proof, services (with `/dich-vu/[slug]`), visa countries, 5-step process, trust, testimonials, news, footer legal links
- Pages: `/lien-he` (form → `POST /api/contact` logs only), `/chinh-sach-bao-mat`, `/dieu-khoan`
- SEO: rich metadata, JSON-LD LocalBusiness + FAQPage, `robots.ts`, `sitemap.ts`
- A11y: skip link, focus-visible, mobile menu keyboard, chat dialog roles/labels
- Mobile sticky CTA: Gọi / Chat / Zalo (placeholder)
- Chatbot: intent-first FAQ (giờ làm việc, từng dịch vụ, địa chỉ, MST); follow-up giấy tờ theo ngữ cảnh; hybrid Grok + SSE chỉ khi câu mơ hồ; rate limit 30/min/IP; chặn phí cả không dấu; không bịa phí/cam kết; chip gợi ý; retry; để lại SĐT trong chat
- Security headers in `next.config.ts`

## Demo script (2 min)

1. Homepage hero CTAs → scroll services → open a `/dich-vu/...` page  
2. Footer / `/lien-he` form + legal stubs  
3. Chat chips: Visa VN → GPLĐ → “Giấy tờ GPLĐ” → E-Visa → Bảo lãnh → Liên hệ  
4. Safety: `Phí làm visa bao nhiêu?` (hoặc không dấu) → từ chối báo giá, mời 1900 6654  
5. `Giờ làm việc thế nào?` → T2–T6 08:00–17:30, **không** nhầm GPLĐ  
6. Sau 2 câu: “Để chuyên viên gọi lại” (demo log, chưa gửi email)  

See **SCORECARD.md** for before/after ratings.

## Contacts

- Hotline: **1900 6654** · Email: **info@nhigia.vn** · MST: **0318691849**
