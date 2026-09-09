"use client";

import { useMemo, useState } from "react";
import type { AwardResult } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";
import { Badge } from "@/components/ui";
import { formatDuration, formatMiles } from "@/lib/format";

type SortKey = "milesCost" | "durationMinutes" | "seatsRemaining";
type SortDir = "asc" | "desc";

const SORTABLE_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "durationMinutes", label: "Duration" },
  { key: "seatsRemaining", label: "Seats" },
  { key: "milesCost", label: "Miles" },
];

export function ResultsTable({ results }: { results: AwardResult[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("milesCost");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Results arrive pre-sorted ascending by miles cost, so results[0] is
  // always the true cheapest option regardless of how the table is
  // currently sorted for display.
  const cheapestId = results.length > 1 ? results[0].id : null;

  const sorted = useMemo(() => {
    const copy = [...results];
    copy.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [results, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

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
                    "inline-flex items-center gap-1 uppercase tracking-wide hover:text-foreground",
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
            <th className="px-4 py-3 text-right">Taxes &amp; fees</th>
            <th className="px-4 py-3">Booking</th>
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
                    {isBest && <Badge accent="emerald">Best price</Badge>}
                  </div>
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
