import { arrayMove } from "@dnd-kit/sortable";
import type { StateCreator } from "zustand";

import { DAY_IDS } from "@/lib/weekly-grid/constants";
import {
  type ActivityRow,
  type DayId,
  hasActivityName,
  isActivityComplete,
} from "@/lib/weekly-grid/types";
import type { WeeklyCommitState } from "../types";

export function emptyDoneByDay(): Record<DayId, boolean> {
  return Object.fromEntries(
    DAY_IDS.map((d) => [d, false] as const),
  ) as Record<DayId, boolean>;
}

/** Draft rows (no trimmed name) must not be written to or restored from storage. */
export function persistedActivitiesOnly(activities: ActivityRow[]): ActivityRow[] {
  return activities.filter(hasActivityName);
}

export type ActivitiesSlice = Pick<
  WeeklyCommitState,
  | "activities"
  | "addActivity"
  | "removeActivity"
  | "setActivityName"
  | "setActivityDuration"
  | "toggleDayCompletion"
  | "reorderActivities"
>;

export const createActivitiesSlice: StateCreator<
  WeeklyCommitState,
  [],
  [],
  ActivitiesSlice
> = (set) => ({
  activities: [],
  addActivity: () => {
    const newId = crypto.randomUUID();
    let added = false;
    set((s) => {
      if (s.activities.some((a) => !hasActivityName(a))) return s;
      added = true;
      return {
        activities: [
          ...s.activities,
          {
            id: newId,
            name: "",
            durationMinutes: null,
            doneByDay: emptyDoneByDay(),
          },
        ],
      };
    });
    return added ? newId : null;
  },
  removeActivity: (id) =>
    set((s) => ({
      activities: s.activities.filter((a) => a.id !== id),
    })),
  setActivityName: (id, name) =>
    set((s) => ({
      activities: s.activities.map((a) => {
        if (a.id !== id) return a;
        if (!name.trim()) {
          return { ...a, name, doneByDay: emptyDoneByDay() };
        }
        return { ...a, name };
      }),
    })),
  setActivityDuration: (id, durationMinutes) =>
    set((s) => ({
      activities: s.activities.map((a) =>
        a.id === id ? { ...a, durationMinutes } : a,
      ),
    })),
  toggleDayCompletion: (id, day) =>
    set((s) => ({
      activities: s.activities.map((a) => {
        if (a.id !== id) return a;
        if (!isActivityComplete(a)) return a;
        return {
          ...a,
          doneByDay: { ...a.doneByDay, [day]: !a.doneByDay[day] },
        };
      }),
    })),
  reorderActivities: (activeId, overId) =>
    set((s) => {
      const oldIndex = s.activities.findIndex((a) => a.id === activeId);
      const newIndex = s.activities.findIndex((a) => a.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return s;
      }
      return {
        activities: arrayMove(s.activities, oldIndex, newIndex),
      };
    }),
});
