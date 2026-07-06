import { OnePagerModel, symptomLabel } from '../domain/types';

// HTML template for expo-print. Single page, clinical-legible (the PDF is
// for a doctor's desk — print styling here is intentionally plain, unlike
// the app). Descriptive content only; the safety check runs before render.

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function onePagerHtml(model: OnePagerModel, displayName?: string): string {
  const range = `${model.rangeStart.slice(0, 10)} to ${model.rangeEnd.slice(0, 10)}`;
  const rows = model.summaries
    .map(
      (s) => `<tr>
        <td>${esc(s.label)}</td>
        <td class="num">${s.count}</td>
        <td class="num">${s.daysWithSymptom}</td>
        <td class="num">${s.avgSeverity.toFixed(1)}</td>
        <td class="num">${s.peakSeverity}</td>
      </tr>`
    )
    .join('');
  const notable = model.notableEntries
    .map(
      (l) =>
        `<li>${esc(l.loggedAt.slice(0, 10))} — ${esc(symptomLabel(l))}, severity ${l.severity}/4${
          l.context.note ? ` — “${esc(l.context.note)}”` : ''
        }</li>`
    )
    .join('');
  const questions = model.questionsForClinician.map((q) => `<li>${esc(q)}</li>`).join('');

  return `
  <style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 36px; font-size: 12px; }
    h1 { font-size: 18px; margin: 0 0 2px; }
    .meta { color: #555; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #ddd; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #555; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 14px 0 6px; }
    ul { margin: 0; padding-left: 16px; }
    li { margin-bottom: 3px; }
    .disclaimer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #999; color: #555; font-size: 10px; }
  </style>
  <h1>Symptom record${displayName ? ` — ${esc(displayName)}` : ''}</h1>
  <div class="meta">Self-reported log, ${esc(range)} · prepared ${esc(model.generatedAt.slice(0, 10))}</div>
  <table>
    <tr><th>Symptom</th><th class="num">Entries</th><th class="num">Days</th><th class="num">Avg severity (0–4)</th><th class="num">Peak</th></tr>
    ${rows}
  </table>
  ${notable ? `<h2>Notable entries</h2><ul>${notable}</ul>` : ''}
  ${questions ? `<h2>Questions for this visit</h2><ul>${questions}</ul>` : ''}
  <div class="disclaimer">${esc(model.disclaimer)}</div>`;
}
