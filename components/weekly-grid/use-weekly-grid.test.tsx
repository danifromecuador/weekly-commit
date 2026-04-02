import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { WeeklyCommitState } from "@/store/types";
import { useWeeklyGridStore } from "@/store";

import { useWeeklyGrid } from "./use-weekly-grid";

vi.mock("@/store", async () => {
  const { create } = await import("zustand");
  const { createThemeSlice } = await import("@/store/slices/theme-slice");
  const { createLocaleSlice } = await import("@/store/slices/locale-slice");
  const { createActivitiesSlice } = await import(
    "@/store/slices/activities-slice",
  );
  const useWeeklyGridStore = create<WeeklyCommitState>()((...args) => ({
    ...createThemeSlice(...args),
    ...createLocaleSlice(...args),
    ...createActivitiesSlice(...args),
  }));
  return { useWeeklyGridStore };
});

describe("useWeeklyGrid", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", { randomUUID: () => "hook-uuid-1" });
    useWeeklyGridStore.setState({
      activities: [],
      appearance: "light",
      themeId: "paper-planner",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("canAddActivity is false when a draft row exists", () => {
    useWeeklyGridStore.getState().addActivity();
    const { result } = renderHook(() => useWeeklyGrid());
    expect(result.current.canAddActivity).toBe(false);
  });

  it("canAddActivity is true when all rows have names", () => {
    useWeeklyGridStore.getState().addActivity();
    useWeeklyGridStore.getState().setActivityName("hook-uuid-1", "Run");
    const { result } = renderHook(() => useWeeklyGrid());
    expect(result.current.canAddActivity).toBe(true);
  });

  it("addActivity sets editing id when a new row is created", () => {
    const { result } = renderHook(() => useWeeklyGrid());
    act(() => {
      result.current.addActivity();
    });
    expect(result.current.editingActivityId).toBe("hook-uuid-1");
  });

  it("exposes derived totals from activities", () => {
    useWeeklyGridStore.getState().addActivity();
    useWeeklyGridStore.getState().setActivityName("hook-uuid-1", "Gym");
    useWeeklyGridStore.getState().setActivityDuration("hook-uuid-1", 30);
    const { result } = renderHook(() => useWeeklyGrid());
    expect(result.current.durationColumnTotal).toBe(30);
    expect(result.current.weekTotal).toBe(0);
  });
});
