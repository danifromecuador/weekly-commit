import type { DurationMinutes } from "@/lib/weekly-grid/constants";
import type { Locale } from "@/lib/i18n";
import type { ActivityRow, DayId } from "@/lib/weekly-grid/types";
import type { AppearanceMode, ThemeId } from "@/lib/themes";

export type WeeklyCommitState = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  activities: ActivityRow[];
  /** Returns the new row id when added, or `null` if add was blocked. */
  addActivity: () => string | null;
  removeActivity: (id: string) => void;
  setActivityName: (id: string, name: string) => void;
  setActivityDuration: (
    id: string,
    durationMinutes: DurationMinutes | null,
  ) => void;
  toggleDayCompletion: (id: string, day: DayId) => void;
  /** Reorders rows by id only; does not change row fields. */
  reorderActivities: (activeId: string, overId: string) => void;
};
