"use client";

import { useWeeklyGrid } from "./use-weekly-grid";
import { WeeklyGridActivityRow } from "./weekly-grid-activity-row";
import { WeeklyGridFooter } from "./weekly-grid-footer";
import { WeeklyGridHeader } from "./weekly-grid-header";

export function WeeklyGridRoot() {
  const {
    editingActivityId,
    setEditingActivityId,
    activities,
    addActivity,
    removeActivity,
    setActivityName,
    setActivityDuration,
    toggleDayCompletion,
    colTotals,
    weekTotal,
    colCount,
    canAddActivity,
  } = useWeeklyGrid();

  return (
    <table className="w-full border-collapse border border-zinc-400 text-sm">
      <WeeklyGridHeader />
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
            <WeeklyGridActivityRow
              key={activity.id}
              activity={activity}
              editingActivityId={editingActivityId}
              onExitNameEdit={() => setEditingActivityId(null)}
              onStartNameEdit={setEditingActivityId}
              onRemove={removeActivity}
              onNameChange={setActivityName}
              onDurationChange={setActivityDuration}
              onToggleDay={toggleDayCompletion}
            />
          ))
        )}
        <tr>
          <td colSpan={colCount} className="border border-zinc-400 p-2">
            <button
              type="button"
              className="cursor-pointer rounded border border-zinc-400 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
      <WeeklyGridFooter colTotals={colTotals} weekTotal={weekTotal} />
    </table>
  );
}
