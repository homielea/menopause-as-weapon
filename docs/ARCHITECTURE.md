# ARCHITECTURE — Receipts

*Codename `menopause-as-weapon`. How the app is built. Agents follow this exactly.*

## 1. Stack decisions

| Concern | Decision | Rationale |
| --- | --- | --- |
| App framework | **Expo SDK 56 + React Native** | Cross-platform, fast iteration, matches house default. |
| Language | **TypeScript, `strict: true`** | Domain logic (artifact generation) must be provably correct; no `any`. |
| Routing | **expo-router** | File-based routes; simple tab + stack IA. |
| State | **Zustand** | Minimal, testable stores; no boilerplate. |
| Persistence | **AsyncStorage** (via a repository layer) | Local-first; no account/cloud in MVP. All health data on-device. |
| PDF / one-pager | **expo-print** (HTML→PDF) + **expo-sharing** | The one-pager is the signature artifact; needs real, shareable output. Concept genuinely requires document generation — this is the sanctioned adaptation. |
| File handling | **expo-file-system** | Store/serve generated PDF for share sheet. |
| AI | **None in MVP.** Future: **Anthropic Claude via backend proxy** | Any AI runs server-side on **de-identified** data. **No API keys in the client, ever.** |
| Backend | **None in MVP** | Local-first satisfies privacy invariant and ships faster. |
| Analytics | **No third-party analytics on health content** | Privacy invariant. Any product analytics (future) is event-count only, no health payloads. |
| Testing | **Jest** (+ ts-jest) for domain logic | Pure functions must be unit-tested. |

### When (and only when) to add a backend

Add the Anthropic Claude backend proxy **only** for the v1.1 optional AI script-polish. Contract:
- Client sends **de-identified** script drafts (no name, no DOB, no free-text identifiers) to *our*
  proxy; the proxy holds the key and calls Claude. The client never holds a key.
- Deterministic templates remain the default and the offline fallback.
- No raw logs are sent; only the already-composed, de-identified draft the user chose to polish.

## 2. Target folder structure

```
menopause-as-weapon/
├─ app.json / app.config.ts        # Expo config
├─ package.json
├─ tsconfig.json                   # strict: true
├─ src/
│  ├─ app/                         # expo-router routes
│  │  ├─ _layout.tsx               # root: tabs (Log · Receipts · Artifacts)
│  │  ├─ index.tsx                 # Log (F1) — the one-tap capture home
│  │  ├─ receipts.tsx              # Receipts timeline (F4)
│  │  ├─ artifacts/
│  │  │  ├─ index.tsx              # artifact hub (one-pager + scripts)
│  │  │  ├─ one-pager.tsx          # F2 preview + export
│  │  │  └─ script/[audience].tsx  # F3 doctor|partner|employer
│  │  └─ onboarding/               # F5 first-run flow (own stack)
│  ├─ components/                  # presentational, tokenized (see DESIGN.md)
│  ├─ domain/                      # PURE, framework-free, unit-tested
│  │  ├─ types.ts                  # the data model (section 3)
│  │  ├─ logging.ts                # create/validate a SymptomLog
│  │  ├─ onePager.ts               # logs -> OnePagerModel (deterministic)
│  │  ├─ scripts.ts                # logs + audience -> Script (template-based)
│  │  ├─ timeline.ts               # logs -> grouped/filtered receipts
│  │  ├─ disclaimers.ts            # required clinician/duty-of-care text
│  │  └─ safety.ts                 # banned-content + duty-of-care checks
│  ├─ state/                       # Zustand stores (section 4)
│  │  ├─ logsStore.ts
│  │  ├─ settingsStore.ts
│  │  └─ onboardingStore.ts
│  ├─ data/                        # persistence adapters
│  │  └─ repository.ts             # AsyncStorage read/write, versioned
│  ├─ render/                      # HTML templates for expo-print
│  │  └─ onePagerHtml.ts
│  └─ theme/                       # tokens from DESIGN.md
│     └─ tokens.ts
├─ docs/                           # this package
└─ __tests__/                      # domain unit tests
```

**Layering rule:** `app/` and `components/` may import from `state/`, `domain/`, `theme/`.
`state/` imports `domain/` and `data/`. `domain/` imports **nothing** from React/Expo/`state`/`data`.
Persistence (`data/`) never contains business logic.

## 3. Data model — `src/domain/types.ts`

