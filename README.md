# Receipts

> **One-liner:** A menopause app that stops tracking symptoms and starts arming women — turning dismissed complaints into evidence, scripts, and leverage against the doctors, bosses, and partners who don't believe them.

**Codename:** `menopause-as-weapon` · **Category:** Femtech (menopause & perimenopause) · **Working product name:** Receipts

---

## The insight (the wedge)

The #1 unspoken menopause wound isn't physiological — it's **epistemic**: being told your reality isn't real. Every femtech app is a symptom diary that produces a chart and a feeling of being "managed." Nobody sells women **leverage**.

**Receipts converts *gaslit* into *documented*.** Same one-tap logging as everyone else — but the output is not a pretty chart, it's an artifact you can put on a doctor's desk, read to your boss, or hand your partner.

## Positioning

| | Symptom trackers (incumbents) | Receipts |
| --- | --- | --- |
| Data model | Passive diary → chart | Evidence → leverage |
| Output | "Here's how you feel" | "Here's your one-pager, here's your script" |
| Emotional job | Feel managed | Feel armed |
| Voice | Clinical / pastel | Validating and a little fierce |
| Customers | Her | Her **and** her partner (fast-follow) |

**Category claim:** Whoever arms women instead of visualizing their decline owns the category.

## Target user

Women in their 40s–50s whose symptoms are dismissed by doctors ("you're fine"), misread by partners, or penalized at work. Motivated, underserved, and furious about not being believed.

**Anti-persona:** the calm, well-supported user who wants a gentle wellness journal and already has a great menopause specialist. She is not who we build for; chasing her dilutes the wedge.

## MVP (v1.0)

1. **One-tap symptom + context logging** — timestamp + cycle context, sub-5-second capture.
2. **Clinical one-pager** — auto-generated, doctor-ready PDF/share summary of her own reported data.
3. **Conversation scripts** — evidence-backed scripts for doctor / partner / employer.
4. **Receipts timeline** — the "you're overreacting" rebuttal, in data.
5. **Onboarding that arms her in 2 minutes** — first log + first artifact preview before she's done.

**Fast-follow (v1.1):** bundled **partner companion app** that quietly coaches the husband/partner ("she's not mad at you, here's what's happening, here's what NOT to say this week").

## Monetization

- **Consumer subscription** (primary). Free capture + timeline; paywall the artifacts (one-pager export, script generation) after a trial that always lets her feel the "armed" moment once.
- **B2B / employers** — menopause is a top workplace-attrition driver; sell as a retention/benefit.
- **Clinics** — the pre-visit one-pager saves appointment time; licensing / referral surface.

## Go-to-market

- Lead with the **wedge emotion**, not features: "You're not crazy. You have receipts." Short vertical video of the doctor-desk moment.
- Seed in menopause/perimenopause communities where the "I wasn't believed" story already lives.
- The partner companion is the referral engine: one household, two installs.

## Top risks

| Risk | Mitigation |
| --- | --- |
| **Medical-claim / liability surface** | Hard invariant: the app organizes *her own reported data* and prepares her to talk to clinicians. It **never diagnoses, never advises treatment, never interprets results.** See `docs/ARCHITECTURE.md` invariants. |
| Privacy of intimate health + relationship data | Local-first storage; no account or cloud required for MVP; no third-party analytics on health content; export is user-initiated and explicit. |
| "Weaponized" framing reads as anti-doctor / anti-partner | Voice is *validating and fierce*, aimed at being **believed**, not at attacking. Scripts are collaborative asks, not accusations. |
| Partner app feels like surveillance | Partner app is opt-in, coaches the partner with general guidance only — it never exposes her raw logs without her explicit share. |

## Tech stack (summary)

Expo SDK 56 · React Native · TypeScript (strict) · expo-router · Zustand · AsyncStorage · expo-print + expo-sharing (PDF/one-pager) · **local-first, no backend in MVP.** Any future AI (script polish) runs through an **Anthropic Claude backend proxy** on **de-identified** data — **no API keys ever ship in the client.** Full rationale in `docs/ARCHITECTURE.md`.

## Run instructions

```bash
# prerequisites: Node 20+, npm, Expo Go app on a device (or an iOS/Android simulator)
npm install
npx expo start          # opens the dev server; scan the QR with Expo Go

# quality gates (agents MUST pass these before marking a ticket done)
npx tsc --noEmit        # strict TypeScript, zero errors
npm run lint            # eslint
npm test                # unit tests for domain logic
```

## Documentation map

| Doc | What it's for |
| --- | --- |
| `AGENTS.md` | Build-agent operating manual + hard rules/invariants |
| `docs/PRD.md` | Problem, user, principles, scope, metrics, risks |
| `docs/ARCHITECTURE.md` | Stack, folder structure, data model, state contract |
| `docs/DESIGN.md` | Visual system, components, voice & banned words |
| `docs/BACKLOG.md` | Ordered, agent-sized tickets + definition of done |
| `docs/specs/F*.md` | One spec per MVP feature |

## End-to-end verification

The browser journey that verified this app during development is committed,
not ephemeral. With the app running on web:

```bash
npx expo start --web --port 8097   # terminal 1
npm run e2e                          # terminal 2
```

`e2e/verify.mjs` drives the full first-run journey in a real browser and
asserts the product's promises, not just that screens render. `PORT`
overrides the port; `PW_CHROMIUM` points at a chromium binary when
playwright's own download isn't available.
