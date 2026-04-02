"use client";

import { useWeeklyGridStore } from "@/lib/weekly-grid/store";

/**
 * React may drop `data-*` on `<html>` during hydration. Appearance is mirrored
 * here so `globals.css` can match `html:has(.wc-theme-root[data-appearance])`.
 */
export function ThemeAppearanceRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const appearance = useWeeklyGridStore((s) => s.appearance);

  return (
    <div
      className="wc-theme-root flex w-full flex-1 flex-col"
      data-appearance={appearance === "dark" ? "dark" : undefined}
    >
      {children}
    </div>
  );
}
