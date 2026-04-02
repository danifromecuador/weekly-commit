import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { WeeklyCommitState } from "@/store/types";
import { useWeeklyGridStore } from "@/store";

import { AppearanceToggle } from "./appearance-toggle";

vi.mock("@/store", async () => {
  const { create } = await import("zustand");
  const { createThemeSlice } = await import("@/store/slices/theme-slice");
  const { createActivitiesSlice } = await import(
    "@/store/slices/activities-slice",
  );
  const useWeeklyGridStore = create<WeeklyCommitState>()((...args) => ({
    ...createThemeSlice(...args),
    ...createActivitiesSlice(...args),
  }));
  return { useWeeklyGridStore };
});

describe("AppearanceToggle", () => {
  beforeEach(() => {
    useWeeklyGridStore.setState({
      appearance: "light",
    });
  });

  it("toggles dark/light on click and updates aria-label", async () => {
    const user = userEvent.setup();
    render(<AppearanceToggle />);
    const btn = screen.getByRole("button", { name: /Switch to dark mode/i });
    await user.click(btn);
    expect(useWeeklyGridStore.getState().appearance).toBe("dark");
    expect(
      screen.getByRole("button", { name: /Switch to light mode/i }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /Switch to light mode/i }),
    );
    expect(useWeeklyGridStore.getState().appearance).toBe("light");
  });
});
