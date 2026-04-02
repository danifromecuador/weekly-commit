"use client";

import { useMemo, useState } from "react";

import { DAY_IDS } from "@/lib/weekly-grid/constants";
import { useWeeklyGridStore } from "@/lib/weekly-grid/store";
import { columnTotals, grandTotal } from "@/lib/weekly-grid/totals";
import { isActivityComplete } from "@/lib/weekly-grid/types";

export function useWeeklyGrid() {
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null,
  );

  const activities = useWeeklyGridStore((s) => s.activities);
  const addActivityFromStore = useWeeklyGridStore((s) => s.addActivity);
  const addActivity = () => {
    const newId = addActivityFromStore();
    if (newId != null) setEditingActivityId(newId);
  };
  const removeActivity = useWeeklyGridStore((s) => s.removeActivity);
  const setActivityName = useWeeklyGridStore((s) => s.setActivityName);
  const setActivityDuration = useWeeklyGridStore((s) => s.setActivityDuration);
  const toggleDayCompletion = useWeeklyGridStore((s) => s.toggleDayCompletion);

  const colTotals = useMemo(() => columnTotals(activities), [activities]);
  const weekTotal = useMemo(() => grandTotal(activities), [activities]);

  const colCount = 2 + DAY_IDS.length + 1;
  const canAddActivity = activities.every(isActivityComplete);

  return {
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
  };
}
