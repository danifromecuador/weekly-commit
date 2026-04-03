"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { DurationMinutes } from "@/lib/weekly-grid/constants";
import type { ActivityRow, DayId } from "@/lib/weekly-grid/types";

import { WeeklyGridActivityRow } from "./weekly-grid-activity-row";

export type WeeklyGridSortableActivityRowProps = {
  activity: ActivityRow;
  editingActivityId: string | null;
  onExitNameEdit: () => void;
  onStartNameEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
  onDurationChange: (id: string, durationMinutes: DurationMinutes) => void;
  onToggleDay: (id: string, day: DayId) => void;
};

export function WeeklyGridSortableActivityRow(
  props: WeeklyGridSortableActivityRowProps,
) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.activity.id });

  return (
    <WeeklyGridActivityRow
      {...props}
      sortable={{
        rowRef: setNodeRef,
        rowStyle: {
          transform: CSS.Transform.toString(transform),
          transition,
        },
        isDragging,
      }}
      goalDragHandle={{ attributes, listeners }}
    />
  );
}
