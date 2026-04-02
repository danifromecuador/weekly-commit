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
    <div className="min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <table className="wc-table min-w-[36rem]">
      <WeeklyGridHeader />
      <tbody>
        {activities.length === 0 ? (
          <tr>
            <td colSpan={colCount} className="wc-td wc-td-muted">
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
          <td colSpan={colCount} className="wc-td">
            <button
              type="button"
              className="wc-btn"
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
    </div>
  );
}
