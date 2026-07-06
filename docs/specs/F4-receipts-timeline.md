# F4 — Receipts Timeline

**Backlog:** T-201 (domain), T-202 (UI) · **Depends on:** T-101 · **Screen:** Receipts (`src/app/receipts.tsx`)

## User story

> As a woman told she's "overreacting," I want a chronological, filterable record of everything I've
> logged — so that when my reality is questioned, I have receipts, not just a feeling.

## Why it matters

The receipts timeline is the everyday proof-of-reality surface: the direct rebuttal to "you're
overreacting" and "you're imagining it," in data. It is also where she sees her own patterns before an
appointment, which feeds the one-pager and scripts.

## Flow

1. User opens the **Receipts** tab.
2. Sees logs newest-first, grouped by day/week (`TimelineGroup` + `ReceiptCard`).
3. A summary strip up top: "X receipts in the last 30 days."
4. Filter by symptom type, severity, and tag.
5. Tap a receipt to see full detail (severity, context, note, timestamp). Optional delete.

## Acceptance criteria

- [ ] `domain/timeline.ts` groups logs by day/week and filters by type/severity/tag; pure + unit-tested.
- [ ] `ReceiptCard` shows timestamp (`type.label`), severity marker (`color.severity*`), tags, and note snippet.
- [ ] Logs render newest-first, grouped, with sticky group headers.
- [ ] Filters for symptom type, severity, and tag work and combine.
- [ ] Summary strip shows an accurate count for a selectable window (default last 30 days).
- [ ] Detail view shows the full log; delete removes it from state and persistence.
- [ ] Empty state uses fierce/validating voice and points to the LogButton; passes banned-words check.
- [ ] No diagnostic labels or interpretations appear anywhere in the timeline.

## Notes for later

- "Export selected receipts" as a quick path into the one-pager (range/selection reuse).
- Highlight streaks/clusters descriptively (never as a diagnosis).
- Search across notes/tags once volume grows.
