"use client";

import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { Check, GripVertical, Trash2 } from "lucide-react";
import { useId, useRef, type CSSProperties } from "react";

import { DurationPicker } from "@/components/weekly-grid/duration-picker";
import { getMessages } from "@/lib/messages";
import { DAY_IDS } from "@/lib/weekly-grid/constants";
import type { DurationMinutes } from "@/lib/weekly-grid/constants";
import { formatMinutes } from "@/lib/weekly-grid/format-minutes";
import { rowTotal } from "@/lib/weekly-grid/totals";
import {
  type ActivityRow,
  type DayId,
  isActivityComplete,
} from "@/lib/weekly-grid/types";
import { useWeeklyGridStore } from "@/store";

type WeeklyGridActivityRowProps = {
  activity: ActivityRow;
  editingActivityId: string | null;
  onExitNameEdit: () => void;
  onStartNameEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDurationChange: (id: string, durationMinutes: DurationMinutes) => void;
  onToggleDay: (id: string, day: DayId) => void;
  sortable?: {
    rowRef: (node: HTMLElement | null) => void;
    rowStyle: CSSProperties;
    isDragging: boolean;
  };
  goalDragHandle?: {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
  };
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
  sortable,
  goalDragHandle,
}: WeeklyGridActivityRowProps) {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogTitleId = useId();

  const showNameInput =
    !activity.name.trim() || editingActivityId === activity.id;

  const showDeleteControl =
    !showNameInput ||
    (!activity.name.trim() && editingActivityId !== activity.id);

  return (
    <tr
      ref={sortable?.rowRef}
      style={sortable?.rowStyle}
      className={sortable?.isDragging ? "wc-tr-sortable-dragging" : undefined}
    >
      <td className="wc-td">
        <div className="wc-goal-cell-inner group flex min-w-0 items-center gap-1">
          {goalDragHandle ? (
            <button
              type="button"
              className="wc-drag-handle inline-flex shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
              {...goalDragHandle.listeners}
              {...goalDragHandle.attributes}
              aria-label={m.grid.dragReorderGoal}
              title={m.grid.dragReorderGoal}
            >
              <GripVertical className="size-3.5" strokeWidth={2} aria-hidden />
            </button>
          ) : null}
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
              aria-label={m.grid.activityName}
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
              aria-label={m.grid.removeActivity}
              title={m.grid.removeActivity}
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
              {m.grid.removeThisGoalQuestion}
            </h2>
            <p className="wc-muted-ink mt-2 text-sm leading-snug">
              {activity.name.trim() ? (
                <>
                  <span className="font-medium">
                    &ldquo;{activity.name.trim()}&rdquo;
                  </span>{" "}
                  {m.grid.removeNamedGoalSuffix}
                </>
              ) : (
                <>{m.grid.removeUnnamedRow}</>
              )}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="wc-btn"
                onClick={() => deleteDialogRef.current?.close()}
              >
                {m.grid.cancel}
              </button>
              <button
                type="button"
                className="wc-btn-danger"
                onClick={() => {
                  onRemove(activity.id);
                  deleteDialogRef.current?.close();
                }}
              >
                {m.grid.remove}
              </button>
            </div>
          </dialog>
        </div>
      </td>
      <td className="wc-td">
        <DurationPicker
          value={activity.durationMinutes}
          onChange={(minutes) => onDurationChange(activity.id, minutes)}
        />
      </td>
      {DAY_IDS.map((day) => (
        <td key={day} className="wc-td wc-td-day wc-td-day-toggle-cell text-center">
          <button
            type="button"
            role="checkbox"
            aria-checked={activity.doneByDay[day]}
            disabled={!isActivityComplete(activity)}
            className="wc-day-toggle"
            onClick={() => onToggleDay(activity.id, day)}
            aria-label={`${m.dayLabels[day]} ${m.grid.completedSuffix}`}
            title={
              isActivityComplete(activity)
                ? undefined
                : m.grid.setGoalNameAndDurationFirst
            }
          >
            {activity.doneByDay[day] ? (
              <Check
                className="wc-day-toggle-check"
                strokeWidth={2.75}
                aria-hidden
              />
            ) : null}
          </button>
        </td>
      ))}
      <td className="wc-td wc-num">{formatMinutes(rowTotal(activity))}</td>
    </tr>
  );
}
