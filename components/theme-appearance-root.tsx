"use client";

import { useLayoutEffect } from "react";

import {
  applyLocaleToDocument,
  readPersistedLocaleFromLocalStorage,
} from "@/lib/i18n";
import { syncThemeFontStylesheet } from "@/lib/theme-fonts";
import {
  applyThemeAndAppearanceToDocument,
  readPersistedThemeAppearanceFromLocalStorage,
} from "@/lib/themes";
import { useWeeklyGridStore } from "@/store";

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
  const locale = useWeeklyGridStore((s) => s.locale);

  useLayoutEffect(() => {
    const fromDisk = readPersistedThemeAppearanceFromLocalStorage();
    const persistedLocale = readPersistedLocaleFromLocalStorage();
    applyThemeAndAppearanceToDocument(fromDisk.themeId, fromDisk.appearance);
    applyLocaleToDocument(persistedLocale);
    syncThemeFontStylesheet(fromDisk.themeId);
  }, []);

  useLayoutEffect(() => {
    if (!useWeeklyGridStore.persist.hasHydrated()) return;
    applyThemeAndAppearanceToDocument(themeId, appearance);
  }, [themeId, appearance]);

  useLayoutEffect(() => {
    if (!useWeeklyGridStore.persist.hasHydrated()) return;
    applyLocaleToDocument(locale);
  }, [locale]);

  return (
    <div
      className="wc-theme-root flex w-full flex-1 flex-col"
      data-appearance={appearance === "dark" ? "dark" : undefined}
    >
      {children}
    </div>
  );
}
