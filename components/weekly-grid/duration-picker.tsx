"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
  DURATION_OPTIONS,
  type DurationMinutes,
} from "@/lib/weekly-grid/constants";

type DurationPickerProps = {
  value: DurationMinutes | null;
  onChange: (minutes: DurationMinutes) => void;
};

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, minWidth: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedLabel =
    value == null
      ? "Select duration"
      : (DURATION_OPTIONS.find((o) => o.minutes === value)?.label ??
        "Select duration");

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: r.bottom + 4,
      left: r.left,
      minWidth: Math.max(r.width, 9 * 16),
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
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

  const pick = (minutes: DurationMinutes) => {
    onChange(minutes);
    setOpen(false);
  };

  const menu =
    open && mounted ? (
      <ul
        ref={menuRef}
        id={menuId}
        role="listbox"
        aria-label="Duration per session"
        className="wc-theme-menu wc-menu-popover fixed z-[100]"
        style={{
          top: menuPos.top,
          left: menuPos.left,
          minWidth: menuPos.minWidth,
        }}
      >
        {DURATION_OPTIONS.map((opt) => (
          <li key={opt.minutes} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === opt.minutes}
              className="wc-theme-option"
              onClick={() => pick(opt.minutes)}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div className="min-w-0">
      <button
        ref={btnRef}
        type="button"
        className={
          value == null
            ? "wc-duration-trigger wc-duration-trigger--placeholder"
            : "wc-duration-trigger"
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Duration per session"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block truncate text-left">{selectedLabel}</span>
      </button>
      {menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
