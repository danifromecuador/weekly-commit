import { create } from "zustand";

import { DAY_IDS, type DurationMinutes } from "./constants";
import {
  type ActivityRow,
  type DayId,
  hasActivityName,
  isActivityComplete,
} from "./types";

function emptyDoneByDay(): Record<DayId, boolean> {
  return Object.fromEntries(
    DAY_IDS.map((d) => [d, false] as const),
  ) as Record<DayId, boolean>;
}

type WeeklyGridState = {
  activities: ActivityRow[];
  /** Returns the new row id when added, or `null` if add was blocked. */
  addActivity: () => string | null;
  removeActivity: (id: string) => void;
  setActivityName: (id: string, name: string) => void;
  setActivityDuration: (id: string, durationMinutes: DurationMinutes) => void;
  toggleDayCompletion: (id: string, day: DayId) => void;
};

export const useWeeklyGridStore = create<WeeklyGridState>((set) => ({
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
}));
