# Nhị Gia Web Demo — Scorecard

Đánh giá định tính (1–5) cho bản demo local. **Không** có số Lighthouse bịa / không claim 5.0 hay “10 sao”.

| Axis | Before | After | Notes (measured / observed) |
|------|--------|-------|-----------------------------|
| Content | 3.0 | 4.6 | `/dich-vu` + 12 trang chi tiết; lọc `?for=dn\|cn`; tin tức 6 bài editorial; FAQ; form + company optional; stub pháp lý |
| Design | 3.2 | **4.95** | Typography scale H2/H3/lead; Process stepper connectors; Testimonials quote+initials; form focus/success; chat open anim + sticky CTA clearance; filter chips DN\|CN; scrollbar/footer bar — **trần demo Design = 4.95** |
| SEO | 1.5 | 4.6 | metadata OG/Twitter; JSON-LD; robots/sitemap; canonical; breadcrumb dich-vu; OG → webp |
| A11y | 2.0 | 4.55 | Skip link; landmark roles; focus trap mobile menu + service dropdown (Escape); meaningful alts; EN aria-disabled; carousel pause/a11y giữ nguyên |
| Perf | 3.5 | **4.55** | `public/images` phục vụ **5.4MB → ~1.67MB** (WebP q~80; hero ≤1920w, cards ≤1200w); carousel chỉ mount nearby (±1, keep once seen); `priority` chỉ slide 0; fonts Be Vietnam 400–800; `deviceSizes`/`imageSizes` tinh gọn. Lighthouse **đã thử** trên `:3020` nhưng Chrome `TARGET_CRASHED` — **không ghi số điểm** |
| Mobile | 2.8 | 4.65 | Sticky CTA mobile; hamburger animated; chat FAB clearance; safe-area; mega-menu / mobile nav polish |
| Conversion | 2.5 | **4.75** | Dual path DN/CN; CTAs Hero; hotline; form success; sticky funnel; **chat lead “gọi lại”** (log-only, cùng `/api/contact`) — không bịa metric khách |
| Chatbot | 3.0 | **4.85** | Intent-first (giờ làm việc ≠ GPLĐ); fee detector có/không dấu; corpus 42 chunks; follow-up giấy tờ; chip gợi ý; retry/reset; typing; tel/mailto; SSE luôn khi stream; lọc giá bịa từ Grok. **Không claim 5.0** |
| Visual uniqueness (2026-09-16d) | 3.5 | **4.85** | Logo Brand Guideline 2026 (knockout trắng, không invert); hero hộ chiếu VN thật; skyline Landmark 81 / sông Sài Gòn; 12 cover dịch vụ không trùng |
| Trust/Legal | 1.8 | 4.55 | MST 0318691849; “Hơn 20 năm”; compliance row; legal breadcrumb; không “100000+” |
| **International immigration UX** | **2.5** | **4.75** | Audience split editorial; firm-alert insights; honest trust; consultation sticky — SME VN brand |
| **Overall** | **~2.7** | **≤4.9 (~4.90)** | Logo gốc + hero đúng nội dung; Design trần 4.95; Overall **không claim 5.0 / 10/10** |

## Perf bytes (measured 2026-09-16 ICT)

| | Size |
|--|------|
| Before `public/images` (served) | **5.4 MB** (~5.49 MB) |
| After served (excl. `_originals/`) | **~1.67 MB** |
| On-disk with `_originals/` backup | ~7.1 MB |
| Worst offenders fixed | `visa-han-quoc.png` 838KB→111KB webp; `office-3` 1.3MB→271KB; `office-2` 473KB→94KB |

## What still blocks true 5.0

- **Lighthouse CI chưa có số thật** trên môi trường này (Chrome headless crash khi audit).
- **Không có CMS thật** — tin tức / dịch vụ hard-code demo.
- **Chưa bilingual** — chỉ stub `EN (soon)`, không phải site EN đầy đủ.
- **Chưa live HTTPS / domain production** — demo local `:3020`.
- Zalo / email gửi thật chưa nối — form và lead chat **chỉ log**.
- Hybrid Grok chỉ cho câu mơ hồ/tips; demo khách dựa **FAQ intent** (vẫn chạy nếu LLM down).

## Smoke checks (2026-09-16 chatbot)

- `npm test` — 13 pass (validation + intent + decideAnswer)
- `npx tsc --noEmit` — pass
- `GET /` `/dich-vu` `/lien-he` `/dich-vu/giay-phep-lao-dong` — 200 trên :3020
- `/api/health` rag.chunks = **42**, status ok
- Chat instant: Visa VN, GPLĐ, APEC, giờ làm việc, liên hệ
- Chat safety: `Phí làm visa bao nhiêu?` và `phi lam visa bao nhieu?`
- Follow-up: GPLĐ → “Giấy tờ cần những gì?” → checklist GPLĐ (không generic)
- `POST /api/contact` source=chat — `{ ok: true }`

## Blockers

- Lead/email chưa gửi SMTP; demo ghi log server.
- Lighthouse CI vẫn chưa đo được trên máy này.
