"use client";

import { Moon, Sun } from "lucide-react";

import { useWeeklyGridStore } from "@/lib/weekly-grid/store";

export function AppearanceToggle() {
  const appearance = useWeeklyGridStore((s) => s.appearance);
  const setAppearance = useWeeklyGridStore((s) => s.setAppearance);
  const isDark = appearance === "dark";

  return (
    <button
      type="button"
      className="wc-btn-icon inline-flex items-center justify-center"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setAppearance(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="size-[1.125rem] shrink-0" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="size-[1.125rem] shrink-0" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
