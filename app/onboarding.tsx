import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Body,
  Caption,
  GhostButton,
  Panel,
  PrimaryButton,
  Screen,
} from '../src/components/ui';
import { useAppStore } from '../src/state/store';
import { colors, radius, spacing, type } from '../src/theme/tokens';

// F5 — armed in two minutes. One question that matters, one optional name,
// and she's logging. No quiz, no paywall between her and the first receipt.

export default function Onboarding() {
  const updateSettings = useAppStore((s) => s.updateSettings);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [menstruates, setMenstruates] = useState<boolean | null>(null);
  const [name, setName] = useState('');

  return (
    <Screen>
      <Text style={styles.eyebrow}>receipts</Text>
      <Text style={[type.display, styles.title]}>
        "You're overreacting."{'\n'}Answer that with data.
      </Text>
      <Body soft style={styles.lead}>
        Every hot flash, every 3am, every fog you push through — logged in five
        seconds, kept on this phone, and turned into something you can put on a
        doctor's desk. You're not imagining it. Now you can prove it.
      </Body>

      <Panel>
        <Text style={[type.title, styles.q]}>Do you still get periods?</Text>
        <Caption style={styles.hint}>
          This only tunes the log (cycle-day context). Either answer is normal here.
        </Caption>
        <View style={styles.row}>
          <View style={styles.col}>
            <GhostButton label={menstruates === true ? '● Yes' : 'Yes'} onPress={() => setMenstruates(true)} />
          </View>
          <View style={styles.col}>
            <GhostButton
              label={menstruates === false ? '● No / irregular' : 'No / irregular'}
              onPress={() => setMenstruates(false)}
            />
          </View>
        </View>
      </Panel>

      <Panel>
        <Text style={[type.title, styles.q]}>Name on the one-pager (optional)</Text>
        <Caption style={styles.hint}>Only printed on the PDF header. Stays on this device.</Caption>
        <TextInput
          style={styles.input}
          placeholder="Leave blank to keep it unnamed"
          placeholderTextColor={colors.soft}
          value={name}
          onChangeText={setName}
        />
      </Panel>

      <PrimaryButton
        label="Start the record"
        disabled={menstruates === null}
        onPress={() => {
          updateSettings({
            menstruates: menstruates === true,
            displayName: name.trim() || undefined,
          });
          completeOnboarding();
          router.replace('/(tabs)/log');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...type.caption,
    color: colors.emberText,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  title: { color: colors.text, marginBottom: spacing.md },
  lead: { marginBottom: spacing.lg },
  q: { color: colors.text, marginBottom: spacing.xs },
  hint: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  col: { flex: 1 },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    padding: spacing.md,
    fontSize: 15,
  },
});
