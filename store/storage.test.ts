import { describe, expect, it } from "vitest";

import { noopStorage } from "./storage";

describe("noopStorage", () => {
  it("getItem always returns null", () => {
    expect(noopStorage.getItem("k")).toBeNull();
  });

  it("setItem and removeItem do not throw", () => {
    expect(() => noopStorage.setItem("x", "y")).not.toThrow();
    expect(() => noopStorage.removeItem("x")).not.toThrow();
  });
});
