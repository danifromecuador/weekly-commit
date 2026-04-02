"use client";

import { getMessages } from "@/lib/messages";
import { DAY_IDS } from "@/lib/weekly-grid/constants";
import { useWeeklyGridStore } from "@/store";

export function WeeklyGridHeader() {
  const locale = useWeeklyGridStore((s) => s.locale);
  const m = getMessages(locale);

  return (
    <thead>
      <tr>
        <th className="wc-th text-left">{m.grid.goal}</th>
        <th className="wc-th text-left">
          <span className="sm:hidden">{m.grid.timeShort}</span>
          <span className="hidden sm:inline">{m.grid.duration}</span>
        </th>
        {DAY_IDS.map((day) => (
          <th
            key={day}
            className="wc-th wc-th-day text-center"
            scope="col"
            aria-label={m.dayLabels[day]}
          >
            {m.dayInitials[day]}
          </th>
        ))}
        <th className="wc-th text-center">{m.grid.total}</th>
      </tr>
    </thead>
  );
}
