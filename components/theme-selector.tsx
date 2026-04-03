"use client";

import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getMessages } from "@/lib/messages";
import { THEME_OPTIONS, type ThemeId } from "@/lib/themes";
import { useWeeklyGridStore } from "@/store";

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const theme = useWeeklyGridStore((s) => s.themeId);
  const locale = useWeeklyGridStore((s) => s.locale);
  const setTheme = useWeeklyGridStore((s) => s.setTheme);
  const m = getMessages(locale);

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
    setTheme(id);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex justify-center sm:justify-end"
    >
      <button
        type="button"
        className="wc-btn-icon inline-flex items-center justify-center"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "theme-picker" : undefined}
        aria-label={m.controls.chooseColorTheme}
        title={m.controls.theme}
        onClick={() => setOpen((v) => !v)}
      >
        <Palette className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      </button>
      {open ? (
        <ul
          id="theme-picker"
          role="listbox"
          aria-label={m.controls.chooseColorTheme}
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
