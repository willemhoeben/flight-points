"use client";

import { useMemo, useState } from "react";
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

type SortKey = "name" | "centsPerPoint";
type SortDir = "asc" | "desc";

export function ValuationsTable({ valuations }: { valuations: PointCurrency[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("centsPerPoint");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...valuations];
    copy.sort((a, b) => {
      const diff =
        sortKey === "name" ? a.name.localeCompare(b.name) : a.centsPerPoint - b.centsPerPoint;
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [valuations, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const sortArrow = (key: SortKey) => (sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕");

  return (
    <div className="overflow-x-auto rounded-[20px] bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface-muted text-xs font-medium text-muted">
          <tr>
            <th className="px-4 py-3">
              <button
                type="button"
                onClick={() => toggleSort("name")}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Currency
                <span aria-hidden="true" className="text-[10px] leading-none">
                  {sortArrow("name")}
                </span>
              </button>
            </th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">
              <button
                type="button"
                onClick={() => toggleSort("centsPerPoint")}
                className="inline-flex flex-row-reverse items-center gap-1 hover:text-foreground"
              >
                Value
                <span aria-hidden="true" className="text-[10px] leading-none">
                  {sortArrow("centsPerPoint")}
                </span>
              </button>
            </th>
            <th className="px-4 py-3">Trend</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface-muted/60">
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">{v.name}</div>
                <div className="text-xs text-muted">{v.issuer}</div>
              </td>
              <td className="px-4 py-3">
                <Badge accent={TYPE_ACCENT[v.type]}>{TYPE_LABEL[v.type]}</Badge>
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px] font-semibold tabular-nums text-foreground">
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
