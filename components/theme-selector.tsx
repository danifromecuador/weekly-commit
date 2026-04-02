"use client";

import { useEffect, useRef, useState } from "react";
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
        <div
          id="theme-picker"
          className="absolute end-0 top-full z-20 mt-2 min-w-[12.5rem] p-1 shadow-none"
          style={{
            background: "var(--theme-page)",
            borderRadius: "var(--wc-radius-ui)",
          }}
        >
          <select
            suppressHydrationWarning
            className="wc-select w-full cursor-pointer py-1.5 text-left text-sm normal-case tracking-normal"
            value={theme}
            onChange={(e) => {
              const next = parseStoredTheme(e.target.value);
              applyTheme(next);
              setOpen(false);
            }}
            aria-label="Choose color theme"
          >
            {THEME_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
