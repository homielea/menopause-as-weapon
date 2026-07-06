import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from '../theme/tokens';
import { SymptomLog, symptomLabel } from '../domain/types';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Display({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[type.display, styles.display, style]}>{children}</Text>;
}

export function Body({ children, soft, style }: { children: React.ReactNode; soft?: boolean; style?: TextStyle }) {
  return (
    <Text style={[type.body, { color: soft ? colors.soft : colors.text }, style]}>{children}</Text>
  );
}

export function Caption({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[type.caption, { color: colors.soft }, style]}>{children}</Text>;
}

export function Panel({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[type.title, styles.primaryText]}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[type.title, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function DisclaimerFooter({ text }: { text: string }) {
  return (
    <View style={styles.disclaimer}>
      <Text style={[type.caption, styles.disclaimerText]}>{text}</Text>
    </View>
  );
}

/** The signature surface: a log rendered as a line on receipt paper. */
export function ReceiptCard({ logs, day }: { logs: SymptomLog[]; day: string }) {
  return (
    <View style={styles.receipt}>
      <View style={styles.receiptEdge} />
      <Text style={[type.receipt, styles.receiptHead]}>
        {new Date(`${day}T12:00:00`).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase()}
      </Text>
      <View style={styles.receiptRule} />
      {logs.map((l) => (
        <View key={l.id} style={styles.receiptRow}>
          <Text style={[type.receipt, styles.receiptItem]} numberOfLines={1}>
            {new Date(l.loggedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}{' '}
            {symptomLabel(l).toLowerCase()}
          </Text>
          <Text style={[type.receipt, styles.receiptTicks]}>
            {'▮'.repeat(Math.max(1, l.severity))}{'▯'.repeat(4 - Math.max(1, l.severity))}
          </Text>
        </View>
      ))}
      {logs.some((l) => l.context.tags.length > 0 || l.context.note) && (
        <>
          <View style={styles.receiptRule} />
          {logs
            .filter((l) => l.context.tags.length > 0 || l.context.note)
            .map((l) => (
              <Text key={`${l.id}-ctx`} style={[type.receipt, styles.receiptContext]} numberOfLines={2}>
                · {[...l.context.tags, l.context.note].filter(Boolean).join(' — ')}
              </Text>
            ))}
        </>
      )}
      <Text style={[type.receipt, styles.receiptFoot]}>— logged, on the record —</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  display: { color: colors.text, marginBottom: spacing.sm },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  primary: {
    backgroundColor: colors.ember,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryText: { color: '#FFF6ED' },
  ghost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.panel,
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
  disclaimer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.md,
  },
  disclaimerText: { color: colors.soft },
  receipt: {
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  receiptEdge: {
    height: 3,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.ember,
  },
  receiptHead: { color: colors.paperInk, letterSpacing: 1 },
  receiptRule: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#C9C2B2',
    marginVertical: spacing.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 2,
  },
  receiptItem: { color: colors.paperInk, flex: 1 },
  receiptTicks: { color: colors.emberDeep },
  receiptContext: { color: colors.paperSoft },
  receiptFoot: {
    color: colors.paperSoft,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
