import { DAY_IDS, type DurationMinutes } from "./constants";

export type DayId = (typeof DAY_IDS)[number];

export type ActivityRow = {
  id: string;
  name: string;
  /** `null` until the user picks a duration from the predefined list. */
  durationMinutes: DurationMinutes | null;
  doneByDay: Record<DayId, boolean>;
};

/** Name (non-empty after trim) and duration chosen; required to add another row or use day checkboxes. */
export function isActivityComplete(activity: ActivityRow): boolean {
  return activity.name.trim().length > 0 && activity.durationMinutes != null;
}
