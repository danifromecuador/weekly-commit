import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WeeklyCommitApp } from "@/components/weekly-commit-app";

vi.mock("@/store", () => ({
  useWeeklyGridStore: (selector: (state: { locale: "en" | "es"; loadActivities: () => void }) => unknown) =>
    selector({ locale: "en", loadActivities: () => {} }),
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

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: vi.fn(),
  },
}));

describe("Page header controls", () => {
  it("renders controls in language, appearance, theme order", () => {
    render(<WeeklyCommitApp initialActivities={[]} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Language",
      "Appearance",
      "Theme",
      "Sign out",
    ]);
  });
});


