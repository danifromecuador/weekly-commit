"use client";

import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";

import {
  DEFAULT_THEME_ID,
  THEME_OPTIONS,
  applyTheme,
  readStoredTheme,
  subscribeTheme,
  type ThemeId,
} from "@/lib/themes";

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const theme = useSyncExternalStore(
    subscribeTheme,
    readStoredTheme,
    () => DEFAULT_THEME_ID,
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (id: ThemeId) => {
    applyTheme(id);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex justify-center sm:justify-end"
    >
      <button
        type="button"
        className="wc-btn text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "theme-picker" : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        Theme
      </button>
      {open ? (
        <ul
          id="theme-picker"
          role="listbox"
          aria-label="Choose color theme"
          aria-activedescendant={`theme-option-${theme}`}
          className="wc-theme-menu absolute start-1/2 top-full z-20 mt-2 min-w-[min(12.5rem,calc(100vw-2rem))] -translate-x-1/2 sm:start-auto sm:end-0 sm:translate-x-0"
        >
          {THEME_OPTIONS.map((t) => (
            <li key={t.id} role="presentation">
              <button
                type="button"
                role="option"
                id={`theme-option-${t.id}`}
                aria-selected={theme === t.id}
                className="wc-theme-option"
                onClick={() => pick(t.id)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
