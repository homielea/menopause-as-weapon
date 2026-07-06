import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Body,
  Caption,
  Panel,
  PrimaryButton,
  Screen,
} from '../../src/components/ui';
import { needsDutyOfCare } from '../../src/domain/safety';
import { DUTY_OF_CARE } from '../../src/domain/disclaimers';
import { Severity, SymptomType, SYMPTOM_LABELS } from '../../src/domain/types';
import { useAppStore } from '../../src/state/store';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

// F1 — the five-second log. Tap a symptom, tap a severity, done. Context is
// optional and never blocks the save.

const QUICK_TAGS = ['at work', 'woke me up', 'during meeting', 'in public', 'all day'];
const SYMPTOMS = Object.keys(SYMPTOM_LABELS) as SymptomType[];

export default function Log() {
  const addLog = useAppStore((s) => s.addLog);
  const menstruates = useAppStore((s) => s.settings.menstruates);

  const [symptom, setSymptom] = useState<SymptomType | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [cycleDay, setCycleDay] = useState('');
  const [saved, setSaved] = useState(false);
  const [dutyOfCare, setDutyOfCare] = useState(false);

  const reset = () => {
    setSymptom(null);
    setCustomLabel('');
    setSeverity(null);
    setTags([]);
    setNote('');
    setCycleDay('');
  };

  const save = () => {
    if (!symptom || severity === null) return;
    if (needsDutyOfCare(note)) setDutyOfCare(true);
    addLog({
      type: symptom,
      customLabel: symptom === 'other' ? customLabel : undefined,
      severity,
      context: {
        tags,
        note: note || undefined,
        cycleDay: menstruates && cycleDay ? Number(cycleDay) : null,
      },
    });
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const canSave =
    symptom !== null && severity !== null && (symptom !== 'other' || customLabel.trim().length > 0);

  return (
    <Screen>
      {saved && (
        <Panel style={styles.savedPanel}>
          <Text style={[type.title, styles.savedText]}>On the record.</Text>
        </Panel>
      )}
      {dutyOfCare && (
        <Panel style={styles.dutyPanel}>
          <Text style={[type.title, styles.dutyHead]}>{DUTY_OF_CARE.heading}</Text>
          <Body soft>{DUTY_OF_CARE.body}</Body>
          {DUTY_OF_CARE.resources.map((r) => (
            <Caption key={r} style={styles.dutyLine}>
              {r}
            </Caption>
          ))}
        </Panel>
      )}

      <Text style={[type.title, styles.q]}>What happened?</Text>
      <View style={styles.grid}>
        {SYMPTOMS.map((s) => (
          <Pressable
            key={s}
            onPress={() => setSymptom(s)}
            accessibilityRole="button"
            style={[styles.chip, symptom === s && styles.chipActive]}
          >
            <Text style={[type.caption, symptom === s ? styles.chipTextActive : styles.chipText]}>
              {SYMPTOM_LABELS[s]}
            </Text>
          </Pressable>
        ))}
      </View>
      {symptom === 'other' && (
        <TextInput
          style={styles.input}
          placeholder="Name it in your own words"
          placeholderTextColor={colors.soft}
          value={customLabel}
          onChangeText={setCustomLabel}
        />
      )}

      <Text style={[type.title, styles.q]}>How hard did it hit?</Text>
      <View style={styles.sevRow}>
        {([1, 2, 3, 4] as Severity[]).map((v) => (
          <Pressable
            key={v}
            onPress={() => setSeverity(v)}
            accessibilityRole="button"
            accessibilityLabel={`severity ${v} of 4`}
            style={[styles.sev, severity === v && styles.sevActive]}
          >
            <Text style={[type.title, severity === v ? styles.sevTextActive : styles.sevText]}>
              {'▮'.repeat(v)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[type.title, styles.q]}>Context (optional — it makes the receipt stronger)</Text>
      <View style={styles.grid}>
        {QUICK_TAGS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
            style={[styles.chip, tags.includes(t) && styles.chipActive]}
          >
            <Text style={[type.caption, tags.includes(t) ? styles.chipTextActive : styles.chipText]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="A note in your own words — end with ? to flag it for the doctor"
        placeholderTextColor={colors.soft}
        value={note}
        onChangeText={setNote}
      />
      {menstruates && (
        <TextInput
          style={styles.input}
          placeholder="Cycle day, if you know it"
          placeholderTextColor={colors.soft}
          value={cycleDay}
          onChangeText={(t) => setCycleDay(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
        />
      )}

      <PrimaryButton label="Log it" disabled={!canSave} onPress={save} />
      <Caption style={styles.footnote}>
        Stays on this phone. Leaves only when you export it — your call, every time.
      </Caption>
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: { color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    paddingVertical: 8,
    paddingHorizontal: 13,
  },
  chipActive: { backgroundColor: colors.ember, borderColor: colors.ember },
  chipText: { color: colors.text },
  chipTextActive: { color: '#FFF6ED', fontWeight: '700' },
  sevRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  sev: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.panel,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sevActive: { borderColor: colors.ember, backgroundColor: '#33201A' },
  sevText: { color: colors.soft },
  sevTextActive: { color: colors.ember },
  input: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    padding: spacing.md,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  savedPanel: { borderColor: colors.ember },
  savedText: { color: colors.ember },
  dutyPanel: { borderColor: colors.ember },
  dutyHead: { color: colors.text, marginBottom: spacing.xs },
  dutyLine: { marginTop: spacing.xs },
  footnote: { textAlign: 'center', marginTop: spacing.xs },
});