```ts
// src/domain/types.ts
// The credibility engine's contract. Pure types, no runtime deps.

/** ISO-8601 timestamp, e.g. "2026-07-05T14:32:00.000Z". */
export type ISODateTime = string;

/** Curated symptom taxonomy (shortlist keeps logging <5s and the one-pager legible). */
export type SymptomType =
  | 'hot_flash'
  | 'night_sweats'
  | 'sleep_disruption'
  | 'brain_fog'
  | 'mood_swing'
  | 'anxiety'
  | 'irritability'
  | 'fatigue'
  | 'joint_pain'
  | 'headache'
  | 'heart_palpitations'
  | 'low_libido'
  | 'vaginal_dryness'
  | 'irregular_bleeding'
  | 'other';

/** 0 = none, 4 = severe. Simple, thumb-friendly, legible in a one-pager. */
export type Severity = 0 | 1 | 2 | 3 | 4;

/** Optional context that makes a log "evidence" rather than a data point. */
export interface LogContext {
  /** Days since last period start, if known. Null for post-menopausal / unknown. */
  cycleDay: number | null;
  /** Free tags the user attaches: e.g. "at work", "woke me up", "during meeting". */
  tags: string[];
  /** Optional short note in her own words (never medically interpreted by the app). */
  note?: string;
  /** How much it interfered with life, her call. */
  impact?: 'none' | 'mild' | 'moderate' | 'high';
}

/** The atomic unit of leverage. One tap creates one of these. */
export interface SymptomLog {
  id: string;                 // uuid
  type: SymptomType;
  customLabel?: string;       // required iff type === 'other'
  severity: Severity;
  loggedAt: ISODateTime;      // when it happened / was captured
  createdAt: ISODateTime;     // record creation time
  context: LogContext;
}

/** Audiences a script can be generated for. */
export type ScriptAudience = 'doctor' | 'partner' | 'employer';

/** A generated, evidence-backed script — grounded ONLY in the user's own logs. */
export interface Script {
  id: string;
  audience: ScriptAudience;
  generatedAt: ISODateTime;
  /** Ordered lines the user can read aloud. Asks/questions — never diagnoses or demands. */
  lines: string[];
  /** IDs of the SymptomLogs this script is grounded in (traceability). */
  sourceLogIds: string[];
  /** Required disclaimer text appended to every script. */
  disclaimer: string;
}

/** Deterministic model the one-pager PDF renders from. Descriptive only. */
export interface OnePagerModel {
  generatedAt: ISODateTime;
  rangeStart: ISODateTime;
  rangeEnd: ISODateTime;
  /** Per-symptom aggregates over the range. No interpretation, just counts. */
  summaries: Array<{
    type: SymptomType;
    label: string;
    count: number;
    avgSeverity: number;      // rounded for display
    peakSeverity: Severity;
    daysWithSymptom: number;
  }>;
  /** Chronological highlights for the "receipts" strip. */
  notableEntries: SymptomLog[];
  /** Questions she wants to ask the clinician (from her tags/notes). */
  questionsForClinician: string[];
  disclaimer: string;         // clinician disclaimer, always present
}

/** Persisted app state shape (versioned for safe migrations). */
export interface PersistedState {
  schemaVersion: number;
  logs: SymptomLog[];
  settings: UserSettings;
  onboardingComplete: boolean;
}

export interface UserSettings {
  /** Display name used ONLY on the one-pager header; optional, local-only. */
  displayName?: string;
  /** Whether she still menstruates — drives cycleDay defaults. */
  menstruates: boolean;
  /** Preferred tone strength for scripts; both are validating+fierce, not clinical. */
  scriptTone: 'measured' | 'fierce';
}
```

**Model invariants (enforced in `domain/`):**
- A `Script` and an `OnePagerModel` may contain **only** facts derivable from `SymptomLog`s. No field
  may assert a diagnosis, cause, or treatment. `disclaimer` is always non-empty.
- `customLabel` is required when `type === 'other'`; disallowed otherwise.
- Every artifact carries `sourceLogIds` / a date range for traceability back to *her* data.

## 4. State-management contract (Zustand)

Three stores, each a thin wrapper over pure `domain/` functions + the `repository`. Components never
mutate persisted arrays directly; they call store actions.

```ts
// logsStore.ts
interface LogsStore {
  logs: SymptomLog[];
  hydrate(): Promise<void>;                 // load from repository on boot
  addLog(input: NewLogInput): void;         // validates via domain/logging, persists
  removeLog(id: string): void;
  // selectors (pure, memoized in components):
  //   timeline(filter)      -> domain/timeline
  //   buildOnePager(range)  -> domain/onePager  (returns OnePagerModel)
  //   buildScript(audience) -> domain/scripts   (returns Script)
}

// settingsStore.ts — UserSettings CRUD, persisted.
// onboardingStore.ts — first-run progress; sets onboardingComplete.
```

Contract rules:
1. **Single source of truth:** `logsStore.logs` is the only place logs live. Artifacts are *derived*,
   never separately stored (except an exported PDF file, which is disposable).
2. **Every mutation persists** through `repository` with the current `schemaVersion`; boot calls
   `hydrate()`; migrations live in `data/repository.ts`.
3. **Derivations are pure:** one-pager, scripts, and timeline are computed by `domain/` functions from
   `logs` — no side effects, fully unit-testable, deterministic given the same input.
4. **No health data in any store that syncs off-device** (there is none in MVP; this pre-commits the rule).

## 5. Conventions for agents

- **Strict TS, no `any`, no non-null-assertion abuse.** Prefer exhaustive `switch` over `SymptomType`.
- **Pure domain logic.** `domain/*` imports nothing from React/Expo/state/data. Every file in `domain/`
  has a matching test in `__tests__/`.
- **Every artifact path runs through `domain/disclaimers.ts` and `domain/safety.ts`** so the
  no-diagnosis + duty-of-care invariants are enforced in one place, not sprinkled in UI.
- **Tokens only** — colors/spacing/type come from `src/theme/tokens.ts` (see DESIGN.md). No hardcoded hex.
- **Copy passes the banned-words check** (DESIGN.md). Voice: validating and a little fierce.
- **Gate before done:** `npx tsc --noEmit` (zero errors) · `npm run lint` · `npm test`.
- **No secrets, ever.** No keys in code, config, or committed env files.
