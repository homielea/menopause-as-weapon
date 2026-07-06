# PRD — Receipts

*Codename `menopause-as-weapon`. This document defines the product. The MVP scope table is the contract.*

## 1. Problem & insight

Menopause and perimenopause symptoms are routinely **dismissed** — by doctors ("your labs are normal,
you're fine"), by partners ("you're overreacting"), and by workplaces (penalized, not accommodated).
The deepest harm women report is not the hot flash; it's **not being believed** — an *epistemic* injury.

Incumbent femtech apps are symptom diaries. They produce a chart and a feeling of being *managed*.
None of them produce **leverage**.

**Insight:** The output of tracking should not be a chart — it should be an artifact that changes an
outcome. Convert *gaslit* into *documented*. Same one-tap capture as everyone else; radically different
output.

## 2. Target user

**Primary:** Women 40s–50s whose symptoms are dismissed by doctors, misread by partners, or penalized
at work. Motivated, underserved, furious about not being believed. Tech-comfortable enough to log on a
phone. She wants to walk into her next appointment or hard conversation **prepared and credible**.

**Secondary (fast-follow):** Her partner — an under-served second customer in the same household, who
wants to help but keeps "saying the wrong thing."

**Anti-persona:** The calm, well-supported user who wants a gentle wellness journal and already has a
great menopause specialist. Building for her softens the wedge into another pastel tracker. **We do not
optimize for her.**

## 3. Non-negotiable product principles

1. **Every log earns an artifact.** Capture that can't become leverage doesn't ship. The credibility
   engine (log → one-pager / script / receipt) is the product.
2. **We arm, we do not diagnose.** We organize *her* data and prepare her for clinicians. We never tell
   her what's medically wrong or what to take. (See ARCHITECTURE invariants; this is a hard rule.)
3. **Armed in 2 minutes.** First-run must produce the *feeling of leverage* before onboarding ends —
   one log and a preview of a real artifact.
4. **Believe first.** The voice validates her reality. Validating and a little fierce — never clinical,
   never pastel, never scolding.
5. **Her data, her device, her choice to share.** Local-first. Nothing leaves the phone without an
   explicit, user-initiated action.
6. **Scripts are asks, not attacks.** Leverage means credibility and preparation, not coercion.

## 4. MVP scope (v1.0) — the contract

| # | Feature | What it does | Why it's in MVP | Spec |
| --- | --- | --- | --- | --- |
| **F1** | One-tap symptom + context logging | Capture a symptom in <5s with timestamp, severity, and cycle/context tags | The raw material of every artifact | `specs/F1-one-tap-logging.md` |
| **F2** | Clinical one-pager | Auto-generate a doctor-ready, single-page PDF summary of her logged data (frequency, patterns, timeline), user-shareable | The signature "slap it on the desk" leverage moment | `specs/F2-clinical-one-pager.md` |
| **F3** | Conversation scripts | Generate evidence-backed scripts for doctor / partner / employer, grounded only in her own logs | Turns data into words she can actually say | `specs/F3-conversation-scripts.md` |
| **F4** | Receipts timeline | A chronological, filterable "receipts" view that answers "you're overreacting" with data | The everyday proof-of-reality surface | `specs/F4-receipts-timeline.md` |
| **F5** | Onboarding — armed in 2 min | Fast first-run: one log + live artifact preview, sets the fierce/validating tone | Delivers the core promise on first open | `specs/F5-onboarding-armed-in-2-min.md` |

MVP is **local-first with no backend and no AI.** Artifacts are generated deterministically on-device
from templates + her data.

## 5. Fast-follow (v1.1)

- **Partner companion app (bundled).** Opt-in, coaches the partner with general, non-clinical guidance:
  "she's not mad at you, here's what's happening this week, here's what NOT to say." Never exposes her
  raw logs without her explicit share. This is also the household referral engine.
- **Optional AI script polish.** Refine tone/wording of F3 scripts via an **Anthropic Claude backend
  proxy** on **de-identified** data. Deterministic templates remain the fallback and the default.
- **Trend/pattern highlights** in the one-pager (still descriptive of her data, never a diagnosis).

## 6. Explicitly out of scope (MVP)

- Any diagnosis, condition suggestion, lab-result interpretation, or treatment/medication/HRT advice.
- Cloud accounts, cross-device sync, social feed, or community features.
- Wearable/health-API ingestion (Apple Health, etc.).
- Clinician-facing portal / B2B dashboard (future B2B track).
- The partner companion app (that is v1.1).
- Any third-party analytics on health content.

## 7. Success metrics (directional targets)

*Directional, not committed OKRs — used to steer the MVP.*

| Metric | Why it matters | Directional target |
| --- | --- | --- |
| Time-to-first-artifact | Proves "armed in 2 minutes" | Median < 2 min in first session |
| First-session activation (≥1 log AND views an artifact preview) | Core loop experienced | > 60% of new users |
| Artifact export/share rate (one-pager or script) | The leverage moment actually used | > 25% of activated users within 14 days |
| D7 / D30 retention | Habit around real appointments/conversations | D7 > 30%, D30 > 15% |
| Trial → paid conversion | Willingness to pay for leverage | > 5% |
| "I felt believed / armed" (in-app pulse) | Emotional job done | > 70% agree |

## 8. Risks → mitigations

| Risk | Mitigation |
| --- | --- |
| Medical-claim / liability | Hard invariant: never diagnose or advise treatment; artifacts state only her logged data as questions/asks; clinician disclaimer on every export. |
| Privacy of intimate health + relationship data | Local-first; no account; no analytics on health content; explicit-only export. |
| "Weaponized" framing reads as anti-doctor/anti-partner | Scripts are collaborative asks; voice targets *being believed*, not attacking. |
| Feels like just another tracker | Enforce "every log earns an artifact"; onboarding leads with the artifact, not the chart. |
| Partner app feels like surveillance | Opt-in, general coaching only, no raw-log access without explicit share (v1.1 concern, noted now). |
| Duty of care (self-harm/abuse/emergency content) | Surface resources; never counsel; never generate coercive scripts. |

## 9. Open questions

1. Which symptom taxonomy do we ship in F1 (curated shortlist vs. free-text + tags)? Lean curated
   shortlist + custom, to keep logging <5s and one-pager legible.
2. One-pager format: is a single US-Letter/A4 page enough, or do power users need a 2-page appendix?
3. Cycle context for users who no longer menstruate — what's the default context model (days-since,
   phase-agnostic)?
4. Paywall placement: gate export only, or gate script generation too, without killing the "armed" moment?
5. Employer script — how far can we go on workplace-accommodation language without straying into legal advice? (Hard rule: no legal advice.)
6. What's the minimum viable clinician disclaimer that satisfies duty-of-care without deflating the tone?
