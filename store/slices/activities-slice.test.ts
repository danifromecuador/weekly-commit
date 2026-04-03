import { create } from "zustand";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createLocaleSlice } from "@/store/slices/locale-slice";
import { createThemeSlice } from "@/store/slices/theme-slice";
import type { WeeklyCommitState } from "@/store/types";

import {
  createActivitiesSlice,
  emptyDoneByDay,
  persistedActivitiesOnly,
} from "./activities-slice";

function createTestStore() {
  return create<WeeklyCommitState>()((...args) => ({
    ...createThemeSlice(...args),
    ...createLocaleSlice(...args),
    ...createActivitiesSlice(...args),
  }));
}

describe("emptyDoneByDay", () => {
  it("exports from module", async () => {
    const { emptyDoneByDay } = await import("./activities-slice");
    const d = emptyDoneByDay();
    expect(d.mon).toBe(false);
    expect(d.sat).toBe(false);
  });
});

describe("persistedActivitiesOnly", () => {
  it("drops rows without a trimmed name", () => {
    const rows = [
      {
        id: "1",
        name: "Real",
        durationMinutes: 15 as const,
        doneByDay: emptyDoneByDay(),
      },
      {
        id: "2",
        name: "",
        durationMinutes: null,
        doneByDay: emptyDoneByDay(),
      },
      {
        id: "3",
        name: "  ",
        durationMinutes: null,
        doneByDay: emptyDoneByDay(),
      },
    ];
    expect(persistedActivitiesOnly(rows)).toHaveLength(1);
  });
});

describe("createActivitiesSlice actions", () => {
  let useStore: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    useStore = createTestStore();
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-fixed-1" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("addActivity appends a draft row and returns its id", () => {
    const id = useStore.getState().addActivity();
    expect(id).toBe("uuid-fixed-1");
    expect(useStore.getState().activities).toHaveLength(1);
    expect(useStore.getState().activities[0]!.name).toBe("");
  });

  it("addActivity returns null when a draft row already exists", () => {
    useStore.getState().addActivity();
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-fixed-2" });
    expect(useStore.getState().addActivity()).toBeNull();
    expect(useStore.getState().activities).toHaveLength(1);
  });

  it("removeActivity removes by id", () => {
    useStore.getState().addActivity();
    useStore.getState().removeActivity("uuid-fixed-1");
    expect(useStore.getState().activities).toHaveLength(0);
  });

  it("setActivityName clears doneByDay when name becomes empty", () => {
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-1", "Run");
    useStore.getState().setActivityDuration("uuid-fixed-1", 30);
    useStore.getState().toggleDayCompletion("uuid-fixed-1", "mon");
    useStore.getState().setActivityName("uuid-fixed-1", "  ");
    const row = useStore.getState().activities[0]!;
    expect(row.doneByDay.mon).toBe(false);
  });

  it("toggleDayCompletion does nothing until activity is complete", () => {
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-1", "Swim");
    useStore.getState().toggleDayCompletion("uuid-fixed-1", "mon");
    expect(useStore.getState().activities[0]!.doneByDay.mon).toBe(false);
  });

  it("toggleDayCompletion toggles when name and duration are set", () => {
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-1", "Swim");
    useStore.getState().setActivityDuration("uuid-fixed-1", 45);
    useStore.getState().toggleDayCompletion("uuid-fixed-1", "tue");
    expect(useStore.getState().activities[0]!.doneByDay.tue).toBe(true);
    useStore.getState().toggleDayCompletion("uuid-fixed-1", "tue");
    expect(useStore.getState().activities[0]!.doneByDay.tue).toBe(false);
  });

  it("setActivityDuration accepts null", () => {
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-1", "X");
    useStore.getState().setActivityDuration("uuid-fixed-1", 60);
    useStore.getState().setActivityDuration("uuid-fixed-1", null);
    expect(useStore.getState().activities[0]!.durationMinutes).toBeNull();
  });

  it("reorderActivities moves a row without mutating row data", () => {
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-1", "First");
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-fixed-2" });
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-2", "Second");
    const beforeFirst = { ...useStore.getState().activities[0]! };
    const beforeSecond = { ...useStore.getState().activities[1]! };
    useStore.getState().reorderActivities("uuid-fixed-2", "uuid-fixed-1");
    const rows = useStore.getState().activities;
    expect(rows).toHaveLength(2);
    expect(rows[0]!.id).toBe("uuid-fixed-2");
    expect(rows[1]!.id).toBe("uuid-fixed-1");
    expect(rows[0]).toEqual(beforeSecond);
    expect(rows[1]).toEqual(beforeFirst);
  });

  it("reorderActivities is a no-op for unknown ids", () => {
    useStore.getState().addActivity();
    useStore.getState().setActivityName("uuid-fixed-1", "Only");
    const before = useStore.getState().activities;
    useStore.getState().reorderActivities("missing", "uuid-fixed-1");
    expect(useStore.getState().activities).toBe(before);
  });
});
