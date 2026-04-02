"use client";

import { useLayoutEffect } from "react";

import {
  applyThemeAndAppearanceToDocument,
  readPersistedThemeAppearanceFromLocalStorage,
} from "@/lib/themes";
import { useWeeklyGridStore } from "@/lib/weekly-grid/store";

/**
 * Keeps `data-theme` / `data-appearance` on <html> in sync with persist + store
 * (React can strip unknown `data-*` on the document element on hydrate).
 * Mirrors appearance on this wrapper so CSS can use `html:has(.wc-theme-root…)`.
 */
export function ThemeAppearanceRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeId = useWeeklyGridStore((s) => s.themeId);
  const appearance = useWeeklyGridStore((s) => s.appearance);

  useLayoutEffect(() => {
    const fromDisk = readPersistedThemeAppearanceFromLocalStorage();
    applyThemeAndAppearanceToDocument(fromDisk.themeId, fromDisk.appearance);
  }, []);

  useLayoutEffect(() => {
    if (!useWeeklyGridStore.persist.hasHydrated()) return;
    applyThemeAndAppearanceToDocument(themeId, appearance);
  }, [themeId, appearance]);

  return (
    <div
      className="wc-theme-root flex w-full flex-1 flex-col"
      data-appearance={appearance === "dark" ? "dark" : undefined}
    >
      {children}
    </div>
  );
}
