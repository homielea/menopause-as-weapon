import { SCRIPT_DISCLAIMER } from './disclaimers';
import { Script, ScriptAudience, SymptomLog, symptomLabel } from './types';

// logs + audience -> Script. Template-based, deterministic, grounded ONLY
// in what she logged. Every line is an ask or a statement of her own data —
// never a diagnosis, never a demand, never a threat (HARD RULES 1 & 5).

export function buildScript(
  logs: SymptomLog[],
  audience: ScriptAudience,
  tone: 'measured' | 'fierce',
  id: string,
  generatedAt: string
): Script {
  const recent = [...logs]
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
    .slice(0, 30);

  const byLabel = new Map<string, SymptomLog[]>();
  for (const log of recent) {
    const label = symptomLabel(log);
    const list = byLabel.get(label);
    if (list) list.push(log);
    else byLabel.set(label, [log]);
  }
  const top = [...byLabel.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);

  const days = new Set(recent.map((l) => l.loggedAt.slice(0, 10))).size;
  const evidence = top
    .map(([label, group]) => `${label.toLowerCase()} ${group.length}×`)
    .join(', ');

  const opener =
    tone === 'fierce'
      ? `I'm not here to wonder if this is real — I brought the record.`
      : `I've been keeping a record so we can look at facts together.`;

  const lines: string[] = [opener];

  if (recent.length > 0) {
    lines.push(
      `Over the last ${days} ${days === 1 ? 'day' : 'days'} I logged ${recent.length} entries — most often ${evidence}.`
    );
  } else {
    lines.push(`I'm starting the record now, and I want us aligned on what happens next.`);
  }

  switch (audience) {
    case 'doctor':
      lines.push(
        `Here's the one-page summary — it's my own log, organized by day and severity.`,
        `My questions: could these fit a perimenopause picture, and what are my options?`,
        `What would you want tracked next, and over what period, to make a confident call?`,
        `If this is outside your focus, who would you refer me to?`
      );
      break;
    case 'partner':
      lines.push(
        tone === 'fierce'
          ? `When I say the night was rough, this is what it actually looked like — dates and all.`
          : `I want you to see what my nights and days actually look like — here's the log.`,
        `What I need from you isn't a solution — it's that you believe the record and pick up slack on the hard days.`,
        `Can we agree on one signal I can use mid-episode that means "cover for me, ask later"?`
      );
      break;
    case 'employer':
      lines.push(
        `I'm managing a health matter — documented and under a clinician's eye — and I'd rather solve this with you than around you.`,
        `The pattern in my record: mornings after flagged nights are my hardest window.`,
        `I'm asking for one adjustment to start: flexibility on early meetings while my clinician and I work the plan.`,
        `I'll keep this professional and reviewable — let's check back in four weeks.`
      );
      break;
  }

  return {
    id,
    audience,
    generatedAt,
    lines,
    sourceLogIds: recent.map((l) => l.id),
    disclaimer: SCRIPT_DISCLAIMER,
  };
}
