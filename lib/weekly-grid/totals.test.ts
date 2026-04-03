import { describe, expect, it } from "vitest";

import { emptyDoneByDay } from "@/store/slices/activities-slice";

import {
  columnTotals,
  grandTotal,
  rowTotal,
  sumSessionDurations,
} from "./totals";
import type { ActivityRow } from "./types";

function act(partial: Partial<ActivityRow>): ActivityRow {
  return {
    id: "a",
    name: "Workout",
    durationMinutes: 60,
    doneByDay: emptyDoneByDay(),
    ...partial,
  };
}

describe("sumSessionDurations", () => {
  it("sums durations ignoring null", () => {
    expect(
      sumSessionDurations([
        act({ durationMinutes: 30 }),
        act({ id: "b", durationMinutes: null }),
        act({ id: "c", durationMinutes: 15 }),
      ]),
    ).toBe(45);
  });

  it("returns 0 for empty list", () => {
    expect(sumSessionDurations([])).toBe(0);
  });
});

describe("columnTotals", () => {
  it("sums completed minutes per weekday column", () => {
    const monWed = emptyDoneByDay();
    monWed.mon = true;
    monWed.wed = true;
    const activities: ActivityRow[] = [
      act({ id: "1", durationMinutes: 30, doneByDay: monWed }),
      act({
        id: "2",
        durationMinutes: 60,
        doneByDay: { ...emptyDoneByDay(), fri: true },
      }),
    ];
    const totals = columnTotals(activities);
    expect(totals.mon).toBe(30);
    expect(totals.wed).toBe(30);
    expect(totals.fri).toBe(60);
    expect(totals.tue).toBe(0);
  });

  it("ignores unchecked days and null duration", () => {
    const d = emptyDoneByDay();
    d.mon = true;
    expect(
      columnTotals([
        act({ durationMinutes: null, doneByDay: d }),
        act({ id: "x", durationMinutes: 45, doneByDay: emptyDoneByDay() }),
      ]).mon,
    ).toBe(0);
  });
});

describe("rowTotal", () => {
  it("is duration times checked days", () => {
    const d = emptyDoneByDay();
    d.mon = true;
    d.tue = true;
    expect(rowTotal(act({ durationMinutes: 30, doneByDay: d }))).toBe(60);
  });

  it("is 0 when duration is null", () => {
    const d = emptyDoneByDay();
    d.mon = true;
    expect(rowTotal(act({ durationMinutes: null, doneByDay: d }))).toBe(0);
  });
});

describe("grandTotal", () => {
  it("sums row totals across activities", () => {
    const d1 = emptyDoneByDay();
    d1.mon = true;
    const d2 = emptyDoneByDay();
    d2.mon = true;
    d2.tue = true;
    expect(
      grandTotal([
        act({ id: "1", durationMinutes: 15, doneByDay: d1 }),
        act({ id: "2", durationMinutes: 30, doneByDay: d2 }),
      ]),
    ).toBe(15 + 30 * 2);
  });
});
