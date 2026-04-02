"use client";

import { Trash2 } from "lucide-react";
import { useId, useRef } from "react";

import {
  DAY_IDS,
  DAY_LABELS,
  DURATION_OPTIONS,
  type DurationMinutes,
} from "@/lib/weekly-grid/constants";
import { formatMinutes } from "@/lib/weekly-grid/format-minutes";
import { rowTotal } from "@/lib/weekly-grid/totals";
import {
  type ActivityRow,
  type DayId,
  isActivityComplete,
} from "@/lib/weekly-grid/types";

type WeeklyGridActivityRowProps = {
  activity: ActivityRow;
  editingActivityId: string | null;
  onExitNameEdit: () => void;
  onStartNameEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDurationChange: (id: string, durationMinutes: DurationMinutes) => void;
  onToggleDay: (id: string, day: DayId) => void;
};

export function WeeklyGridActivityRow({
  activity,
  editingActivityId,
  onExitNameEdit,
  onStartNameEdit,
  onRemove,
  onNameChange,
  onDurationChange,
  onToggleDay,
}: WeeklyGridActivityRowProps) {
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogTitleId = useId();

  const showNameInput =
    !activity.name.trim() || editingActivityId === activity.id;

  const showDeleteControl =
    !showNameInput ||
    (!activity.name.trim() && editingActivityId !== activity.id);

  return (
    <tr className="group">
      <td className="wc-td">
        <div className="flex items-center gap-1">
          {showNameInput ? (
            <input
              className="wc-input"
              value={activity.name}
              onChange={(e) => onNameChange(activity.id, e.target.value)}
              onBlur={onExitNameEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              aria-label="Activity name"
              autoFocus={editingActivityId === activity.id}
            />
          ) : (
            <button
              type="button"
              className="wc-goal-button"
              onClick={() => onStartNameEdit(activity.id)}
            >
              {activity.name}
            </button>
          )}
          {showDeleteControl ? (
            <button
              type="button"
              className="wc-btn-delete inline-flex items-center justify-center"
              onClick={() => deleteDialogRef.current?.showModal()}
              aria-label="Remove activity"
              title="Remove activity"
            >
              <Trash2 className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          ) : null}
          <dialog
            ref={deleteDialogRef}
            className="wc-dialog"
            aria-labelledby={deleteDialogTitleId}
          >
            <h2 id={deleteDialogTitleId} className="text-sm font-semibold">
              Remove this goal?
            </h2>
            <p className="wc-muted-ink mt-2 text-sm leading-snug">
              {activity.name.trim() ? (
                <>
                  <span className="font-medium">
                    &ldquo;{activity.name.trim()}&rdquo;
                  </span>{" "}
                  will be removed. This cannot be undone.
                </>
              ) : (
                <>This row will be removed. This cannot be undone.</>
              )}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="wc-btn"
                onClick={() => deleteDialogRef.current?.close()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="wc-btn-danger"
                onClick={() => {
                  onRemove(activity.id);
                  deleteDialogRef.current?.close();
                }}
              >
                Remove
              </button>
            </div>
          </dialog>
        </div>
      </td>
      <td className="wc-td">
        <select
          className="wc-select"
          value={activity.durationMinutes ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return;
            onDurationChange(activity.id, Number(raw) as DurationMinutes);
          }}
          aria-label="Duration per session"
        >
          <option value="" disabled>
            Select duration
          </option>
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.minutes} value={opt.minutes}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      {DAY_IDS.map((day) => (
        <td key={day} className="wc-td text-center">
          <input
            type="checkbox"
            className="wc-checkbox"
            checked={activity.doneByDay[day]}
            disabled={!isActivityComplete(activity)}
            onChange={() => onToggleDay(activity.id, day)}
            aria-label={`${DAY_LABELS[day]} completed`}
            title={
              isActivityComplete(activity)
                ? undefined
                : "Set a goal name and duration first"
            }
          />
        </td>
      ))}
      <td className="wc-td wc-num">{formatMinutes(rowTotal(activity))}</td>
    </tr>
  );
}
