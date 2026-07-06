# F5 — Onboarding: Armed in 2 Minutes

**Backlog:** T-501 · **Depends on:** T-101 (logging), T-301/T-302 (one-pager preview) · **Screen:** `src/app/onboarding/`

## User story

> As a dismissed woman opening this app for the first time, I want to feel *armed* almost immediately —
> not set up a profile — so that within two minutes I've logged something real and seen the proof I could
> put in front of a doctor.

## Why it matters

This is the product promise made literal: a dismissed woman should feel armed within 2 minutes. Onboarding
must lead with the **artifact**, not the chart or a settings form. It sets the validating-and-fierce tone
and lands her in the core loop having already tasted leverage.

## Flow

1. **Punchline open:** a `type.display` line that names the wound and takes her side ("You're not crazy.
   You have receipts now.").
2. **Minimal setup (fast):** does she still menstruate? optional first name (local-only, for the one-pager
   header). No account, no email, no cloud.
3. **First log:** guided single log using the real F1 controls (`LogButton` → symptom → severity).
4. **The payoff:** immediately show a **live artifact preview** built from that one log — a mini one-pager
   snippet or a scripted line — so she *sees* the leverage her tap just created.
5. **Land in the loop:** finish → Log screen, ready to capture, `onboardingComplete = true`.

## Acceptance criteria

- [ ] First run runs before the main tabs; sets `settings.menstruates` and optional `displayName`.
- [ ] The flow captures at least one real `SymptomLog` using the F1 controls.
- [ ] The user sees a **live artifact preview generated from her own log** before onboarding ends.
- [ ] Median completion path is < 2 minutes; step count is minimal (no unnecessary screens).
- [ ] No account, email, cloud, or permission wall required to complete.
- [ ] Skippable — but skipping still lands on the Log screen ready to capture and sets `onboardingComplete`.
- [ ] Copy is validating and a little fierce; passes the banned-words check; never clinical or pastel.
- [ ] No diagnostic question is ever asked during onboarding.

## Notes for later

- A/B the punchline and which artifact (one-pager snippet vs. script line) creates the strongest "armed" moment.
- Optional: seed one example receipt to make the timeline feel alive, clearly labeled as an example and removable.
- Tie the closing beat to the F3 partner script as a teaser for the v1.1 companion app.
