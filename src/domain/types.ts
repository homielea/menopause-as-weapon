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
  id: string; // uuid
  type: SymptomType;
  customLabel?: string; // required iff type === 'other'
  severity: Severity;
  loggedAt: ISODateTime; // when it happened / was captured
  createdAt: ISODateTime; // record creation time
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
    avgSeverity: number; // rounded for display
    peakSeverity: Severity;
    daysWithSymptom: number;
  }>;
  /** Chronological highlights for the "receipts" strip. */
  notableEntries: SymptomLog[];
  /** Questions she wants to ask the clinician (from her tags/notes). */
  questionsForClinician: string[];
  disclaimer: string; // clinician disclaimer, always present
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

export const SYMPTOM_LABELS: Record<SymptomType, string> = {
  hot_flash: 'Hot flash',
  night_sweats: 'Night sweats',
  sleep_disruption: 'Sleep disruption',
  brain_fog: 'Brain fog',
  mood_swing: 'Mood swing',
  anxiety: 'Anxiety',
  irritability: 'Irritability',
  fatigue: 'Fatigue',
  joint_pain: 'Joint pain',
  headache: 'Headache',
  heart_palpitations: 'Heart palpitations',
  low_libido: 'Low libido',
  vaginal_dryness: 'Vaginal dryness',
  irregular_bleeding: 'Irregular bleeding',
  other: 'Something else',
};

export function symptomLabel(log: Pick<SymptomLog, 'type' | 'customLabel'>): string {
  return log.type === 'other' && log.customLabel ? log.customLabel : SYMPTOM_LABELS[log.type];
}
