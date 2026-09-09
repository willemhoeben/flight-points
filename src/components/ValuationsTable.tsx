import type { PointCurrency } from "@/data/valuations";
import { Badge } from "@/components/ui";

const TYPE_LABEL: Record<PointCurrency["type"], string> = {
  bank: "Bank",
  airline: "Airline",
  hotel: "Hotel",
};

const TYPE_ACCENT: Record<PointCurrency["type"], string> = {
  bank: "sky",
  airline: "violet",
  hotel: "amber",
};

const TREND_ICON: Record<PointCurrency["trend"], string> = {
  up: "▲",
  down: "▼",
  flat: "•",
};

const TREND_CLASS: Record<PointCurrency["trend"], string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
  flat: "text-muted",
};

export function ValuationsTable({ valuations }: { valuations: PointCurrency[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">Value</th>
            <th className="px-4 py-3">Trend</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {valuations.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface-muted/60">
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">{v.name}</div>
                <div className="text-xs text-muted">{v.issuer}</div>
              </td>
              <td className="px-4 py-3">
                <Badge accent={TYPE_ACCENT[v.type]}>{TYPE_LABEL[v.type]}</Badge>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-foreground">
                {v.centsPerPoint.toFixed(2)}¢
              </td>
              <td className={`px-4 py-3 font-medium ${TREND_CLASS[v.trend]}`}>{TREND_ICON[v.trend]}</td>
              <td className="px-4 py-3 max-w-xs text-muted">{v.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
