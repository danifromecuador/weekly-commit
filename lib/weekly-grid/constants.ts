export const DAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;

export const DAY_LABELS: Record<(typeof DAY_IDS)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

export const DURATION_OPTIONS = [
  { minutes: 15, label: "15m" },
  { minutes: 30, label: "30m" },
  { minutes: 45, label: "45m" },
  { minutes: 60, label: "1h" },
  { minutes: 90, label: "1h30m" },
  { minutes: 120, label: "2h" },
] as const;

export type DurationMinutes = (typeof DURATION_OPTIONS)[number]["minutes"];
