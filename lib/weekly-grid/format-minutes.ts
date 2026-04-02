/** Human-readable duration for totals (minutes). */
export function formatMinutes(total: number): string {
  if (total === 0) return "0";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
