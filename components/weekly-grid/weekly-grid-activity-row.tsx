"use client";

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
  const showNameInput =
    !activity.name.trim() || editingActivityId === activity.id;

  return (
    <tr className="group">
      <td className="border border-zinc-400 p-1 align-middle">
        <div className="flex items-center gap-1">
          {showNameInput ? (
            <input
              className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-1 py-0.5 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
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
              className="min-w-0 flex-1 cursor-text rounded border border-transparent px-1 py-0.5 text-left outline-none hover:bg-zinc-100/80 focus-visible:ring-1 focus-visible:ring-zinc-400"
              onClick={() => onStartNameEdit(activity.id)}
            >
              {activity.name}
            </button>
          )}
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded border border-zinc-300 px-2 py-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            onClick={() => onRemove(activity.id)}
            aria-label="Remove activity"
          >
            Delete
          </button>
        </div>
      </td>
      <td className="border border-zinc-400 p-1 align-middle">
        <select
          className="w-full rounded border border-zinc-300 px-1 py-0.5"
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
        <td
          key={day}
          className="border border-zinc-400 p-1 text-center align-middle"
        >
          <input
            type="checkbox"
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
      <td className="border border-zinc-400 p-2 text-center align-middle tabular-nums">
        {formatMinutes(rowTotal(activity))}
      </td>
    </tr>
  );
}
