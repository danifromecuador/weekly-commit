"use client";

import { useSyncExternalStore } from "react";

import {
  DEFAULT_THEME_ID,
  THEME_OPTIONS,
  applyTheme,
  parseStoredTheme,
  readStoredTheme,
  subscribeTheme,
} from "@/lib/themes";

export function ThemeSelector() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readStoredTheme,
    () => DEFAULT_THEME_ID,
  );

  return (
    <label className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
      <span className="wc-muted-ink text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
        Theme
      </span>
      <select
        suppressHydrationWarning
        className="wc-select max-w-[12rem] cursor-pointer py-1.5 text-left text-sm normal-case tracking-normal"
        value={theme}
        onChange={(e) => {
          const next = parseStoredTheme(e.target.value);
          applyTheme(next);
        }}
        aria-label="Choose color theme"
      >
        {THEME_OPTIONS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
