import { describe, expect, it } from "vitest";

import { emptyDoneByDay } from "@/store/slices/activities-slice";

import { hasActivityName, isActivityComplete } from "./types";

function row(
  partial: Partial<import("./types").ActivityRow>,
): import("./types").ActivityRow {
  return {
    id: "id-1",
    name: "",
    durationMinutes: null,
    doneByDay: emptyDoneByDay(),
    ...partial,
  };
}

describe("hasActivityName", () => {
  it("is false for empty or whitespace-only names", () => {
    expect(hasActivityName(row({ name: "" }))).toBe(false);
    expect(hasActivityName(row({ name: "   \t" }))).toBe(false);
  });

  it("is true when trimmed name is non-empty", () => {
    expect(hasActivityName(row({ name: "Run" }))).toBe(true);
    expect(hasActivityName(row({ name: "  Yoga  " }))).toBe(true);
  });
});

describe("isActivityComplete", () => {
  it("requires name and duration", () => {
    expect(isActivityComplete(row({ name: "A", durationMinutes: null }))).toBe(
      false,
    );
    expect(isActivityComplete(row({ name: "", durationMinutes: 30 }))).toBe(
      false,
    );
    expect(isActivityComplete(row({ name: "A", durationMinutes: 30 }))).toBe(
      true,
    );
  });
});
