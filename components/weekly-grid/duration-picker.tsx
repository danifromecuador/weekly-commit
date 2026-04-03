"use client";

import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { getMessages } from "@/lib/messages";
import {
  DURATION_OPTIONS,
  type DurationMinutes,
} from "@/lib/weekly-grid/constants";
import { useWeeklyGridStore } from "@/store";

type DurationPickerProps = {
  value: DurationMinutes | null;
  onChange: (minutes: DurationMinutes) => void;
};

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, minWidth: 0 });

  const canUseDom = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const selectedLabel =
    value == null
      ? m.grid.selectDuration
      : (DURATION_OPTIONS.find((o) => o.minutes === value)?.label ??
        m.grid.selectDuration);

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
    open && canUseDom ? (
      <ul
        ref={menuRef}
        id={menuId}
        role="listbox"
        aria-label={m.grid.durationPerSession}
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
        aria-label={m.grid.durationPerSession}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="block truncate text-left">{selectedLabel}</span>
          <ChevronDown className="size-3.5 shrink-0 opacity-80" strokeWidth={2.25} aria-hidden />
        </span>
      </button>
      {menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
