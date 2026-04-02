import { DAY_IDS, DAY_LABELS } from "@/lib/weekly-grid/constants";

export function WeeklyGridHeader() {
  return (
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
  );
}
