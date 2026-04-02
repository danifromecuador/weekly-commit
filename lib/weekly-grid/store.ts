import { create } from "zustand";

import { DAY_IDS, type DurationMinutes } from "./constants";
import type { ActivityRow, DayId } from "./types";

function emptyDoneByDay(): Record<DayId, boolean> {
  return Object.fromEntries(
    DAY_IDS.map((d) => [d, false] as const),
  ) as Record<DayId, boolean>;
}

type WeeklyGridState = {
  activities: ActivityRow[];
  addActivity: () => void;
  removeActivity: (id: string) => void;
  setActivityName: (id: string, name: string) => void;
  setActivityDuration: (id: string, durationMinutes: DurationMinutes) => void;
  toggleDayCompletion: (id: string, day: DayId) => void;
};

export const useWeeklyGridStore = create<WeeklyGridState>((set) => ({
  activities: [],
  addActivity: () =>
    set((s) => ({
      activities: [
        ...s.activities,
        {
          id: crypto.randomUUID(),
          name: "",
          durationMinutes: 60,
          doneByDay: emptyDoneByDay(),
        },
      ],
    })),
  removeActivity: (id) =>
    set((s) => ({
      activities: s.activities.filter((a) => a.id !== id),
    })),
  setActivityName: (id, name) =>
    set((s) => ({
      activities: s.activities.map((a) =>
        a.id === id ? { ...a, name } : a,
      ),
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
        return {
          ...a,
          doneByDay: { ...a.doneByDay, [day]: !a.doneByDay[day] },
        };
      }),
    })),
}));
