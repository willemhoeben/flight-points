import Link from "next/link";
import type { CalendarDay } from "@/data/availability";
import { formatDateLabel, formatDateShort, formatMiles } from "@/lib/format";

function buildHref(baseParams: URLSearchParams, date: string): string {
  const params = new URLSearchParams(baseParams);
  params.set("date", date);
  return `/search?${params.toString()}`;
}

export function CalendarHeatmap({
  days,
  selectedDate,
  baseParams,
}: {
  days: CalendarDay[];
  selectedDate: string;
  baseParams: URLSearchParams;
}) {
  const priced = days.map((d) => d.lowestMiles).filter((v): v is number => v !== null);
  const min = priced.length > 0 ? Math.min(...priced) : 0;
  const max = priced.length > 0 ? Math.max(...priced) : 0;

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {days.map((day) => {
        const isSelected = day.date === selectedDate;
        const tier = priceTier(day.lowestMiles, min, max);
        return (
          <Link
            key={day.date}
            href={buildHref(baseParams, day.date)}
            aria-current={isSelected ? "date" : undefined}
            aria-label={`${formatDateLabel(day.date)}: ${day.lowestMiles !== null ? `${formatMiles(day.lowestMiles)} miles` : "no award space"}`}
            className={[
              "rounded-2xl p-3 text-center transition-shadow",
              isSelected ? "ring-2 ring-brand ring-offset-2 ring-offset-background" : "",
              tier.className,
            ].join(" ")}
          >
            <div className="font-mono text-xs text-muted">{formatDateShort(day.date)}</div>
            <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-foreground">
              {day.lowestMiles !== null ? formatMiles(day.lowestMiles) : "—"}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function priceTier(
  value: number | null,
  min: number,
  max: number,
): { className: string } {
  if (value === null) {
    return { className: "bg-surface-muted text-muted" };
  }
  if (max === min) {
    return { className: "bg-emerald-500/10" };
  }
  const ratio = (value - min) / (max - min);
  if (ratio <= 0.33) return { className: "bg-emerald-500/10" };
  if (ratio <= 0.66) return { className: "bg-amber-500/10" };
  return { className: "bg-rose-500/10" };
}
