import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { WeeklyCommitState } from "@/store/types";
import { useWeeklyGridStore } from "@/store";
import { emptyDoneByDay } from "@/store/slices/activities-slice";

import { WeeklyGridRoot } from "./weekly-grid-root";

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

afterEach(() => {
  cleanup();
});

describe("WeeklyGridRoot empty state", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", { randomUUID: () => "grid-test-uuid-1" });
    useWeeklyGridStore.setState({
      activities: [],
      locale: "en",
      themeId: "paper-planner",
      appearance: "light",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows prompt and Add CTA, not the icon-only add row", () => {
    render(<WeeklyGridRoot />);
    expect(screen.getByText("No activities yet.")).toBeInTheDocument();
    const addCta = screen.getByRole("button", { name: "Add activity" });
    expect(addCta).toHaveClass("wc-btn");
    expect(addCta).toHaveTextContent("Add");
    expect(document.querySelector(".wc-btn-icon")).toBeNull();
  });

  it("uses Spanish strings when locale is es", () => {
    useWeeklyGridStore.setState({ locale: "es" });
    render(<WeeklyGridRoot />);
    expect(screen.getByText("Aún no hay actividades.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Agregar actividad" }),
    ).toHaveTextContent("Agregar");
  });

  it("adds a row when empty-state Add is clicked", async () => {
    const user = userEvent.setup();
    render(<WeeklyGridRoot />);
    await user.click(screen.getByRole("button", { name: "Add activity" }));
    expect(useWeeklyGridStore.getState().activities).toHaveLength(1);
    expect(useWeeklyGridStore.getState().activities[0]!.id).toBe(
      "grid-test-uuid-1",
    );
  });
});

describe("WeeklyGridRoot with activities", () => {
  beforeEach(() => {
    useWeeklyGridStore.setState({
      locale: "en",
      themeId: "paper-planner",
      appearance: "light",
      activities: [
        {
          id: "existing-1",
          name: "Run",
          durationMinutes: 30,
          doneByDay: emptyDoneByDay(),
        },
      ],
    });
  });

  it("shows icon add row and hides empty-state copy", () => {
    render(<WeeklyGridRoot />);
    expect(screen.queryByText("No activities yet.")).not.toBeInTheDocument();
    const iconAdd = document.querySelector(".wc-btn-icon");
    expect(iconAdd).toBeInstanceOf(HTMLButtonElement);
    expect(iconAdd).toHaveAttribute("aria-label", "Add activity");
  });
});
