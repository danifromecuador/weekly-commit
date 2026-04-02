import { describe, expect, it } from "vitest";

import { emptyDoneByDay } from "@/store/slices/activities-slice";
import {
  DEFAULT_APPEARANCE,
  DEFAULT_THEME_ID,
} from "@/lib/themes";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import type { ActivityRow } from "@/lib/weekly-grid/types";

import { mergeWeeklyCommitPersistedState } from "./merge-persisted-state";
import type { WeeklyCommitState } from "./types";

function noopActions(): Pick<
  WeeklyCommitState,
  | "setTheme"
  | "setAppearance"
  | "setLocale"
  | "addActivity"
  | "removeActivity"
  | "setActivityName"
  | "setActivityDuration"
  | "toggleDayCompletion"
> {
  return {
    setTheme: () => {},
    setAppearance: () => {},
    setLocale: () => {},
    addActivity: () => null,
    removeActivity: () => {},
    setActivityName: () => {},
    setActivityDuration: () => {},
    toggleDayCompletion: () => {},
  };
}

function baseCurrent(over: Partial<WeeklyCommitState> = {}): WeeklyCommitState {
  return {
    themeId: DEFAULT_THEME_ID,
    appearance: DEFAULT_APPEARANCE,
    locale: DEFAULT_LOCALE,
    activities: [],
    ...noopActions(),
    ...over,
  };
}

function namedRow(name: string): ActivityRow {
  return {
    id: "r1",
    name,
    durationMinutes: 30,
    doneByDay: emptyDoneByDay(),
  };
}

describe("mergeWeeklyCommitPersistedState", () => {
  it("returns a copy of current state when persisted is null", () => {
    const current = baseCurrent({ activities: [namedRow("Keep")] });
    const merged = mergeWeeklyCommitPersistedState(null, current);
    expect(merged).not.toBe(current);
    expect(merged.themeId).toBe(current.themeId);
    expect(merged.activities).toEqual(current.activities);
  });

  it("returns current when persisted is not an object", () => {
    const current = baseCurrent();
    expect(mergeWeeklyCommitPersistedState("oops", current).themeId).toBe(
      current.themeId,
    );
    expect(mergeWeeklyCommitPersistedState(42, current).appearance).toBe(
      current.appearance,
    );
  });

  it("parses themeId and appearance from persisted object", () => {
    const current = baseCurrent();
    const merged = mergeWeeklyCommitPersistedState(
      { themeId: "graphite", appearance: "dark" },
      current,
    );
    expect(merged.themeId).toBe("graphite");
    expect(merged.appearance).toBe("dark");
  });

  it("parses locale from persisted object", () => {
    const current = baseCurrent();
    const merged = mergeWeeklyCommitPersistedState({ locale: "es" }, current);
    expect(merged.locale).toBe("es");
  });

  it("falls back locale when persisted is invalid", () => {
    const current = baseCurrent({ locale: "es" });
    const merged = mergeWeeklyCommitPersistedState({ locale: "pt" }, current);
    expect(merged.locale).toBe(DEFAULT_LOCALE);
  });

  it("falls back theme when invalid", () => {
    const merged = mergeWeeklyCommitPersistedState(
      { themeId: "unknown" },
      baseCurrent(),
    );
    expect(merged.themeId).toBe(DEFAULT_THEME_ID);
  });

  it("always applies parseAppearance (default when missing)", () => {
    const current = baseCurrent({ appearance: "dark" });
    const merged = mergeWeeklyCommitPersistedState({}, current);
    expect(merged.appearance).toBe(DEFAULT_APPEARANCE);
  });

  it("filters draft activities and keeps named rows", () => {
    const current = baseCurrent();
    const merged = mergeWeeklyCommitPersistedState(
      {
        activities: [
          namedRow("OK"),
          { ...namedRow(""), name: "   ", id: "draft" },
        ],
      },
      current,
    );
    expect(merged.activities).toHaveLength(1);
    expect(merged.activities[0]!.name).toBe("OK");
  });

  it("leaves activities unchanged when persisted.activities is not an array", () => {
    const keep = [namedRow("Only")];
    const current = baseCurrent({ activities: keep });
    const merged = mergeWeeklyCommitPersistedState(
      { activities: "nope" as unknown as ActivityRow[] },
      current,
    );
    expect(merged.activities).toEqual(keep);
  });

  it("preserves action methods from current state", () => {
    const fn = () => {};
    const current = baseCurrent({ setTheme: fn });
    const merged = mergeWeeklyCommitPersistedState({ themeId: "graphite" }, current);
    expect(merged.setTheme).toBe(fn);
  });
});
