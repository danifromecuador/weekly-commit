import type { StateStorage } from "zustand/middleware";

import {
  THEME_STORAGE_KEY,
  WEEKLY_COMMIT_PERSIST_KEY,
  parseStoredTheme,
} from "@/lib/themes";
import type { ActivityRow } from "@/lib/weekly-grid/types";

export function weeklyCommitInnerStorage(): StateStorage {
  return {
    getItem: (name) => {
      try {
        const raw = localStorage.getItem(name);
        if (raw) return raw;
        if (name !== WEEKLY_COMMIT_PERSIST_KEY) return null;
        const legacy = localStorage.getItem(THEME_STORAGE_KEY);
        if (legacy === null) return null;
        const themeId = parseStoredTheme(legacy);
        return JSON.stringify({
          state: {
            activities: [] as ActivityRow[],
            themeId,
          },
          version: 0,
        });
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      localStorage.setItem(name, value);
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  };
}

export const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
