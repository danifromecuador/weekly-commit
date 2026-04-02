import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Page from "./page";

vi.mock("@/store", () => ({
  useWeeklyGridStore: (selector: (state: { locale: "en" | "es" }) => unknown) =>
    selector({ locale: "en" }),
}));

vi.mock("@/components/language-toggle", () => ({
  LanguageToggle: () => <button type="button">Language</button>,
}));

vi.mock("@/components/appearance-toggle", () => ({
  AppearanceToggle: () => <button type="button">Appearance</button>,
}));

vi.mock("@/components/theme-selector", () => ({
  ThemeSelector: () => <button type="button">Theme</button>,
}));

vi.mock("@/components/WeeklyGrid", () => ({
  WeeklyGrid: () => <div>Grid</div>,
}));

describe("Page header controls", () => {
  it("renders controls in language, appearance, theme order", () => {
    render(<Page />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Language",
      "Appearance",
      "Theme",
    ]);
  });
});

