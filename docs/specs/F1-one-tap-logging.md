# F1 — One-Tap Symptom + Context Logging

**Backlog:** T-101 (domain), T-102 (UI) · **Depends on:** T-003 (data model) · **Screen:** Log (`src/app/index.tsx`)

## User story

> As a woman whose symptoms are dismissed, I want to capture what's happening in seconds — the moment it
> happens — so that later I have undeniable, timestamped evidence instead of a vague memory I can be
> talked out of.

## Why it matters

F1 is the raw material of every artifact. If capture isn't fast and frictionless, the receipts never
exist and the credibility engine has nothing to work with. **Every log must be convertible into leverage**
(one-pager, script, receipt) — that's the invariant this feature feeds.

## Flow

1. User opens app → lands on the **Log** screen (oversized `LogButton` front and center).
2. Tap `LogButton` → symptom picker (curated `SymptomType` shortlist + "other").
3. Pick symptom → `SeverityDial` (0–4) appears; default preselected for speed.
4. Optional: toggle `ContextChips` (cycle context + tags like "at work", "woke me up") and/or add a short note.
5. Confirm (or auto-confirm on severity pick for the fastest path) → log saved, timestamped, persisted.
6. Micro-affirmation shows briefly ("Logged. It's on the record.") and returns to Log, ready for the next.

Target: **≤ 3 taps, < 5 seconds** for the common path (symptom + severity).

## Acceptance criteria

- [ ] Log screen shows the `LogButton` as the primary, thumb-reachable control.
- [ ] A symptom can be logged in ≤ 3 taps and < 5 seconds (symptom + severity), context optional.
- [ ] Symptom picker uses the curated `SymptomType` list; "other" requires a `customLabel`.
- [ ] Severity uses `SeverityDial` (0–4) with `color.severity*` tokens.
- [ ] Cycle-context default follows `settings.menstruates` (days-since if she menstruates, else phase-agnostic).
- [ ] Tags and an optional note can be attached; note is stored verbatim and **never interpreted**.
- [ ] Saved log appears immediately in `logsStore` and in the Receipts timeline; survives app restart.
- [ ] Confirmation copy is validating and a little fierce; passes the banned-words check.
- [ ] No diagnostic prompt appears (app never asks "do you have X condition?").

## Notes for later

- Consider a quick-repeat ("same as last time") and a home-screen widget / quick action for one-tap-from-lock.
- Post-menopausal cycle model (days-since vs. phase-agnostic) is an open question in the PRD — keep the
  context model swappable.
- Free-text vs. curated taxonomy trade-off: start curated for legible one-pagers; revisit if users demand more.
