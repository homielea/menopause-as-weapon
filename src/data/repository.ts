import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistedState, UserSettings } from '../domain/types';

// Versioned AsyncStorage persistence. No business logic lives here.
// Health data stays on-device; nothing in this file talks to a network.

const KEY = 'receipts-state';
export const SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: UserSettings = {
  menstruates: true,
  scriptTone: 'measured',
};

export async function loadState(): Promise<PersistedState | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      // future migrations dispatch on schemaVersion here
      return { ...parsed, schemaVersion: SCHEMA_VERSION };
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
