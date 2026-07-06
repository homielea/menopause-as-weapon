import { LogContext, Severity, SymptomLog, SymptomType } from './types';

// Create/validate a SymptomLog. Pure. The model invariant lives here:
// customLabel is required iff type === 'other'.

export interface NewLogInput {
  type: SymptomType;
  customLabel?: string;
  severity: Severity;
  loggedAt?: string;
  context?: Partial<LogContext>;
}

export function validateLogInput(input: NewLogInput): string[] {
  const problems: string[] = [];
  if (input.type === 'other' && !input.customLabel?.trim()) {
    problems.push('A name is needed for a custom symptom.');
  }
  if (input.type !== 'other' && input.customLabel) {
    problems.push('customLabel is only allowed for type "other".');
  }
  if (input.severity < 0 || input.severity > 4) {
    problems.push('Severity must be 0–4.');
  }
  return problems;
}

export function createLog(input: NewLogInput, id: string, now: string): SymptomLog {
  const problems = validateLogInput(input);
  if (problems.length > 0) throw new Error(problems.join(' '));
  return {
    id,
    type: input.type,
    customLabel: input.type === 'other' ? input.customLabel?.trim() : undefined,
    severity: input.severity,
    loggedAt: input.loggedAt ?? now,
    createdAt: now,
    context: {
      cycleDay: input.context?.cycleDay ?? null,
      tags: input.context?.tags ?? [],
      note: input.context?.note?.trim() || undefined,
      impact: input.context?.impact,
    },
  };
}
