"use client";

import { Moon, Sun } from "lucide-react";

import { getMessages } from "@/lib/messages";
import { useWeeklyGridStore } from "@/store";

export function AppearanceToggle() {
  const appearance = useWeeklyGridStore((s) => s.appearance);
  const locale = useWeeklyGridStore((s) => s.locale);
  const setAppearance = useWeeklyGridStore((s) => s.setAppearance);
  const isDark = appearance === "dark";
  const m = getMessages(locale);

  return (
    <button
      type="button"
      className="wc-btn-icon inline-flex items-center justify-center"
      aria-label={isDark ? m.controls.switchToLightMode : m.controls.switchToDarkMode}
      title={isDark ? m.controls.lightMode : m.controls.darkMode}
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
