import { DAY_IDS } from "@/lib/weekly-grid/constants";
import { formatMinutes } from "@/lib/weekly-grid/format-minutes";
import type { DayId } from "@/lib/weekly-grid/types";

type WeeklyGridFooterProps = {
  colTotals: Record<DayId, number>;
  durationColumnTotal: number;
  weekTotal: number;
};

export function WeeklyGridFooter({
  colTotals,
  durationColumnTotal,
  weekTotal,
}: WeeklyGridFooterProps) {
  return (
    <tfoot>
      <tr>
        <th className="wc-th text-left" scope="row">
          Totals
        </th>
        <td className="wc-td wc-td-panel wc-num">
          {formatMinutes(durationColumnTotal)}
        </td>
        {DAY_IDS.map((day) => (
          <td key={day} className="wc-td wc-td-panel wc-num">
            {formatMinutes(colTotals[day])}
          </td>
        ))}
        <td className="wc-td wc-td-panel wc-num font-semibold">
          {formatMinutes(weekTotal)}
        </td>
      </tr>
    </tfoot>
  );
}
