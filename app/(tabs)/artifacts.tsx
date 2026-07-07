import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Body,
  Caption,
  DisclaimerFooter,
  GhostButton,
  Panel,
  PrimaryButton,
  Screen,
} from '../../src/components/ui';
import { buildOnePager } from '../../src/domain/onePager';
import { buildScript } from '../../src/domain/scripts';
import { assertArtifactSafe } from '../../src/domain/safety';
import { ScriptAudience, symptomLabel } from '../../src/domain/types';
import { onePagerHtml } from '../../src/render/onePagerHtml';
import { useAppStore } from '../../src/state/store';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

// F2 + F3 — the artifacts. Every log becomes leverage here: the doctor-desk
// one-pager and the read-aloud scripts. The safety check runs over every
// artifact before it renders or leaves the device (HARD RULES 1–3).

const RANGE_DAYS = 30;

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Artifacts() {
  const logs = useAppStore((s) => s.logs);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const [audience, setAudience] = useState<ScriptAudience>('doctor');
  const [exportNote, setExportNote] = useState<string | null>(null);

  const onePager = useMemo(() => {
    const end = new Date();
    const start = new Date(end.getTime() - RANGE_DAYS * 86_400_000);
    const model = buildOnePager(logs, start.toISOString(), end.toISOString(), new Date().toISOString());
    assertArtifactSafe([model.disclaimer, ...model.summaries.map((s) => s.label)]);
    return model;
  }, [logs]);

  const script = useMemo(() => {
    const s = buildScript(logs, audience, settings.scriptTone, newId(), new Date().toISOString());
    assertArtifactSafe([...s.lines, s.disclaimer]);
    return s;
  }, [logs, audience, settings.scriptTone]);

  const exportPdf = async () => {
    // Data leaves the device only through this explicit action (HARD RULE 3).
    try {
      const html = onePagerHtml(onePager, settings.displayName);
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
        setExportNote('Shared. What happens to it next is your call.');
      } else {
        setExportNote('PDF prepared. On this platform, use the browser print dialog to save it.');
      }
    } catch {
      setExportNote('Export hit a snag — the record is untouched. Try again.');
    }
  };

  if (logs.length === 0) {
    return (
      <Screen>
        <Text style={[type.display, styles.h]}>Nothing to arm yet.</Text>
        <Body soft>
          Artifacts are built from your log — the one-pager for the doctor's desk,
          the scripts for the hard conversations. Log one symptom and this tab goes
          to work.
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* One-pager */}
      <Text style={[type.title, styles.section]}>The one-pager</Text>
      <Caption style={styles.sub}>
        Last {RANGE_DAYS} days, aggregated. What she logged — nothing more, nothing softer.
      </Caption>
      <Panel style={styles.preview}>
        <Text style={[type.title, styles.previewHead]}>
          Symptom record{settings.displayName ? ` — ${settings.displayName}` : ''}
        </Text>
        {onePager.summaries.map((s) => (
          <View key={s.label} style={styles.row}>
            <Text style={[type.body, styles.rowLabel]}>{s.label}</Text>
            <Text style={[type.caption, styles.rowStat]}>
              {s.count}× · {s.daysWithSymptom} {s.daysWithSymptom === 1 ? 'day' : 'days'} · avg{' '}
              {s.avgSeverity.toFixed(1)} · peak {s.peakSeverity}
            </Text>
          </View>
        ))}
        {onePager.questionsForClinician.length > 0 && (
          <>
            <Caption style={styles.qHead}>questions for this visit</Caption>
            {onePager.questionsForClinician.map((q) => (
              <Text key={q} style={[type.body, styles.question]}>
                · {q}
              </Text>
            ))}
          </>
        )}
        <DisclaimerFooter text={onePager.disclaimer} />
      </Panel>
      <PrimaryButton label="Export PDF for the doctor's desk" onPress={() => void exportPdf()} />
      {exportNote && <Caption style={styles.exportNote}>{exportNote}</Caption>}

      {/* Scripts */}
      <Text style={[type.title, styles.section]}>Say it with the record behind you</Text>
      <View style={styles.audRow}>
        {(['doctor', 'partner', 'employer'] as ScriptAudience[]).map((a) => (
          <Pressable
            key={a}
            onPress={() => setAudience(a)}
            style={[styles.aud, audience === a && styles.audActive]}
          >
            <Text style={[type.caption, audience === a ? styles.audTextActive : styles.audText]}>
              {a}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.toneRow}>
        <Caption>tone:</Caption>
        <GhostButton
          label={settings.scriptTone === 'measured' ? '● measured' : 'measured'}
          onPress={() => updateSettings({ scriptTone: 'measured' })}
        />
        <GhostButton
          label={settings.scriptTone === 'fierce' ? '● fierce' : 'fierce'}
          onPress={() => updateSettings({ scriptTone: 'fierce' })}
        />
      </View>
      <Panel>
        {script.lines.map((line, i) => (
          <Text key={i} style={[type.body, styles.scriptLine]}>
            {line}
          </Text>
        ))}
        <Caption style={styles.grounded}>
          Grounded in {script.sourceLogIds.length} of your own entries
          {logs[0] ? ` — most recent: ${symptomLabel(logs[logs.length - 1])}` : ''}.
        </Caption>
        <DisclaimerFooter text={script.disclaimer} />
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: { color: colors.text, marginBottom: spacing.sm },
  section: { color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  sub: { marginBottom: spacing.sm },
  preview: { backgroundColor: colors.panel },
  previewHead: { color: colors.text, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.text },
  rowStat: { color: colors.soft, fontVariant: ['tabular-nums'] },
  qHead: {
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  question: { color: colors.text },
  exportNote: { textAlign: 'center', marginBottom: spacing.md },
  audRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  aud: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.panel,
    paddingVertical: 10,
    alignItems: 'center',
  },
  audActive: { backgroundColor: colors.ember, borderColor: colors.ember },
  audText: { color: colors.soft },
  audTextActive: { color: '#FFF6ED', fontWeight: '700' },
  toneRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginBottom: spacing.sm },
  scriptLine: { color: colors.text, marginBottom: spacing.sm },
  grounded: { marginTop: spacing.xs },
});
