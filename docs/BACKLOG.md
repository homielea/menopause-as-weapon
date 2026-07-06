# BACKLOG — Receipts

*Codename `menopause-as-weapon`. Ordered, agent-sized tickets. Work the lowest-numbered unblocked ticket.
Each ticket lists acceptance criteria; a ticket is done only when they + the global Definition of Done pass.*

## Global Definition of Done

- [ ] All acceptance criteria for the ticket met.
- [ ] `npx tsc --noEmit` passes (strict, zero errors, no `any`).
- [ ] `npm run lint` passes.
- [ ] `npm test` passes; any new `domain/` logic has unit tests.
- [ ] No HARD RULE (AGENTS.md) violated — especially **no diagnosis/treatment advice**, **local-first**,
      **no secrets**.
- [ ] Any new user-facing copy passes the banned-words check (DESIGN.md).
- [ ] Every artifact-producing path includes the required `DisclaimerFooter` / disclaimer text.
- [ ] Colors/spacing/type come from `theme/tokens.ts` (no hardcoded values).

---

## Milestone M0 — Foundation

**T-001 · Project scaffold**
Initialize Expo SDK 56 + TypeScript (strict) app with expo-router, Zustand, AsyncStorage, expo-print,
expo-sharing, expo-file-system, Jest.
- [ ] `npx expo start` boots to a placeholder tab layout (Log · Receipts · Artifacts).
- [ ] `tsconfig.json` has `strict: true`; `npx tsc --noEmit` clean.
- [ ] `npm run lint` and `npm test` scripts exist and pass (with a trivial test).
- [ ] No API keys / secrets anywhere in the repo.

**T-002 · Theme tokens & base components**
Implement `theme/tokens.ts` and `PrimaryButton`, `GhostButton`, `DisclaimerFooter` per DESIGN.md.
- [ ] All tokens from DESIGN.md present and exported; dark-first background applied.
- [ ] No pastel/pink/lavender values; no hardcoded hex outside `tokens.ts`.
- [ ] `DisclaimerFooter` renders the clinician disclaimer from `domain/disclaimers.ts`.

**T-003 · Data model, repository & disclaimers/safety**
Implement `domain/types.ts` (exact model from ARCHITECTURE), `data/repository.ts` (versioned
AsyncStorage), `domain/disclaimers.ts`, `domain/safety.ts`.
- [ ] `types.ts` matches ARCHITECTURE §3 exactly.
- [ ] `repository` reads/writes `PersistedState` with `schemaVersion`; boot hydrate works.
- [ ] `disclaimers.ts` exports non-empty clinician + duty-of-care text; unit-tested.
- [ ] `safety.ts` flags banned/diagnostic content and self-harm/emergency terms; unit-tested.

---

## Milestone M1 — Capture (F1)

**T-101 · logsStore + create-log domain logic**
- [ ] `domain/logging.ts` validates a `NewLogInput` → `SymptomLog` (requires `customLabel` iff `other`).
- [ ] `logsStore` add/remove/hydrate persist through `repository`; unit-tested selectors.
- [ ] Invalid input is rejected with a typed error, not a crash.

**T-102 · One-tap logging UI (F1)** — spec: `specs/F1-one-tap-logging.md`
- [ ] `LogButton`, `SeverityDial`, `ContextChips` implemented from DESIGN.md.
- [ ] A symptom can be logged in ≤ 3 taps and < 5 seconds from the Log screen.
- [ ] Saved log appears immediately in state; persists across app restart.
- [ ] Cycle context defaults respect `settings.menstruates`.

---

## Milestone M2 — Receipts timeline (F4)

**T-201 · timeline domain logic**
- [ ] `domain/timeline.ts` groups logs by day/week and filters by type/severity/tag; pure + tested.

**T-202 · Receipts timeline UI (F4)** — spec: `specs/F4-receipts-timeline.md`
- [ ] `ReceiptCard` + `TimelineGroup` render chronological logs, newest first.
- [ ] Filter by symptom type, severity, and tag works.
- [ ] Empty state uses fierce/validating voice, points to the LogButton.
- [ ] Counts/summary strip shows "X receipts in the last 30 days".

---

## Milestone M3 — Artifacts: One-pager (F2)

**T-301 · one-pager domain model**
- [ ] `domain/onePager.ts` builds `OnePagerModel` from logs over a date range; **descriptive only**,
      no interpretation; disclaimer always attached; pure + tested.

**T-302 · One-pager preview + PDF export (F2)** — spec: `specs/F2-clinical-one-pager.md`
- [ ] `OnePagerPreview` mirrors the print layout on-screen.
- [ ] `render/onePagerHtml.ts` → expo-print PDF → expo-sharing share sheet.
- [ ] Exported PDF is single-page (US-Letter/A4), legible, includes header (optional name), date range,
      per-symptom aggregates, notable entries, questions-for-clinician, and disclaimer.
- [ ] PDF contains **zero** diagnostic/treatment language (safety check asserts this).

---

## Milestone M4 — Artifacts: Scripts (F3)

**T-401 · scripts domain logic**
- [ ] `domain/scripts.ts` generates a `Script` per audience from logs; lines are asks/questions only;
      `sourceLogIds` populated; disclaimer attached; pure + tested for all three audiences.
- [ ] Employer script contains no legal advice; partner script contains no coercion (safety-tested).

**T-402 · Script sheet UI (F3)** — spec: `specs/F3-conversation-scripts.md`
- [ ] `ScriptSheet` renders line-by-line with an audience switcher (doctor/partner/employer).
- [ ] Tone toggle (`measured`/`fierce`) changes wording, never adds diagnosis.
- [ ] Copy-to-clipboard / share works; disclaimer footer always present.

---

## Milestone M5 — Onboarding (F5)

**T-501 · Onboarding flow — armed in 2 minutes (F5)** — spec: `specs/F5-onboarding-armed-in-2-min.md`
- [ ] First run: set voice, capture 1 log, and show a live artifact preview — all in the flow.
- [ ] Median path completes in < 2 minutes; user reaches an artifact preview before finishing.
- [ ] Sets `menstruates` + optional `displayName`; marks `onboardingComplete`.
- [ ] Skippable but always lands on the Log screen ready to capture.

---

## Milestone M6 — Hardening

**T-601 · Privacy & disclaimer audit**
- [ ] Confirm no network calls, no analytics on health content, no secrets.
- [ ] Every artifact path shows a disclaimer; safety checks cover one-pager + all scripts.
- [ ] Data export is user-initiated only.

**T-602 · Activation instrumentation (local-only, non-PII)**
- [ ] Local, non-PII counters for time-to-first-artifact & first-session activation (no health payloads,
      no third-party SDK). Used to validate PRD metrics.

---

## Deferred (v1.1 — not in MVP)

- Partner companion app (opt-in, general coaching, no raw-log access without explicit share).
- Optional AI script polish via **Anthropic Claude backend proxy** on de-identified data (no client keys).
- One-pager trend highlights (still descriptive, never diagnostic).
