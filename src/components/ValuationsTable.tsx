"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PointCurrency } from "@/data/valuations";
import { Badge } from "@/components/ui";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { useDictionary } from "@/lib/i18n/i18n-context";
import { nextSort, sortBy, type SortDir } from "@/lib/sort";
import {
  buildValuationsUrl,
  isSortDir,
  isValuationsSortKey,
  isValuationType,
  DEFAULT_VALUATIONS_SORT_DIR,
  DEFAULT_VALUATIONS_SORT_KEY,
  type ValuationsSortKey,
} from "@/lib/valuations-url";

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

const TYPES: PointCurrency["type"][] = ["bank", "airline", "hotel"];

export function ValuationsTable({ valuations }: { valuations: PointCurrency[] }) {
  const dict = useDictionary();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");
  const sortParam = searchParams.get("sort");
  const dirParam = searchParams.get("dir");
  const typeFilter = isValuationType(typeParam) ? typeParam : null;
  const sortKey: ValuationsSortKey = isValuationsSortKey(sortParam) ? sortParam : DEFAULT_VALUATIONS_SORT_KEY;
  const sortDir: SortDir = isSortDir(dirParam) ? dirParam : DEFAULT_VALUATIONS_SORT_DIR;

  const TYPE_LABEL: Record<PointCurrency["type"], string> = {
    bank: dict.valuationsTable.typeBank,
    airline: dict.valuationsTable.typeAirline,
    hotel: dict.valuationsTable.typeHotel,
  };
  const TREND_LABEL: Record<PointCurrency["trend"], string> = {
    up: dict.valuationsTable.trendUp,
    down: dict.valuationsTable.trendDown,
    flat: dict.valuationsTable.trendFlat,
  };

  const filtered = useMemo(
    () => (typeFilter ? valuations.filter((v) => v.type === typeFilter) : valuations),
    [valuations, typeFilter],
  );
  const sorted = useMemo(() => sortBy(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  function goToSort(key: ValuationsSortKey) {
    const next = nextSort(sortKey, sortDir, key, (k) => (k === "name" ? "asc" : "desc"));
    router.replace(buildValuationsUrl(pathname, { type: typeFilter, sortKey: next.key, sortDir: next.dir }), {
      scroll: false,
    });
  }

  function goToType(type: PointCurrency["type"] | null) {
    router.replace(buildValuationsUrl(pathname, { type, sortKey, sortDir }), { scroll: false });
  }

  const sortArrow = (key: ValuationsSortKey) => (sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕");

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2 print:hidden" role="group" aria-label={dict.valuationsTable.filterLabel}>
          <FilterPill active={typeFilter === null} onClick={() => goToType(null)}>
            {dict.valuationsTable.filterAll}
          </FilterPill>
          {TYPES.map((type) => (
            <FilterPill key={type} active={typeFilter === type} onClick={() => goToType(type)}>
              {TYPE_LABEL[type]}
            </FilterPill>
          ))}
        </div>
        <CopyLinkButton />
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-[20px] bg-surface-muted p-10 text-center text-sm text-muted">{dict.valuationsTable.noResults}</div>
      ) : (
        <div className="overflow-x-auto rounded-[20px] bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-muted text-xs font-medium text-muted">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3"
                  aria-sort={sortKey === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button
                    type="button"
                    onClick={() => goToSort("name")}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {dict.valuationsTable.currency}
                    <span aria-hidden="true" className="text-[10px] leading-none">
                      {sortArrow("name")}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-4 py-3">{dict.valuationsTable.type}</th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right"
                  aria-sort={sortKey === "centsPerPoint" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button
                    type="button"
                    onClick={() => goToSort("centsPerPoint")}
                    className="inline-flex flex-row-reverse items-center gap-1 hover:text-foreground"
                  >
                    {dict.valuationsTable.value}
                    <span aria-hidden="true" className="text-[10px] leading-none">
                      {sortArrow("centsPerPoint")}
                    </span>
                  </button>
                </th>
                <th scope="col" className="px-4 py-3">{dict.valuationsTable.trend}</th>
                <th scope="col" className="px-4 py-3">{dict.valuationsTable.notes}</th>
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
                  <td className={`px-4 py-3 font-medium ${TREND_CLASS[v.trend]}`}>
                    <span aria-hidden="true">{TREND_ICON[v.trend]}</span>
                    <span className="sr-only">{TREND_LABEL[v.trend]}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs text-muted">{v.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
          : "rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}
