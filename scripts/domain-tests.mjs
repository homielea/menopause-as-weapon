// npm test — compiles src/domain with tsc and runs node-based assertions.
// Domain logic is pure, so no React/Expo harness is needed.

import { execSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const out = mkdtempSync(join(tmpdir(), 'receipts-domain-'));
execSync(
  `npx tsc src/domain/*.ts --ignoreConfig --outDir ${out} --module commonjs --target es2020 --moduleResolution bundler --skipLibCheck`,
  { stdio: 'inherit' }
);

const { createLog, validateLogInput } = await import(join(out, 'logging.js'));
const { buildOnePager } = await import(join(out, 'onePager.js'));
const { buildScript } = await import(join(out, 'scripts.js'));
const { assertArtifactSafe, findDiagnosticLanguage, needsDutyOfCare } = await import(join(out, 'safety.js'));
const { groupByDay } = await import(join(out, 'timeline.js'));

const NOW = '2026-07-06T12:00:00.000Z';
const mk = (type, severity, loggedAt, extra = {}) =>
  createLog({ type, severity, loggedAt, ...extra }, `id-${type}-${loggedAt}`, NOW);

// logging invariants
assert.deepEqual(validateLogInput({ type: 'other', severity: 2 }).length, 1, 'other requires customLabel');
assert.deepEqual(validateLogInput({ type: 'hot_flash', severity: 2, customLabel: 'x' }).length, 1, 'customLabel only for other');
assert.equal(mk('other', 2, NOW, { customLabel: 'ear ringing' }).customLabel, 'ear ringing');

// one-pager: descriptive aggregates + disclaimer always present
const logs = [
  mk('hot_flash', 3, '2026-07-01T08:00:00.000Z'),
  mk('hot_flash', 4, '2026-07-02T09:00:00.000Z'),
  mk('brain_fog', 2, '2026-07-02T14:00:00.000Z', { context: { note: 'Could this connect to my sleep?' } }),
];
const op = buildOnePager(logs, '2026-06-30T00:00:00.000Z', '2026-07-05T00:00:00.000Z', NOW);
assert.equal(op.summaries[0].label, 'Hot flash');
assert.equal(op.summaries[0].count, 2);
assert.equal(op.summaries[0].peakSeverity, 4);
assert.equal(op.summaries[0].daysWithSymptom, 2);
assert.equal(op.questionsForClinician.length, 1, 'note ending in ? becomes a clinician question');
assert.ok(op.disclaimer.length > 0, 'disclaimer always present');

// scripts: grounded, disclaimed, and SAFE for every audience x tone
for (const audience of ['doctor', 'partner', 'employer']) {
  for (const tone of ['measured', 'fierce']) {
    const s = buildScript(logs, audience, tone, 'sid', NOW);
    assert.ok(s.lines.length >= 4, `${audience}/${tone} has lines`);
    assert.equal(s.sourceLogIds.length, logs.length, 'traceable to source logs');
    assert.ok(s.disclaimer.length > 0);
    assertArtifactSafe([...s.lines, s.disclaimer]); // throws on diagnostic language
  }
}
assertArtifactSafe([op.disclaimer, ...op.summaries.map((s) => s.label)]);

// safety checker actually catches violations
assert.ok(findDiagnosticLanguage('we recommend estrogen therapy at 2 mg').length >= 2);
assert.throws(() => assertArtifactSafe(['you have perimenopause']));

// duty of care
assert.equal(needsDutyOfCare('he hits me when it gets bad'), true);
assert.equal(needsDutyOfCare('rough night, three flashes'), false);

// timeline grouping
const groups = groupByDay(logs);
assert.equal(groups.length, 2);
assert.equal(groups[0].day, '2026-07-02');

console.log('DOMAIN TESTS OK');
