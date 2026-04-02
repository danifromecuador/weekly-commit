import { DAY_IDS, type DurationMinutes } from "./constants";

export type DayId = (typeof DAY_IDS)[number];

export type ActivityRow = {
  id: string;
  name: string;
  durationMinutes: DurationMinutes;
  doneByDay: Record<DayId, boolean>;
};
