import { DAY_IDS, type DurationMinutes } from "./constants";

export type DayId = (typeof DAY_IDS)[number];

export type ActivityRow = {
  id: string;
  name: string;
  /** `null` until the user picks a duration from the predefined list. */
  durationMinutes: DurationMinutes | null;
  doneByDay: Record<DayId, boolean>;
};

/** Non-empty goal name (trimmed); required to add another row. */
export function hasActivityName(activity: ActivityRow): boolean {
  return activity.name.trim().length > 0;
}

/** Name and duration chosen; required for day checkboxes and row time totals. */
export function isActivityComplete(activity: ActivityRow): boolean {
  return hasActivityName(activity) && activity.durationMinutes != null;
}
