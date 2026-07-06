import { create } from 'zustand';
import { createLog, NewLogInput } from '../domain/logging';
import { SymptomLog, UserSettings } from '../domain/types';
import {
  DEFAULT_SETTINGS,
  loadState,
  saveState,
  SCHEMA_VERSION,
} from '../data/repository';

// One store, persisted through the versioned repository. UI reads this;
// domain logic stays pure and is called with plain data.

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

interface AppState {
  logs: SymptomLog[];
  settings: UserSettings;
  onboardingComplete: boolean;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  addLog: (input: NewLogInput) => SymptomLog;
  deleteLog: (id: string) => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  completeOnboarding: () => void;
}

function persist(get: () => AppState): void {
  const { logs, settings, onboardingComplete } = get();
  void saveState({ schemaVersion: SCHEMA_VERSION, logs, settings, onboardingComplete });
}

export const useAppStore = create<AppState>()((set, get) => ({
  logs: [],
  settings: DEFAULT_SETTINGS,
  onboardingComplete: false,
  hydrated: false,

  hydrate: async () => {
    const loaded = await loadState();
    set({
      logs: loaded?.logs ?? [],
      settings: loaded?.settings ?? DEFAULT_SETTINGS,
      onboardingComplete: loaded?.onboardingComplete ?? false,
      hydrated: true,
    });
  },

  addLog: (input) => {
    const log = createLog(input, newId(), new Date().toISOString());
    set((s) => ({ logs: [...s.logs, log] }));
    persist(get);
    return log;
  },

  deleteLog: (id) => {
    set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
    persist(get);
  },

  updateSettings: (partial) => {
    set((s) => ({ settings: { ...s.settings, ...partial } }));
    persist(get);
  },

  completeOnboarding: () => {
    set({ onboardingComplete: true });
    persist(get);
  },
}));
