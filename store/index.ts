import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { syncThemeFontStylesheet } from "@/lib/theme-fonts";
import { applyLocaleToDocument } from "@/lib/i18n";
import {
  WEEKLY_COMMIT_PERSIST_KEY,
  applyThemeAndAppearanceToDocument,
} from "@/lib/themes";

import {
  createActivitiesSlice,
  persistedActivitiesOnly,
} from "./slices/activities-slice";
import { createLocaleSlice } from "./slices/locale-slice";
import { createThemeSlice } from "./slices/theme-slice";
import { mergeWeeklyCommitPersistedState } from "./merge-persisted-state";
import { noopStorage } from "./storage";
import type { WeeklyCommitState } from "./types";

export type { WeeklyCommitState } from "./types";

export const useWeeklyGridStore = create<WeeklyCommitState>()(
  persist(
    (...args) => ({
      ...createThemeSlice(...args),
      ...createLocaleSlice(...args),
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
        locale: s.locale,
      }),
      merge: mergeWeeklyCommitPersistedState,
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        applyThemeAndAppearanceToDocument(state.themeId, state.appearance);
        applyLocaleToDocument(state.locale);
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
