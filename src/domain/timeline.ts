import { SymptomLog, SymptomType } from './types';

// logs -> grouped/filtered receipts. Pure.

export interface DayGroup {
  day: string; // YYYY-MM-DD
  logs: SymptomLog[];
}

export function groupByDay(logs: SymptomLog[], filter?: SymptomType | null): DayGroup[] {
  const filtered = filter ? logs.filter((l) => l.type === filter) : logs;
  const byDay = new Map<string, SymptomLog[]>();
  for (const log of filtered) {
    const day = log.loggedAt.slice(0, 10);
    const list = byDay.get(day);
    if (list) list.push(log);
    else byDay.set(day, [log]);
  }
  return [...byDay.entries()]
    .map(([day, dayLogs]) => ({
      day,
      logs: dayLogs.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    }))
    .sort((a, b) => b.day.localeCompare(a.day));
}
