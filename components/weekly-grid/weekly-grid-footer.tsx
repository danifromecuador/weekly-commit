import { DAY_IDS } from "@/lib/weekly-grid/constants";
import { formatMinutes } from "@/lib/weekly-grid/format-minutes";
import type { DayId } from "@/lib/weekly-grid/types";

type WeeklyGridFooterProps = {
  colTotals: Record<DayId, number>;
  weekTotal: number;
};

export function WeeklyGridFooter({ colTotals, weekTotal }: WeeklyGridFooterProps) {
  return (
    <tfoot>
      <tr>
        <th className="border border-zinc-400 p-2 text-left" scope="row">
          Totals
        </th>
        <td className="border border-zinc-400 p-2 text-zinc-400">—</td>
        {DAY_IDS.map((day) => (
          <td
            key={day}
            className="border border-zinc-400 p-2 text-center tabular-nums"
          >
            {formatMinutes(colTotals[day])}
          </td>
        ))}
        <td className="border border-zinc-400 p-2 text-center font-medium tabular-nums">
          {formatMinutes(weekTotal)}
        </td>
      </tr>
    </tfoot>
  );
}
