import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import {
  DEFAULT_THEME_ID,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  WEEKLY_COMMIT_PERSIST_KEY,
  type ThemeId,
  parseStoredTheme,
} from "@/lib/themes";
import { DAY_IDS, type DurationMinutes } from "./constants";
import {
  type ActivityRow,
  type DayId,
  hasActivityName,
  isActivityComplete,
} from "./types";

function emptyDoneByDay(): Record<DayId, boolean> {
  return Object.fromEntries(
    DAY_IDS.map((d) => [d, false] as const),
  ) as Record<DayId, boolean>;
}

/** Draft rows (no trimmed name) must not be written to or restored from storage. */
function persistedActivitiesOnly(activities: ActivityRow[]): ActivityRow[] {
  return activities.filter(hasActivityName);
}

function weeklyCommitInnerStorage(): StateStorage {
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

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type WeeklyGridState = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  activities: ActivityRow[];
  /** Returns the new row id when added, or `null` if add was blocked. */
  addActivity: () => string | null;
  removeActivity: (id: string) => void;
  setActivityName: (id: string, name: string) => void;
  setActivityDuration: (id: string, durationMinutes: DurationMinutes) => void;
  toggleDayCompletion: (id: string, day: DayId) => void;
};

export const useWeeklyGridStore = create<WeeklyGridState>()(
  persist(
    (set) => ({
      themeId: DEFAULT_THEME_ID,
      setTheme: (themeId: ThemeId) => {
        set({ themeId });
        if (typeof document !== "undefined") {
          document.documentElement.dataset.theme = themeId;
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
        }
      },
      activities: [],
      addActivity: () => {
        const newId = crypto.randomUUID();
        let added = false;
        set((s) => {
          if (s.activities.some((a) => !hasActivityName(a))) return s;
          added = true;
          return {
            activities: [
              ...s.activities,
              {
                id: newId,
                name: "",
                durationMinutes: null,
                doneByDay: emptyDoneByDay(),
              },
            ],
          };
        });
        return added ? newId : null;
      },
      removeActivity: (id) =>
        set((s) => ({
          activities: s.activities.filter((a) => a.id !== id),
        })),
      setActivityName: (id, name) =>
        set((s) => ({
          activities: s.activities.map((a) => {
            if (a.id !== id) return a;
            if (!name.trim()) {
              return { ...a, name, doneByDay: emptyDoneByDay() };
            }
            return { ...a, name };
          }),
        })),
      setActivityDuration: (id, durationMinutes) =>
        set((s) => ({
          activities: s.activities.map((a) =>
            a.id === id ? { ...a, durationMinutes } : a,
          ),
        })),
      toggleDayCompletion: (id, day) =>
        set((s) => ({
          activities: s.activities.map((a) => {
            if (a.id !== id) return a;
            if (!isActivityComplete(a)) return a;
            return {
              ...a,
              doneByDay: { ...a.doneByDay, [day]: !a.doneByDay[day] },
            };
          }),
        })),
    }),
    {
      name: WEEKLY_COMMIT_PERSIST_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? weeklyCommitInnerStorage() : noopStorage,
      ),
      partialize: (s) => ({
        activities: persistedActivitiesOnly(s.activities),
        themeId: s.themeId,
      }),
      merge: (persistedState, currentState) => {
        const next = { ...currentState };
        if (!persistedState || typeof persistedState !== "object") return next;
        const p = persistedState as {
          activities?: ActivityRow[];
          themeId?: ThemeId;
        };
        if (p.themeId != null) {
          next.themeId = parseStoredTheme(String(p.themeId));
        }
        if (Array.isArray(p.activities)) {
          next.activities = persistedActivitiesOnly(p.activities);
        }
        return next;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        if (typeof document !== "undefined") {
          document.documentElement.dataset.theme = state.themeId;
        }
      },
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === WEEKLY_COMMIT_PERSIST_KEY && e.newValue != null) {
      void useWeeklyGridStore.persist.rehydrate();
    }
  });
}
