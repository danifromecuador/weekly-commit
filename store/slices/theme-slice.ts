import type { StateCreator } from "zustand";

import { syncThemeFontStylesheet } from "@/lib/theme-fonts";
import {
  APPEARANCE_CHANGE_EVENT,
  DEFAULT_APPEARANCE,
  DEFAULT_THEME_ID,
  THEME_CHANGE_EVENT,
  applyAppearanceToDocument,
  type AppearanceMode,
  type ThemeId,
} from "@/lib/themes";
import type { WeeklyCommitState } from "../types";

export type ThemeSlice = Pick<
  WeeklyCommitState,
  "themeId" | "setTheme" | "appearance" | "setAppearance"
>;

export const createThemeSlice: StateCreator<
  WeeklyCommitState,
  [],
  [],
  ThemeSlice
> = (set) => ({
  themeId: DEFAULT_THEME_ID,
  setTheme: (themeId: ThemeId) => {
    set({ themeId });
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = themeId;
      syncThemeFontStylesheet(themeId);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    }
  },
  appearance: DEFAULT_APPEARANCE,
  setAppearance: (appearance: AppearanceMode) => {
    set({ appearance });
    applyAppearanceToDocument(appearance);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(APPEARANCE_CHANGE_EVENT));
    }
  },
});
