import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { syncThemeFontStylesheet } from "@/lib/theme-fonts";
import {
  WEEKLY_COMMIT_PERSIST_KEY,
  applyThemeAndAppearanceToDocument,
  type AppearanceMode,
  type ThemeId,
  parseAppearance,
  parseStoredTheme,
} from "@/lib/themes";
import type { ActivityRow } from "@/lib/weekly-grid/types";

import {
  createActivitiesSlice,
  persistedActivitiesOnly,
} from "./slices/activities-slice";
import { createThemeSlice } from "./slices/theme-slice";
import { noopStorage } from "./storage";
import type { WeeklyCommitState } from "./types";

export type { WeeklyCommitState } from "./types";

export const useWeeklyGridStore = create<WeeklyCommitState>()(
  persist(
    (...args) => ({
      ...createThemeSlice(...args),
      ...createActivitiesSlice(...args),
    }),
    {
      name: WEEKLY_COMMIT_PERSIST_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      partialize: (s) => ({
        activities: persistedActivitiesOnly(s.activities),
        themeId: s.themeId,
        appearance: s.appearance,
      }),
      merge: (persistedState, currentState) => {
        const next = { ...currentState };
        if (!persistedState || typeof persistedState !== "object") return next;
        const p = persistedState as {
          activities?: ActivityRow[];
          themeId?: ThemeId;
          appearance?: AppearanceMode;
        };
        if (p.themeId != null) {
          next.themeId = parseStoredTheme(String(p.themeId));
        }
        next.appearance = parseAppearance(p.appearance);
        if (Array.isArray(p.activities)) {
          next.activities = persistedActivitiesOnly(p.activities);
        }
        return next;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        applyThemeAndAppearanceToDocument(state.themeId, state.appearance);
        syncThemeFontStylesheet(state.themeId);
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
