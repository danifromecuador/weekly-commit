"use client";

import { Plus } from "lucide-react";

import { getMessages } from "@/lib/messages";
import { DAY_IDS } from "@/lib/weekly-grid/constants";
import { useWeeklyGridStore } from "@/store";
import { useWeeklyGrid } from "./use-weekly-grid";
import { WeeklyGridActivityRow } from "./weekly-grid-activity-row";
import { WeeklyGridFooter } from "./weekly-grid-footer";
import { WeeklyGridHeader } from "./weekly-grid-header";

export function WeeklyGridRoot() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);
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
    durationColumnTotal,
    colCount,
    canAddActivity,
  } = useWeeklyGrid();

  return (
    <div className="min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <table className="wc-table min-w-[60rem]">
        <colgroup>
          <col className="wc-col-goal" />
          <col className="wc-col-duration" />
          {DAY_IDS.map((day) => (
            <col key={day} className="wc-col-day" />
          ))}
          <col className="wc-col-total" />
        </colgroup>
        <WeeklyGridHeader />
      <tbody>
        {activities.length === 0 ? (
          <tr>
            <td colSpan={colCount} className="wc-td wc-td-muted">
              {m.grid.noActivities}
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
              className="wc-btn-icon inline-flex items-center justify-center"
              disabled={!canAddActivity}
              onClick={() => addActivity()}
              aria-label={m.grid.addActivity}
              title={
                canAddActivity
                  ? m.grid.addActivity
                  : m.grid.addGoalNameFirst
              }
            >
              <Plus className="size-[1.125rem] shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </td>
        </tr>
      </tbody>
      <WeeklyGridFooter
        colTotals={colTotals}
        durationColumnTotal={durationColumnTotal}
        weekTotal={weekTotal}
      />
    </table>
    </div>
  );
}
