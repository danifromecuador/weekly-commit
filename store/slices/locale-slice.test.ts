import { create } from "zustand";
import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_LOCALE } from "@/lib/i18n";
import { createActivitiesSlice } from "./activities-slice";
import { createLocaleSlice } from "./locale-slice";
import { createThemeSlice } from "./theme-slice";
import type { WeeklyCommitState } from "../types";

function createFullStore() {
  return create<WeeklyCommitState>()((...args) => ({
    ...createThemeSlice(...args),
    ...createLocaleSlice(...args),
    ...createActivitiesSlice(...args),
  }));
}

describe("createLocaleSlice", () => {
  afterEach(() => {
    document.documentElement.lang = "en";
  });

  it("initial state is english", () => {
    const useStore = createFullStore();
    expect(useStore.getState().locale).toBe(DEFAULT_LOCALE);
  });

  it("setLocale updates state", () => {
    const useStore = createFullStore();
    useStore.getState().setLocale("es");
    expect(useStore.getState().locale).toBe("es");
    expect(document.documentElement.lang).toBe("es");
  });
});

