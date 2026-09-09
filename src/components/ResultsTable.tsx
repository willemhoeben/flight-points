import type { AwardResult } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";
import { Badge } from "@/components/ui";
import { formatDuration, formatMiles } from "@/lib/format";

export function ResultsTable({ results }: { results: AwardResult[] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
        No award space found for this route, date, and cabin combination. Try a
        different date, or widen your program filter.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Program</th>
            <th className="px-4 py-3">Routing</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Seats</th>
            <th className="px-4 py-3 text-right">Miles</th>
            <th className="px-4 py-3 text-right">Taxes &amp; fees</th>
            <th className="px-4 py-3">Booking</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const program = PROGRAMS.find((p) => p.id === r.programId);
            return (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-muted/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{r.programName}</div>
                  {program && (
                    <div className="mt-1">
                      <Badge accent={program.accent}>{program.alliance}</Badge>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">
                  {r.direct ? "Nonstop" : `${r.connections} stop${r.connections > 1 ? "s" : ""}`}
                </td>
                <td className="px-4 py-3 text-muted">{formatDuration(r.durationMinutes)}</td>
                <td className="px-4 py-3 text-muted">{r.seatsRemaining} left</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatMiles(r.milesCost)}
                </td>
                <td className="px-4 py-3 text-right text-muted">${r.taxesFeesUsd}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.bookingWindow === "Bookable online"
                        ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        : "text-xs font-medium text-amber-600 dark:text-amber-400"
                    }
                  >
                    {r.bookingWindow}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
