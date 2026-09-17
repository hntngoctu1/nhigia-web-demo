# Nhị Gia Production Polish Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with verification after each task.

**Goal:** Remove the critical visual defects and raise the Nhị Gia demo to a credible production-ready marketing experience.

**Architecture:** Keep the existing Next.js App Router structure and component boundaries. Replace incorrect imagery and placeholder navigation in place, add defensive validation at API boundaries, and improve focus/viewport behavior without introducing new dependencies.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, existing local image assets.

**Spec:** Approved in conversation: production-ready polish across hero/trust, navigation, accessibility, API hardening, content links, and verification.

## Global Constraints

- Preserve Vietnamese brand tone and existing navy/gold visual system.
- Do not invent legal claims, approval rates, testimonials, fees, or production integrations.
- Keep all internal navigation client-transition friendly with `next/link`.
- Keep API behavior graceful when optional AI integrations are unavailable.

### Task 1: Correct hero and trust imagery

- Modify `components/Hero.tsx`, `components/Trust.tsx`, and `app/dich-vu/page.tsx`.
- Remove all `hinh-web-*.webp` low-resolution partner logos from full-bleed imagery.
- Use existing photographic assets (`banner-1.webp`, `about-1.webp`, service/office images) and reduce hero height so proof content can enter the first viewport.

### Task 2: Navigation and accessibility

- Replace internal raw anchors with `Link` in all lint-reported files.
- Ensure header labels do not wrap and hidden sticky CTA is not keyboard-focusable.
- Add chat dialog focus management and associate contact validation errors with fields.

### Task 3: Content conversion paths

- Give news cards stable detail URLs and make category controls semantic links or clearly non-interactive labels.
- Remove stale/demo-facing wording where it blocks trust, while preserving explicit limitations where no real integration exists.

### Task 4: API boundary hardening

- Bound request body, message count, message content, and contact field lengths.
- Restrict chat roles to user/assistant and return clear 400 responses for malformed payloads.

### Task 5: Verification

- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` using a clean process/port.
- Smoke-test homepage and APIs on an isolated local port and inspect rendered hero assets.
