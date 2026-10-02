"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PointCurrency } from "@/data/valuations";
import { Badge, Pill } from "@/components/ui";
import { ValueBar } from "@/components/ValueBar";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { valuationNote } from "@/lib/i18n/valuation-notes";
import { interpolate } from "@/lib/i18n/format";
import { nextSort, sortBy, type SortDir } from "@/lib/sort";
import type { Accent } from "@/lib/accent";
import {
  buildValuationsUrl,
  isSortDir,
  isValuationsSortKey,
  isValuationType,
  DEFAULT_VALUATIONS_SORT_DIR,
  DEFAULT_VALUATIONS_SORT_KEY,
  type ValuationsSortKey,
} from "@/lib/valuations-url";

const TYPE_ACCENT: Record<PointCurrency["type"], Accent> = {
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
  up: "text-success-text",
  down: "text-rose-600 dark:text-rose-400",
  flat: "text-muted",
};

const TYPES: PointCurrency["type"][] = ["bank", "airline", "hotel"];

export function ValuationsTable({ valuations }: { valuations: PointCurrency[] }) {
  const dict = useDictionary();
  const locale = useLocale();
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

  const SORT_LABEL: Record<ValuationsSortKey, string> = {
    name: dict.valuationsTable.currency,
    centsPerPoint: dict.valuationsTable.value,
  };
  const sortAnnouncement = interpolate(sortDir === "asc" ? dict.common.sortAscending : dict.common.sortDescending, {
    column: SORT_LABEL[sortKey],
  });

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
      <span aria-live="polite" className="sr-only">
        {sortAnnouncement}
      </span>
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
        <div className="bg-surface-muted p-10 text-center text-sm text-muted">{dict.valuationsTable.noResults}</div>
      ) : (
        <>
        {/* Same reason as the search results: below md the table is wider
            than the column it sits in, so the cents-per-point value — the
            number the page exists for — ends up off the right edge behind
            a sideways scroll with nothing to hint at it. */}
        <div className="flex flex-wrap items-center gap-2 print:hidden md:hidden" role="group" aria-label={dict.common.sortBy}>
          <span className="text-xs font-medium text-muted">{dict.common.sortBy}</span>
          {(["name", "centsPerPoint"] as ValuationsSortKey[]).map((key) => (
            <Pill
              key={key}
              selected={sortKey === key}
              semantics="choice"
              onClick={() => goToSort(key)}
            >
              {SORT_LABEL[key]}
              <span aria-hidden="true" className="text-[10px] leading-none">
                {sortArrow(key)}
              </span>
            </Pill>
          ))}
        </div>

        <ul className="mt-3 grid gap-3 sm:grid-cols-2 md:hidden">
          {sorted.map((v) => (
            <li key={v.id} className="bg-surface-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{v.name}</div>
                  <div className="text-xs text-muted">{v.issuer}</div>
                  <div className="mt-1.5">
                    <Badge accent={TYPE_ACCENT[v.type]}>{TYPE_LABEL[v.type]}</Badge>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-base font-semibold tabular-nums text-foreground">
                    {v.centsPerPoint.toFixed(2)}¢
                    <span className={`ml-1.5 text-sm font-medium ${TREND_CLASS[v.trend]}`}>
                      <span aria-hidden="true">{TREND_ICON[v.trend]}</span>
                      <span className="sr-only">{TREND_LABEL[v.trend]}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-muted">{dict.valuationsTable.value}</div>
                  <ValueBar centsPerPoint={v.centsPerPoint} />
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-3 text-[13px] text-muted">{valuationNote(v.id, locale, v.notes)}</p>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto bg-surface md:block">
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
                  {/* No width on this column, which was the first thing
                      tried. Pinning it at 100px gave a 68px bar instead of
                      58px and took the width out of the notes column, which
                      then wrapped: the table grew 292px in Dutch and 504px
                      in French for 10px of extra bar. Left to size itself
                      the column stays at 90px and the table is exactly the
                      height it was before the bar existed — 3619px in
                      Dutch, 3911px in French, measured both ways. A bar
                      that makes the page longer is not worth having. */}
                  <td className="px-4 py-3 text-right font-mono text-[13px] font-semibold tabular-nums text-foreground">
                    {v.centsPerPoint.toFixed(2)}¢
                    <ValueBar centsPerPoint={v.centsPerPoint} />
                  </td>
                  <td className={`px-4 py-3 font-medium ${TREND_CLASS[v.trend]}`}>
                    <span aria-hidden="true">{TREND_ICON[v.trend]}</span>
                    <span className="sr-only">{TREND_LABEL[v.trend]}</span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted">{valuationNote(v.id, locale, v.notes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
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
    <Pill selected={active} semantics="choice" onClick={onClick}>
      {children}
    </Pill>
  );
}
