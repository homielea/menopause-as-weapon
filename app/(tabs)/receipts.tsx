import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Caption, ReceiptCard, Screen } from '../../src/components/ui';
import { groupByDay } from '../../src/domain/timeline';
import { SymptomType, SYMPTOM_LABELS } from '../../src/domain/types';
import { useAppStore } from '../../src/state/store';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

// F4 — the receipts timeline. Every day is a paper receipt: dated, itemized,
// severity-ticked. The answer to "you're overreacting," printed.

export default function Receipts() {
  const logs = useAppStore((s) => s.logs);
  const [filter, setFilter] = useState<SymptomType | null>(null);

  const groups = useMemo(() => groupByDay(logs, filter), [logs, filter]);
  const typesPresent = useMemo(
    () => [...new Set(logs.map((l) => l.type))] as SymptomType[],
    [logs]
  );

  if (logs.length === 0) {
    return (
      <Screen>
        <Text style={[type.display, styles.h]}>No receipts yet.</Text>
        <Body soft>
          The first log starts the paper trail. From then on, every entry lands here
          — dated, itemized, and ready to back you up.
        </Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.filters}>
        <Pressable
          onPress={() => setFilter(null)}
          style={[styles.filter, filter === null && styles.filterActive]}
        >
          <Text style={[type.caption, filter === null ? styles.filterTextActive : styles.filterText]}>
            everything
          </Text>
        </Pressable>
        {typesPresent.map((t) => (
          <Pressable
            key={t}
            onPress={() => setFilter(filter === t ? null : t)}
            style={[styles.filter, filter === t && styles.filterActive]}
          >
            <Text style={[type.caption, filter === t ? styles.filterTextActive : styles.filterText]}>
              {SYMPTOM_LABELS[t].toLowerCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      <Caption style={styles.count}>
        {logs.length} {logs.length === 1 ? 'entry' : 'entries'} on the record
      </Caption>
      {groups.map((g) => (
        <ReceiptCard key={g.day} day={g.day} logs={g.logs} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: { color: colors.text, marginBottom: spacing.sm },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  filter: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  filterActive: { backgroundColor: colors.ember, borderColor: colors.ember },
  filterText: { color: colors.soft },
  filterTextActive: { color: '#FFF6ED', fontWeight: '700' },
  count: { marginBottom: spacing.md },
});
