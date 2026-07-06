import { CLINICIAN_DISCLAIMER } from './disclaimers';
import {
  OnePagerModel,
  Severity,
  SymptomLog,
  SymptomType,
  symptomLabel,
} from './types';

// logs -> OnePagerModel. Deterministic and descriptive only: counts,
// averages, peaks, dates. No field interprets, diagnoses, or recommends.

export function buildOnePager(
  logs: SymptomLog[],
  rangeStart: string,
  rangeEnd: string,
  generatedAt: string
): OnePagerModel {
  const inRange = logs.filter((l) => l.loggedAt >= rangeStart && l.loggedAt <= rangeEnd);

  const byType = new Map<string, SymptomLog[]>();
  for (const log of inRange) {
    const key = log.type === 'other' ? `other:${log.customLabel ?? ''}` : log.type;
    const list = byType.get(key);
    if (list) list.push(log);
    else byType.set(key, [log]);
  }

  const summaries = [...byType.values()]
    .map((group) => {
      const severities: number[] = group.map((g) => g.severity);
      const days = new Set(group.map((g) => g.loggedAt.slice(0, 10)));
      return {
        type: group[0].type as SymptomType,
        label: symptomLabel(group[0]),
        count: group.length,
        avgSeverity: Math.round((severities.reduce((a, b) => a + b, 0) / group.length) * 10) / 10,
        peakSeverity: Math.max(...severities) as Severity,
        daysWithSymptom: days.size,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Notable: highest severity first, then most recent; capped for legibility.
  const notableEntries = [...inRange]
    .sort((a, b) => b.severity - a.severity || b.loggedAt.localeCompare(a.loggedAt))
    .slice(0, 6);

  // Her notes phrased as questions become the clinician question list.
  const questionsForClinician = [
    ...new Set(
      inRange
        .map((l) => l.context.note)
        .filter((n): n is string => !!n && n.trim().endsWith('?'))
    ),
  ].slice(0, 5);

  return {
    generatedAt,
    rangeStart,
    rangeEnd,
    summaries,
    notableEntries,
    questionsForClinician,
    disclaimer: CLINICIAN_DISCLAIMER,
  };
}
