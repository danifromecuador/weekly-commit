import { parseLocale, type Locale } from "@/lib/i18n";
import {
  parseAppearance,
  parseStoredTheme,
  type AppearanceMode,
  type ThemeId,
} from "@/lib/themes";

import type { WeeklyCommitState } from "./types";

/**
 * Merges persisted JSON state into the current Zustand state (Zustand persist `merge`).
 * Activities are no longer persisted here — they load from the server.
 */
export function mergeWeeklyCommitPersistedState(
  persistedState: unknown,
  currentState: WeeklyCommitState,
): WeeklyCommitState {
  const next = { ...currentState };
  if (!persistedState || typeof persistedState !== "object") return next;
  const p = persistedState as {
    themeId?: ThemeId;
    appearance?: AppearanceMode;
    locale?: Locale;
  };
  if (p.themeId != null) {
    next.themeId = parseStoredTheme(String(p.themeId));
  }
  next.appearance = parseAppearance(p.appearance);
  next.locale = parseLocale(p.locale);
  return next;
}
