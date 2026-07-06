// Banned-content + duty-of-care checks. The artifact safety check is a HARD
// RULE enforcement: no generated artifact may contain diagnostic or
// treatment language. Runs over every one-pager and script before render.

const DIAGNOSTIC_PATTERNS: RegExp[] = [
  /\byou have [a-z]/i,
  /\bthis means you have\b/i,
  /\bdiagnos/i,
  /\byou should take\b/i,
  /\bwe recommend\b/i,
  /\b(take|start|increase|decrease)\s+\d+\s?(mg|mcg|ml)\b/i,
  /\bHRT\b/,
  /\bestrogen (dose|therapy|patch)\b/i,
  /\byour levels indicate\b/i,
  /\btreat your\b/i,
];

export function findDiagnosticLanguage(text: string): string[] {
  return DIAGNOSTIC_PATTERNS.filter((re) => re.test(text)).map((re) => String(re));
}

export function assertArtifactSafe(texts: string[]): void {
  const hits = texts.flatMap((t) => findDiagnosticLanguage(t));
  if (hits.length > 0) {
    throw new Error(`Artifact failed safety check (diagnostic/treatment language): ${hits.join(', ')}`);
  }
}

// Duty-of-care: notes that suggest self-harm or abuse surface resources.
const DUTY_PATTERNS: RegExp[] = [
  /\b(hurt|hurting|harm|harming|kill|killing)\s+(myself|me)\b/i,
  /\b(end|ending)\s+it\s+all\b/i,
  /\bsuicid/i,
  /\bself[- ]harm/i,
  /\b(hits?|hurting|beats?)\s+me\b/i,
  /\bafraid\s+of\s+(him|her|them)\b/i,
];

export function needsDutyOfCare(text: string): boolean {
  return DUTY_PATTERNS.some((re) => re.test(text));
}
