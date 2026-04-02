import { DAY_IDS } from "./constants";
import type { ActivityRow } from "./types";
import type { DayId } from "./types";

function dayTotalForActivities(
  activities: ActivityRow[],
  day: DayId,
): number {
  let sum = 0;
  for (const activity of activities) {
    if (!activity.doneByDay[day] || activity.durationMinutes == null) continue;
    sum += activity.durationMinutes;
  }
  return sum;
}

/** Sum of each row’s session duration (ignores rows with no duration selected). */
export function sumSessionDurations(activities: ActivityRow[]): number {
  let sum = 0;
  for (const activity of activities) {
    if (activity.durationMinutes != null) sum += activity.durationMinutes;
  }
  return sum;
}

/** Sum of completed minutes per weekday column (Mon–Sat). */
export function columnTotals(
  activities: ActivityRow[],
): Record<DayId, number> {
  return Object.fromEntries(
    DAY_IDS.map((day) => [day, dayTotalForActivities(activities, day)]),
  ) as Record<DayId, number>;
}

/** Completed minutes for one activity across the week (duration × checked days). */
export function rowTotal(activity: ActivityRow): number {
  if (activity.durationMinutes == null) return 0;
  const checkedDays = DAY_IDS.filter((day) => activity.doneByDay[day]).length;
  return activity.durationMinutes * checkedDays;
}

/** Total completed minutes for all activities and days. */
export function grandTotal(activities: ActivityRow[]): number {
  let sum = 0;
  for (const activity of activities) {
    sum += rowTotal(activity);
  }
  return sum;
}
