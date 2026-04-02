import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DurationPicker } from "./duration-picker";

const mockState = {
  locale: "en" as "en" | "es",
};

vi.mock("@/store", () => {
  return {
    useWeeklyGridStore: (selector: (state: typeof mockState) => unknown) =>
      selector(mockState),
  };
});

describe("DurationPicker", () => {
  beforeEach(() => {
    mockState.locale = "en";
  });

  it("shows short english placeholder and chevron when empty", () => {
    render(<DurationPicker value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button", { name: /Duration per session/i });
    expect(trigger).toHaveTextContent("Select");
    expect(trigger).not.toHaveTextContent("Select duration");
    expect(trigger.querySelector("svg")).not.toBeNull();
  });

  it("shows short spanish placeholder when locale is es", () => {
    mockState.locale = "es";
    render(<DurationPicker value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button", { name: /Duración por sesión/i });
    expect(trigger).toHaveTextContent("Elegir");
    expect(trigger).not.toHaveTextContent("Elegir duración");
  });
});

