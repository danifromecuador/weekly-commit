import { describe, expect, it } from "vitest";

import { formatMinutes } from "./format-minutes";

describe("formatMinutes", () => {
  it("formats zero", () => {
    expect(formatMinutes(0)).toBe("0");
  });

  it("formats minutes only", () => {
    expect(formatMinutes(45)).toBe("45m");
  });

  it("formats whole hours", () => {
    expect(formatMinutes(120)).toBe("2h");
  });

  it("formats hours and minutes", () => {
    expect(formatMinutes(90)).toBe("1h 30m");
    expect(formatMinutes(61)).toBe("1h 1m");
  });
});
