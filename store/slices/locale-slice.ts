import type { StateCreator } from "zustand";

import {
  DEFAULT_LOCALE,
  applyLocaleToDocument,
  type Locale,
} from "@/lib/i18n";
import type { WeeklyCommitState } from "../types";

export type LocaleSlice = Pick<WeeklyCommitState, "locale" | "setLocale">;

export const createLocaleSlice: StateCreator<
  WeeklyCommitState,
  [],
  [],
  LocaleSlice
> = (set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale: Locale) => {
    set({ locale });
    applyLocaleToDocument(locale);
  },
});

