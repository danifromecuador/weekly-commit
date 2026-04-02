import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { WeeklyCommitState } from "@/store/types";
import { useWeeklyGridStore } from "@/store";

import { LanguageToggle } from "./language-toggle";

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

describe("LanguageToggle", () => {
  beforeEach(() => {
    useWeeklyGridStore.setState({ locale: "en" });
  });

  it("toggles en/es on click", async () => {
    const user = userEvent.setup();
    render(<LanguageToggle />);

    const btn = screen.getByRole("button", {
      name: /Switch language to Spanish/i,
    });
    await user.click(btn);
    expect(useWeeklyGridStore.getState().locale).toBe("es");

    await user.click(
      screen.getByRole("button", {
        name: /(Switch language to English|Cambiar idioma a inglés)/i,
      }),
    );
    expect(useWeeklyGridStore.getState().locale).toBe("en");
  });
});

