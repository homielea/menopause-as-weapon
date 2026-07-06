# F3 — Conversation Scripts (Doctor / Partner / Employer)

**Backlog:** T-401 (domain), T-402 (UI) · **Depends on:** T-101 · **Screen:** `src/app/artifacts/script/[audience].tsx`

## User story

> As a woman who freezes or gets talked over in the hard conversations, I want ready-to-say lines —
> grounded in my own logged evidence — for my doctor, my partner, and my employer, so I walk in with
> exactly what to say and can't be dismissed or derailed.

## Why it matters

Data alone doesn't change a conversation — *words* do. F3 turns her receipts into confident, evidence-backed
asks. It is leverage as language. The hard constraint: scripts are **collaborative asks and questions,
never diagnoses, never demands, never coercion, never legal advice.**

## Flow

1. From Artifacts hub, tap **Scripts** → choose audience: doctor / partner / employer.
2. `domain/scripts.ts` generates a `Script` grounded in her recent logs (`sourceLogIds` recorded).
3. `ScriptSheet` shows the script line-by-line, easy to read aloud.
4. Tone toggle: `measured` ↔ `fierce` (both validating; changes wording, never adds medical claims).
5. Copy to clipboard or share; disclaimer footer always shown.

## Audience framing

- **Doctor:** confident asks + questions ("Here's what I've logged over 6 weeks. I'd like you to note
  these symptoms in my chart and discuss options with me."). No self-diagnosis, no naming a treatment.
- **Partner:** "here's what's happening and what I need from you" — collaborative, never accusatory or coercive.
- **Employer:** requests around impact/accommodation in plain language — **no legal advice, no threats.**

## Acceptance criteria

- [ ] `domain/scripts.ts` generates a `Script` for each of the three audiences from her logs; pure + unit-tested.
- [ ] Every script's `lines` are asks/questions grounded in logged data; `sourceLogIds` is populated.
- [ ] Scripts contain **no diagnosis, no treatment/medication/HRT recommendation, no legal advice, no
      coercive/threatening language** — enforced by `domain/safety.ts` and covered by tests.
- [ ] Tone toggle (`measured`/`fierce`) changes wording only; never introduces a medical claim.
- [ ] Disclaimer footer present on every script.
- [ ] Copy-to-clipboard and share both work.
- [ ] With zero logs, the sheet shows a fierce/validating prompt to log first (no empty/generic script).
- [ ] All copy passes the banned-words check.

## Notes for later

- v1.1: optional AI polish via the **Anthropic Claude backend proxy** on **de-identified** drafts only —
  deterministic templates remain the default/offline fallback; no client keys.
- Partner script becomes the bridge to the partner companion app (v1.1).
- Employer language boundary (accommodation vs. legal advice) is an open PRD question — stay descriptive.
