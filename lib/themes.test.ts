import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_APPEARANCE,
  DEFAULT_THEME_ID,
  WEEKLY_COMMIT_PERSIST_KEY,
  applyAppearanceToDocument,
  applyThemeAndAppearanceToDocument,
  parseAppearance,
  parseStoredTheme,
  readPersistedThemeAppearanceFromLocalStorage,
} from "./themes";

function clearLocalStorage() {
  const s = globalThis.localStorage;
  if (!s) return;
  if (typeof s.clear === "function") {
    s.clear();
    return;
  }
  const keys: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k) keys.push(k);
  }
  for (const k of keys) s.removeItem(k);
}

describe("parseStoredTheme", () => {
  it("returns known theme ids as-is", () => {
    expect(parseStoredTheme("graphite")).toBe("graphite");
    expect(parseStoredTheme("paper-planner")).toBe("paper-planner");
    expect(parseStoredTheme("botanical-flow")).toBe("botanical-flow");
  });

  it("falls back to default for null, empty, or unknown strings", () => {
    expect(parseStoredTheme(null)).toBe(DEFAULT_THEME_ID);
    expect(parseStoredTheme("")).toBe(DEFAULT_THEME_ID);
    expect(parseStoredTheme("hacker-theme")).toBe(DEFAULT_THEME_ID);
    expect(parseStoredTheme("Paper-Planner")).toBe(DEFAULT_THEME_ID);
  });
});

describe("parseAppearance", () => {
  it("returns dark only for the literal dark string", () => {
    expect(parseAppearance("dark")).toBe("dark");
  });

  it("returns default for anything else", () => {
    expect(parseAppearance(undefined)).toBe(DEFAULT_APPEARANCE);
    expect(parseAppearance("light")).toBe(DEFAULT_APPEARANCE);
    expect(parseAppearance("")).toBe(DEFAULT_APPEARANCE);
    expect(parseAppearance({})).toBe(DEFAULT_APPEARANCE);
    expect(parseAppearance(null)).toBe(DEFAULT_APPEARANCE);
  });
});

describe("applyAppearanceToDocument", () => {
  afterEach(() => {
    delete document.documentElement.dataset.appearance;
  });

  it("sets data-appearance for dark", () => {
    applyAppearanceToDocument("dark");
    expect(document.documentElement.dataset.appearance).toBe("dark");
  });

  it("removes data-appearance for light", () => {
    document.documentElement.dataset.appearance = "dark";
    applyAppearanceToDocument("light");
    expect(document.documentElement.dataset.appearance).toBeUndefined();
  });
});

describe("applyThemeAndAppearanceToDocument", () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.appearance;
  });

  it("sets data-theme and appearance together", () => {
    applyThemeAndAppearanceToDocument("graphite", "dark");
    expect(document.documentElement.dataset.theme).toBe("graphite");
    expect(document.documentElement.dataset.appearance).toBe("dark");
  });
});

describe("readPersistedThemeAppearanceFromLocalStorage", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    globalThis.window = originalWindow as Window & typeof globalThis;
    clearLocalStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.window = originalWindow as Window & typeof globalThis;
    clearLocalStorage();
  });

  it("returns defaults when window is undefined (SSR)", () => {
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    expect(readPersistedThemeAppearanceFromLocalStorage()).toEqual({
      themeId: DEFAULT_THEME_ID,
      appearance: DEFAULT_APPEARANCE,
    });
  });

  it("parses merged zustand persist shape from localStorage", () => {
    globalThis.window = originalWindow as Window & typeof globalThis;
    localStorage.setItem(
      WEEKLY_COMMIT_PERSIST_KEY,
      JSON.stringify({
        state: { themeId: "graphite", appearance: "dark" },
      }),
    );
    expect(readPersistedThemeAppearanceFromLocalStorage()).toEqual({
      themeId: "graphite",
      appearance: "dark",
    });
  });

  it("ignores invalid theme id and uses default", () => {
    globalThis.window = originalWindow as Window & typeof globalThis;
    localStorage.setItem(
      WEEKLY_COMMIT_PERSIST_KEY,
      JSON.stringify({
        state: { themeId: "nope", appearance: "light" },
      }),
    );
    expect(readPersistedThemeAppearanceFromLocalStorage()).toEqual({
      themeId: DEFAULT_THEME_ID,
      appearance: DEFAULT_APPEARANCE,
    });
  });

  it("returns defaults when JSON is invalid", () => {
    globalThis.window = originalWindow as Window & typeof globalThis;
    localStorage.setItem(WEEKLY_COMMIT_PERSIST_KEY, "{not-json");
    expect(readPersistedThemeAppearanceFromLocalStorage()).toEqual({
      themeId: DEFAULT_THEME_ID,
      appearance: DEFAULT_APPEARANCE,
    });
  });

  it("returns defaults when key is missing", () => {
    globalThis.window = originalWindow as Window & typeof globalThis;
    expect(readPersistedThemeAppearanceFromLocalStorage()).toEqual({
      themeId: DEFAULT_THEME_ID,
      appearance: DEFAULT_APPEARANCE,
    });
  });
});

describe("getThemeBootstrapScript", () => {
  it("returns a non-empty inline script string", async () => {
    const { getThemeBootstrapScript } = await import("./themes");
    const script = getThemeBootstrapScript();
    expect(script.length).toBeGreaterThan(100);
    expect(script).toContain("localStorage");
    expect(script).toContain(WEEKLY_COMMIT_PERSIST_KEY);
  });
});
