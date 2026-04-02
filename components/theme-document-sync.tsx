"use client";

import { useLayoutEffect } from "react";

import {
  applyThemeAndAppearanceToDocument,
  readPersistedThemeAppearanceFromLocalStorage,
} from "@/lib/themes";
import { useWeeklyGridStore } from "@/lib/weekly-grid/store";

/**
 * React hydration can drop `data-appearance` / mismatch `data-theme` on `<html>`
 * because the root layout does not own those attributes from client state.
 * Re-apply from localStorage after mount, then keep DOM aligned with the store
 * once persist has rehydrated.
 */
export function ThemeDocumentSync() {
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

  return null;
}
