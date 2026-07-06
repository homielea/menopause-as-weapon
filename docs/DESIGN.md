# DESIGN — Receipts

*Codename `menopause-as-weapon`. The look, the components, and the voice. **Never clinical, never pastel.***

## 1. Design principle

The app should feel like an ally who believes her and hands her a weapon — **not** a wellness spa and
**not** a hospital intake form. Confident, dark, high-contrast, a little fierce. The artifact (one-pager,
script, receipt) is always the hero; charts are supporting cast at most.

## 2. Color tokens

Dark-first. Ink background, warm-but-serious accent (not pink, not lavender). Define in
`src/theme/tokens.ts`.

| Token | Value | Use |
| --- | --- | --- |
| `color.bg` | `#141217` | App background (near-black, warm) |
| `color.surface` | `#1F1B24` | Cards, sheets |
| `color.surfaceRaised` | `#2A2530` | Raised inputs, the log button well |
| `color.ink` | `#F6F1EA` | Primary text (warm off-white) |
| `color.inkMuted` | `#B7ADB9` | Secondary text |
| `color.accent` | `#E4572E` | Primary action / "arm me" — a fierce ember-orange |
| `color.accentPressed` | `#C0421F` | Pressed state |
| `color.signal` | `#F2C14E` | Highlights, "receipt" markers |
| `color.believe` | `#5AA9A3` | Affirmation / validating moments (a grounded teal, never pastel) |
| `color.severity0..4` | `#4A4550 · #7A6E58 · #C9863E · #E4572E · #B01E3A` | Severity scale (calm→intense) |
| `color.line` | `#332C3A` | Dividers, borders |
| `color.danger` | `#B01E3A` | Destructive |

**Banned in the palette:** pastel pink, lavender, baby blue, mint — anything that reads "feminine
wellness." If a color feels like a spa, it's wrong.

## 3. Type scale

Strong, editorial. A humanist sans for UI; a slightly condensed/heavier face for the fierce headlines is
encouraged (system fallback fine for MVP).

| Token | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| `type.display` | 34 / 38 | 800 | Onboarding punchlines ("You're not crazy.") |
| `type.h1` | 26 / 32 | 700 | Screen titles |
| `type.h2` | 20 / 26 | 700 | Section headers |
| `type.body` | 16 / 24 | 400 | Body copy |
| `type.bodyStrong` | 16 / 24 | 600 | Emphasis in body |
| `type.label` | 13 / 16 | 600 | Tags, meta, timestamps (uppercase, tracked) |
| `type.mono` | 14 / 20 | 500 | One-pager data, counts |

## 4. Spacing & radius

- Spacing scale (px): `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48`.
- Radius: `sm 8 · md 12 · lg 16 · pill 999`.
- Touch targets ≥ 48×48. The one-tap log control is oversized and thumb-reachable.

## 5. Components to build

| Component | Purpose | Notes |
| --- | --- | --- |
| `LogButton` | The oversized one-tap capture control (F1) | Ember accent; sub-5s to a saved log. |
| `SeverityDial` | Pick 0–4 severity fast | Uses `color.severity*`; big targets. |
| `ContextChips` | Toggle tags / cycle context | Multi-select pills. |
| `ReceiptCard` | One entry in the receipts timeline (F4) | Timestamp label, severity marker, tags, note. |
| `TimelineGroup` | Day/week grouping header | Sticky, `type.label`. |
| `ArtifactHero` | Big "here's your leverage" card | Links to one-pager / scripts. |
| `OnePagerPreview` | On-screen preview of the PDF model (F2) | Mirrors print layout; export button. |
| `ScriptSheet` | Read-aloud script view (F3) | Line-by-line; audience switcher; disclaimer footer. |
| `DisclaimerFooter` | Required clinician/duty-of-care text | Present on every artifact; small but never omitted. |
| `AffirmationBanner` | Validating micro-moment | `color.believe`; used sparingly, never saccharine. |
| `PrimaryButton` / `GhostButton` | Actions | Ember primary; ghost for secondary. |

## 6. Voice & copy rules

**Voice:** validating and a little fierce. She is believed. We are on her side, handing her evidence.
Confident, plain, occasionally sharp. Short sentences. No hedging her reality.

**Do:**
- Affirm first: "You logged it. It's real. Here's the proof."
- Name the leverage: "Put this on the desk." / "Here's exactly what to say."
- Be plain and direct; a little swagger is fine.
- Frame scripts as confident asks: "I need you to run these labs and note my symptoms in my chart."

**Don't:**
- Diagnose, interpret, or advise treatment (hard rule — copy included).
- Scold, infantilize, or over-apologize.
- Go clinical ("Please consult your provider regarding your symptomatology") or pastel ("Embrace your
  beautiful transition, lovely!").
- Attack the doctor/partner/employer. Leverage = credibility, not aggression.

### BANNED words / phrases

Reject copy (and fail the banned-words check) if it contains, in the product's voice:

- **Pastel-wellness:** `journey`, `self-care`, `pamper`, `glow`, `radiant`, `blossom`, `embrace your
  change`, `beautiful transition`, `goddess`, `thrive`, `wellness warrior`, `me-time`, `lovely`,
  `sprinkle`, `magic`, emoji-flowers/sparkles.
- **Infantilizing:** `sweetie`, `hun`, `don't worry your head`, `just relax`, `calm down`.
- **Diagnostic / treatment (hard-rule violations in app copy):** `you have [condition]`, `this means you
  have`, `diagnosis`, `you should take`, `we recommend [drug/HRT/dose]`, `your levels indicate`,
  `treat your`, medical verdicts of any kind.
- **Reality-denying:** `it's all in your head`, `overreacting`, `hormonal` (as a dismissal), `hysteria`
  — except when *quoting the dismissal the app is arming her against* (e.g. the receipts tagline
  "answer *you're overreacting* with data"), which is allowed and intentional.

Allowed intentional edge: the **product framing** may quote dismissive phrases to *rebut* them. The
banned check applies to Receipts speaking *to* the user, not to labeled quotes of what others say.
