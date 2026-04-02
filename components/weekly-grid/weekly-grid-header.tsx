import { DAY_IDS, DAY_LABELS, DAY_LABELS_INITIAL } from "@/lib/weekly-grid/constants";

export function WeeklyGridHeader() {
  return (
    <thead>
      <tr>
        <th className="wc-th text-left">Goal</th>
        <th className="wc-th text-left">
          <span className="sm:hidden">Time</span>
          <span className="hidden sm:inline">Duration</span>
        </th>
        {DAY_IDS.map((day) => (
          <th
            key={day}
            className="wc-th wc-th-day text-center"
            scope="col"
            aria-label={DAY_LABELS[day]}
          >
            {DAY_LABELS_INITIAL[day]}
          </th>
        ))}
        <th className="wc-th text-center">Total</th>
      </tr>
    </thead>
  );
}
