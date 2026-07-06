# AGENTS.md — Build-Agent Operating Manual for Receipts

You are a build agent implementing **Receipts** (codename `menopause-as-weapon`), a femtech app whose
thesis is: *menopause's deepest harm is not being believed.* Your job is to build the **credibility
engine** — one-tap logs become doctor-ready artifacts and leverage. Read this file fully before writing code.

## Read these first (in order)

1. `README.md` — the product in one page: wedge, positioning, MVP.
2. `docs/PRD.md` — user, principles, scope, what is explicitly out of scope.
3. `docs/ARCHITECTURE.md` — stack, folder structure, `types.ts` data model, state contract, conventions.
4. `docs/DESIGN.md` — visual tokens, components, voice & the BANNED-words list.
5. `docs/BACKLOG.md` — pick the lowest-numbered unblocked ticket.
6. The `docs/specs/F*.md` spec referenced by your ticket.

## HARD RULES (invariants — never violate, no ticket may override)

These are not preferences. A change that breaks one of these is wrong even if it "works."

1. **NEVER DIAGNOSE OR ADVISE TREATMENT.** The app organizes *the user's own reported data* and
   prepares her to talk to clinicians. It must never diagnose, suggest a condition, interpret lab
   results, recommend medication/dosage/HRT, or tell her what a symptom "means" medically. When in
   doubt, present *her data* and route her *to a clinician*. Any generated artifact (one-pager,
   script) states only what she logged, framed as questions/asks — never medical conclusions.
2. **THE CREDIBILITY ENGINE IS THE PRODUCT.** Every logged symptom must be convertible into a
   leverage artifact (one-pager, script, or receipt). Do not build a feature that captures data
   with no path to an artifact. If a change makes the app feel like a passive tracker, it is wrong.
   Protect the "log → artifact" pipeline as the core invariant.
3. **LOCAL-FIRST PRIVACY.** MVP stores all health and relationship data on-device (AsyncStorage).
   No account, no cloud sync, no third-party analytics library touches health content. Data leaves
   the device only through a **user-initiated, explicit** share/export action.
4. **NO SECRETS IN THE CLIENT.** Never commit or bundle API keys, tokens, or credentials. If/when
   AI is added, it goes through an **Anthropic Claude backend proxy** (see ARCHITECTURE) and only
   ever receives **de-identified** data. No AI feature ships in MVP.
5. **DUTY OF CARE.** If content could touch self-harm, abuse, or acute medical emergency, the app
   surfaces appropriate resources and does not attempt to counsel. Scripts for a partner/employer
   are collaborative asks, never coercion, threats, or legal advice.
6. **VOICE IS VALIDATING AND A LITTLE FIERCE — never clinical, never pastel.** Respect the
   BANNED-words list in `docs/DESIGN.md`. Copy affirms she is believed; it never scolds, never
   infantilizes, never hedges her reality.
7. **STRICT TYPESCRIPT, PURE DOMAIN LOGIC.** `strict: true`. No `any`. Domain logic (artifact
   generation, timeline aggregation) is pure and unit-tested, independent of React/Expo.

## Per-ticket workflow

1. **Claim** the lowest-numbered unblocked ticket in `docs/BACKLOG.md`; confirm its milestone deps are done.
2. **Read** the linked `docs/specs/F*.md` and re-read the HARD RULES above.
3. **Plan** against the acceptance criteria. If a criterion conflicts with a HARD RULE, the HARD RULE
   wins — stop and flag it rather than shipping a violation.
4. **Implement** the smallest change that satisfies the ticket. Keep domain logic in `src/domain/`,
   pure and typed. UI in `src/app/` (expo-router) and `src/components/`.
5. **Self-check** against every acceptance-criteria checkbox and the global Definition of Done.
6. **Run the gates** (below). All must pass.
7. **Report** what you built, which acceptance criteria are met, and any HARD-RULE tension you noticed.

## Run commands

```bash
npm install
npx expo start          # dev server (Expo Go / simulator)

# gates — ALL must pass before a ticket is "done"
npx tsc --noEmit        # zero type errors, strict mode
npm run lint            # zero eslint errors
npm test                # domain unit tests green
```

## Definition of Done (see BACKLOG for the full list)

A ticket is done only when: acceptance criteria all met · `tsc --noEmit` clean · lint clean · domain
logic unit-tested · no HARD RULE violated · copy passes the banned-words check · no secrets added.
