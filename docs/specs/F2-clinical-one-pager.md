# F2 — Clinical One-Pager

**Backlog:** T-301 (domain), T-302 (preview + export) · **Depends on:** T-101 · **Screen:** `src/app/artifacts/one-pager.tsx`

## User story

> As a woman who gets three rushed minutes with a dismissive doctor, I want a single, credible page that
> summarizes what I've actually been experiencing — so I can put it on the desk and be taken seriously
> instead of scrambling to remember.

## Why it matters

This is the signature "slap it on the desk" leverage moment — the artifact that most visibly converts
*gaslit* into *documented*. It must look clinical-grade and credible **without ever making a medical
claim**. It states only what she logged, framed to start a conversation with a clinician.

## Flow

1. From the Artifacts hub, user taps **Clinical one-pager**.
2. Choose a date range (default: last 30 days).
3. `OnePagerPreview` renders the `OnePagerModel` on-screen (mirrors the print layout).
4. Optionally add/edit "questions for my clinician" (pulled from her tags/notes; editable).
5. Tap **Export / Share** → `render/onePagerHtml.ts` → expo-print PDF → expo-sharing share sheet.

## Content of the page (descriptive only)

- Header: optional `displayName`, generated date, date range. Label it clearly as a self-reported summary.
- Per-symptom aggregates: count, average severity, peak severity, days-with-symptom.
- A short "notable entries" strip (chronological highlights with timestamps).
- "Questions for my clinician" list (her words / her asks).
- **Required clinician disclaimer** (from `domain/disclaimers.ts`).

## Acceptance criteria

- [ ] `domain/onePager.ts` builds `OnePagerModel` from logs over the selected range; pure + unit-tested.
- [ ] The model and rendered page contain **only** facts derivable from her logs — no diagnosis, no cause,
      no treatment, no interpretation. A safety assertion fails the build/test if diagnostic language appears.
- [ ] `OnePagerPreview` on-screen matches the exported PDF layout.
- [ ] Export produces a **single-page** US-Letter/A4 PDF via expo-print, shareable via expo-sharing.
- [ ] PDF is legible: clear typography, aggregates readable at a glance (`type.mono` for data).
- [ ] Clinician disclaimer is always present on the PDF; cannot be removed.
- [ ] Date range selectable; default last 30 days; empty-range shows a fierce/validating empty state.
- [ ] All generated copy passes the banned-words check.

## Notes for later

- Optional 2-page appendix for power users (open question in PRD).
- v1.1: descriptive trend highlights (still no diagnosis).
- Clinic B2B: a clinician-branded variant of this page could seed the B2B track.
