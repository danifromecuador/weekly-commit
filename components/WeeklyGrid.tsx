"use client";

import {
  DAY_IDS,
  DAY_LABELS,
  DURATION_OPTIONS,
  type DurationMinutes,
} from "@/lib/weekly-grid/constants";
import { useWeeklyGridStore } from "@/lib/weekly-grid/store";
import { columnTotals, grandTotal, rowTotal } from "@/lib/weekly-grid/totals";
import { isActivityComplete } from "@/lib/weekly-grid/types";

function formatMinutes(total: number): string {
  if (total === 0) return "0";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function WeeklyGrid() {
  const activities = useWeeklyGridStore((s) => s.activities);
  const addActivity = useWeeklyGridStore((s) => s.addActivity);
  const removeActivity = useWeeklyGridStore((s) => s.removeActivity);
  const setActivityName = useWeeklyGridStore((s) => s.setActivityName);
  const setActivityDuration = useWeeklyGridStore((s) => s.setActivityDuration);
  const toggleDayCompletion = useWeeklyGridStore((s) => s.toggleDayCompletion);

  const colTotals = columnTotals(activities);
  const weekTotal = grandTotal(activities);

  const colCount = 2 + DAY_IDS.length + 1;
  const canAddActivity = activities.every(isActivityComplete);

  return (
    <table className="w-full border-collapse border border-zinc-400 text-sm">
      <thead>
        <tr>
          <th className="border border-zinc-400 p-2 text-left">Goal</th>
          <th className="border border-zinc-400 p-2 text-left">Duration</th>
          {DAY_IDS.map((day) => (
            <th key={day} className="border border-zinc-400 p-2 text-center">
              {DAY_LABELS[day]}
            </th>
          ))}
          <th className="border border-zinc-400 p-2 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {activities.length === 0 ? (
          <tr>
            <td
              colSpan={colCount}
              className="border border-zinc-400 p-4 text-zinc-500"
            >
              No activities yet. Use the button below to add one.
            </td>
          </tr>
        ) : (
          activities.map((activity) => (
            <tr key={activity.id}>
              <td className="border border-zinc-400 p-1 align-middle">
                <div className="flex gap-1">
                  <input
                    className="min-w-0 flex-1 rounded border border-zinc-300 px-1 py-0.5"
                    value={activity.name}
                    onChange={(e) =>
                      setActivityName(activity.id, e.target.value)
                    }
                    aria-label="Activity name"
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded border border-zinc-300 px-2 py-0.5"
                    onClick={() => removeActivity(activity.id)}
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
                    setActivityDuration(
                      activity.id,
                      Number(raw) as DurationMinutes,
                    );
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
                    onChange={() => toggleDayCompletion(activity.id, day)}
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
          ))
        )}
        <tr>
          <td colSpan={colCount} className="border border-zinc-400 p-2">
            <button
              type="button"
              className="rounded border border-zinc-400 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canAddActivity}
              onClick={() => addActivity()}
              title={
                canAddActivity
                  ? undefined
                  : "Complete goal name and duration on every row first"
              }
            >
              Add activity
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th className="border border-zinc-400 p-2 text-left" scope="row">
            Totals
          </th>
          <td className="border border-zinc-400 p-2 text-zinc-400">—</td>
          {DAY_IDS.map((day) => (
            <td
              key={day}
              className="border border-zinc-400 p-2 text-center tabular-nums"
            >
              {formatMinutes(colTotals[day])}
            </td>
          ))}
          <td className="border border-zinc-400 p-2 text-center font-medium tabular-nums">
            {formatMinutes(weekTotal)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
