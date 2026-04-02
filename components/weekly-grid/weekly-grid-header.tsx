import { DAY_IDS, DAY_LABELS } from "@/lib/weekly-grid/constants";

export function WeeklyGridHeader() {
  return (
    <thead>
      <tr>
        <th className="wc-th text-left">Goal</th>
        <th className="wc-th text-left">Duration</th>
        {DAY_IDS.map((day) => (
          <th key={day} className="wc-th text-center">
            {DAY_LABELS[day]}
          </th>
        ))}
        <th className="wc-th text-center">Total</th>
      </tr>
    </thead>
  );
}
