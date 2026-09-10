"use client";

import { useMemo, useState } from "react";
import type { AwardResult } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";
import { Badge } from "@/components/ui";
import { useCurrency } from "@/lib/currency-context";
import { formatDuration, formatMiles } from "@/lib/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { nextSort, sortBy, type SortDir } from "@/lib/sort";

type SortKey = "milesCost" | "durationMinutes" | "seatsRemaining";

export function ResultsTable({ results }: { results: AwardResult[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("milesCost");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const { format } = useCurrency();
  const dict = useDictionary();
  const locale = useLocale();

  const SORTABLE_COLUMNS: { key: SortKey; label: string }[] = [
    { key: "durationMinutes", label: dict.resultsTable.duration },
    { key: "seatsRemaining", label: dict.resultsTable.seats },
    { key: "milesCost", label: dict.resultsTable.miles },
  ];

  // Results arrive pre-sorted ascending by miles cost, so results[0] is
  // always the true cheapest option regardless of how the table is
  // currently sorted for display.
  const cheapestId = results.length > 1 ? results[0].id : null;

  const sorted = useMemo(() => sortBy(results, sortKey, sortDir), [results, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    const next = nextSort(sortKey, sortDir, key, () => "asc");
    setSortKey(next.key);
    setSortDir(next.dir);
  }

  if (results.length === 0) {
    return (
      <div className="rounded-[20px] bg-surface-muted p-10 text-center text-sm text-muted">{dict.search.noAwardSpace}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[20px] bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-surface-muted text-xs font-medium text-muted">
          <tr>
            <th className="px-4 py-3">{dict.resultsTable.program}</th>
            <th className="px-4 py-3">{dict.resultsTable.routing}</th>
            {SORTABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={col.key === "milesCost" ? "px-4 py-3 text-right" : "px-4 py-3"}
                aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className={[
                    "inline-flex items-center gap-1 hover:text-foreground",
                    col.key === "milesCost" ? "flex-row-reverse" : "",
                  ].join(" ")}
                >
                  {col.label}
                  <span aria-hidden="true" className="text-[10px] leading-none">
                    {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                  </span>
                </button>
              </th>
            ))}
            <th className="px-4 py-3 text-right">{dict.resultsTable.taxesFees}</th>
            <th className="px-4 py-3">{dict.resultsTable.booking}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const program = PROGRAMS.find((p) => p.id === r.programId);
            const isBest = r.id === cheapestId;
            return (
              <tr
                key={r.id}
                className={
                  isBest
                    ? "border-b border-border bg-emerald-500/5 last:border-0 hover:bg-emerald-500/10"
                    : "border-b border-border last:border-0 hover:bg-surface-muted/60"
                }
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{r.programName}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {program && <Badge accent={program.accent}>{program.alliance}</Badge>}
                    {isBest && <Badge accent="emerald">{dict.resultsTable.bestPrice}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {r.direct
                    ? dict.resultsTable.nonstop
                    : `${r.connections} ${r.connections > 1 ? dict.resultsTable.stops : dict.resultsTable.stop}`}
                </td>
                <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-muted" suppressHydrationWarning>{formatDuration(r.durationMinutes, locale)}</td>
                <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-muted">
                  {r.seatsRemaining} {dict.resultsTable.seatsLeft}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[13px] font-semibold tabular-nums text-foreground" suppressHydrationWarning>
                  {formatMiles(r.milesCost, locale)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[13px] tabular-nums text-muted" suppressHydrationWarning>{format(r.taxesFeesUsd)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.bookingWindow === "online"
                        ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        : "text-xs font-medium text-amber-600 dark:text-amber-400"
                    }
                  >
                    {r.bookingWindow === "online" ? dict.resultsTable.bookableOnline : dict.resultsTable.callToBook}
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
