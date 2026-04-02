import { create } from "zustand";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  APPEARANCE_CHANGE_EVENT,
  DEFAULT_APPEARANCE,
  DEFAULT_THEME_ID,
  THEME_CHANGE_EVENT,
} from "@/lib/themes";

import { createActivitiesSlice } from "./activities-slice";
import { createLocaleSlice } from "./locale-slice";
import { createThemeSlice } from "./theme-slice";
import type { WeeklyCommitState } from "../types";

vi.mock("@/lib/theme-fonts", () => ({
  syncThemeFontStylesheet: vi.fn(),
}));

function createFullStore() {
  return create<WeeklyCommitState>()((...args) => ({
    ...createThemeSlice(...args),
    ...createLocaleSlice(...args),
    ...createActivitiesSlice(...args),
  }));
}

describe("createThemeSlice", () => {
  let useStore: ReturnType<typeof createFullStore>;

  beforeEach(() => {
    useStore = createFullStore();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.appearance;
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.appearance;
  });

  it("setTheme updates state and DOM data-theme", () => {
    const spy = vi.spyOn(window, "dispatchEvent");
    useStore.getState().setTheme("graphite");
    expect(useStore.getState().themeId).toBe("graphite");
    expect(document.documentElement.dataset.theme).toBe("graphite");
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ type: THEME_CHANGE_EVENT }),
    );
  });

  it("setAppearance updates state and data-appearance for dark", () => {
    const spy = vi.spyOn(window, "dispatchEvent");
    useStore.getState().setAppearance("dark");
    expect(useStore.getState().appearance).toBe("dark");
    expect(document.documentElement.dataset.appearance).toBe("dark");
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ type: APPEARANCE_CHANGE_EVENT }),
    );
  });

  it("initial state matches defaults", () => {
    expect(useStore.getState().themeId).toBe(DEFAULT_THEME_ID);
    expect(useStore.getState().appearance).toBe(DEFAULT_APPEARANCE);
  });
});
