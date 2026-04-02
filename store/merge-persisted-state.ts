import type { ActivityRow } from "@/lib/weekly-grid/types";
import { parseLocale, type Locale } from "@/lib/i18n";
import {
  parseAppearance,
  parseStoredTheme,
  type AppearanceMode,
  type ThemeId,
} from "@/lib/themes";

import { persistedActivitiesOnly } from "./slices/activities-slice";
import type { WeeklyCommitState } from "./types";

/**
 * Merges persisted JSON state into the current Zustand state (Zustand persist `merge`).
 */
export function mergeWeeklyCommitPersistedState(
  persistedState: unknown,
  currentState: WeeklyCommitState,
): WeeklyCommitState {
  const next = { ...currentState };
  if (!persistedState || typeof persistedState !== "object") return next;
  const p = persistedState as {
    activities?: ActivityRow[];
    themeId?: ThemeId;
    appearance?: AppearanceMode;
    locale?: Locale;
  };
  if (p.themeId != null) {
    next.themeId = parseStoredTheme(String(p.themeId));
  }
  next.appearance = parseAppearance(p.appearance);
  next.locale = parseLocale(p.locale);
  if (Array.isArray(p.activities)) {
    next.activities = persistedActivitiesOnly(p.activities);
  }
  return next;
}
