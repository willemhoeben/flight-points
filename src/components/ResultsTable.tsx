"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AwardResult } from "@/data/availability";
import { PROGRAMS, type Alliance } from "@/data/programs";
import { Badge } from "@/components/ui";
import { AffordBadge } from "@/components/AffordBadge";
import { PointsOrCash } from "@/components/PointsOrCash";
import { ValueBadge, valueTierLabel } from "@/components/ValueBadge";
import { useBalances } from "@/lib/balances-context";
import { useCurrency } from "@/lib/currency-context";
import { formatCentsPerPoint, formatDuration, formatMiles } from "@/lib/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { interpolate } from "@/lib/i18n/format";
import { isSortDir, nextSort, sortBy, type SortDir } from "@/lib/sort";
import { peakCentsPerPoint, valueTier } from "@/lib/value";
import { affordability } from "@/lib/wallet";
import {
  allianceFromSlug,
  buildResultsSortUrl,
  isNonstopOnlyParam,
  isWithinReachParam,
  isResultsSortKey,
  maxFeesFromParam,
  DEFAULT_RESULTS_SORT_DIR,
  DEFAULT_RESULTS_SORT_KEY,
  MAX_FEES_OPTIONS,
  type ResultsSortKey,
} from "@/lib/results-sort-url";

const ALLIANCES: Alliance[] = ["Star Alliance", "Oneworld", "SkyTeam", "Unaligned"];

export function ResultsTable({
  results,
  passengers = 1,
}: {
  results: AwardResult[];
  /** Seats needed. Prices stay per person; what the balances have to cover does not. */
  passengers?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortParam = searchParams.get("sort");
  const dirParam = searchParams.get("dir");
  const sortKey: ResultsSortKey = isResultsSortKey(sortParam) ? sortParam : DEFAULT_RESULTS_SORT_KEY;
  const sortDir: SortDir = isSortDir(dirParam) ? dirParam : DEFAULT_RESULTS_SORT_DIR;
  const nonstopOnly = isNonstopOnlyParam(searchParams.get("nonstop"));
  const allianceFilter = allianceFromSlug(searchParams.get("alliance"));
  const maxFeesFilter = maxFeesFromParam(searchParams.get("maxFees"));
  const withinReachOnly = isWithinReachParam(searchParams.get("reach"));

  const { balances } = useBalances();
  const { format, formatRounded } = useCurrency();
  const dict = useDictionary();
  const locale = useLocale();

  const SORTABLE_COLUMNS: { key: ResultsSortKey; label: string }[] = [
    { key: "durationMinutes", label: dict.resultsTable.duration },
    { key: "seatsRemaining", label: dict.resultsTable.seats },
    { key: "milesCost", label: dict.resultsTable.miles },
    { key: "centsPerPoint", label: dict.resultsTable.valuePerPoint },
  ];

  const allianceLabel = (alliance: Alliance) => (alliance === "Unaligned" ? dict.searchForm.allianceUnaligned : alliance);

  const filtered = useMemo(
    () =>
      results.filter((r) => {
        if (nonstopOnly && !r.direct) return false;
        if (allianceFilter && PROGRAMS.find((p) => p.id === r.programId)?.alliance !== allianceFilter) return false;
        if (maxFeesFilter && r.taxesFeesUsd > maxFeesFilter) return false;
        if (withinReachOnly) {
          const state = affordability(balances, r.programId, r.milesCost * passengers);
          if (state.kind !== "covered" && state.kind !== "transfer") return false;
        }
        return true;
      }),
    [results, nonstopOnly, allianceFilter, maxFeesFilter, withinReachOnly, balances, passengers],
  );

  const hasAdvancedFilter = allianceFilter !== null || maxFeesFilter !== null || withinReachOnly;

  // filtered preserves results' original order (a .filter() never
  // reorders), and results itself arrives pre-sorted ascending by miles
  // cost — so filtered[0] is always the cheapest option currently on
  // display, regardless of the nonstop filter or the table's own sort.
  const cheapestId = filtered.length > 1 ? filtered[0].id : null;

  const sorted = useMemo(() => sortBy(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  // Rated against the best option on screen, so the badge says which row to
  // book rather than repeating the same verdict down the whole column.
  const peakCpp = useMemo(() => peakCentsPerPoint(filtered), [filtered]);

  const sortAnnouncement = interpolate(sortDir === "asc" ? dict.common.sortAscending : dict.common.sortDescending, {
    column: SORTABLE_COLUMNS.find((col) => col.key === sortKey)?.label ?? "",
  });

  function goToSort(key: ResultsSortKey) {
    const next = nextSort(sortKey, sortDir, key, () => "asc");
    router.replace(
      buildResultsSortUrl(pathname, searchParams.toString(), {
        sortKey: next.key,
        sortDir: next.dir,
        nonstopOnly,
        alliance: allianceFilter,
        maxTaxesFees: maxFeesFilter,
        withinReach: withinReachOnly,
      }),
      { scroll: false },
    );
  }

  function toggleNonstopOnly() {
    router.replace(
      buildResultsSortUrl(pathname, searchParams.toString(), {
        sortKey,
        sortDir,
        nonstopOnly: !nonstopOnly,
        alliance: allianceFilter,
        maxTaxesFees: maxFeesFilter,
        withinReach: withinReachOnly,
      }),
      { scroll: false },
    );
  }

  function toggleWithinReach() {
    router.replace(
      buildResultsSortUrl(pathname, searchParams.toString(), {
        sortKey,
        sortDir,
        nonstopOnly,
        alliance: allianceFilter,
        maxTaxesFees: maxFeesFilter,
        withinReach: !withinReachOnly,
      }),
      { scroll: false },
    );
  }

  function goToAlliance(alliance: Alliance | null) {
    router.replace(
      buildResultsSortUrl(pathname, searchParams.toString(), {
        sortKey,
        sortDir,
        nonstopOnly,
        alliance,
        maxTaxesFees: maxFeesFilter,
        withinReach: withinReachOnly,
      }),
      { scroll: false },
    );
  }

  function goToMaxFees(maxTaxesFees: number | null) {
    router.replace(
      buildResultsSortUrl(pathname, searchParams.toString(), {
        sortKey,
        sortDir,
        nonstopOnly,
        alliance: allianceFilter,
        maxTaxesFees,
        withinReach: withinReachOnly,
      }),
      { scroll: false },
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-surface-muted p-10 text-center text-sm text-muted">{dict.search.noAwardSpace}</div>
    );
  }

  // Each group carries its own visible label: there's an "All" pill in both
  // the alliance and the fees group, and once the row wraps on a narrow
  // screen a bare "All" on its own line says nothing about what it resets.
  const filterControls = (
    <div
      className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 print:hidden"
      role="group"
      aria-label={dict.resultsTable.filterLabel}
    >
      <FilterPill active={nonstopOnly} toggle onClick={toggleNonstopOnly}>
        {dict.resultsTable.nonstopOnly}
      </FilterPill>

      {/* Only offered once a balance exists on /wallet: a filter that can
          only ever return nothing is worse than no filter. */}
      {Object.keys(balances).length > 0 && (
        <FilterPill active={withinReachOnly} toggle onClick={toggleWithinReach}>
          {dict.resultsTable.withinReachOnly}
        </FilterPill>
      )}

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dict.resultsTable.allianceLabel}>
        <span className="text-xs font-medium text-muted">{dict.resultsTable.allianceLabel}</span>
        <FilterPill active={allianceFilter === null} onClick={() => goToAlliance(null)}>
          {dict.resultsTable.filterAll}
        </FilterPill>
        {ALLIANCES.map((alliance) => (
          <FilterPill key={alliance} active={allianceFilter === alliance} onClick={() => goToAlliance(alliance)}>
            {allianceLabel(alliance)}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dict.resultsTable.maxFeesLabel}>
        <span className="text-xs font-medium text-muted">{dict.resultsTable.maxFeesLabel}</span>
        <FilterPill active={maxFeesFilter === null} onClick={() => goToMaxFees(null)}>
          {dict.resultsTable.filterAll}
        </FilterPill>
        {MAX_FEES_OPTIONS.map((amount) => (
          <FilterPill key={amount} active={maxFeesFilter === amount} onClick={() => goToMaxFees(amount)}>
            {interpolate(dict.resultsTable.maxFeesUnder, { amount: formatRounded(amount) })}
          </FilterPill>
        ))}
      </div>

      {/* One muted line, and only for someone who has not used the wallet
          yet. Nothing else on this page says the verdict column exists, and
          a feature nobody finds may as well not ship. */}
      {Object.keys(balances).length === 0 && (
        <p className="basis-full max-w-[72ch] text-xs text-muted">
          {dict.resultsTable.walletHint}{" "}
          <Link href="/wallet" className="font-medium text-brand-text hover:underline">
            {dict.nav.wallet} →
          </Link>
        </p>
      )}
    </div>
  );

  if (filtered.length === 0) {
    return (
      <div>
        {filterControls}
        <div className="bg-surface-muted p-10 text-center text-sm text-muted">
          {hasAdvancedFilter ? dict.resultsTable.noFilteredResults : dict.resultsTable.noNonstopResults}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PointsOrCash results={filtered} />
      {filterControls}
      <span aria-live="polite" className="sr-only">
        {sortAnnouncement}
      </span>

      {/* The table needs 860px since the value column landed, which the
          page's content column only reaches at lg. Below that only
          Program/Routing/Duration fit and miles, value and taxes — the whole
          point of the search — sit off the right edge behind a sideways
          scroll nothing hints at. So narrower screens get the same rows as
          cards instead, with every number visible; two columns once there's
          room for them. The table is still the lg-and-up layout, since it
          compares rows far better than cards do once it fits. */}
      <div className="flex flex-wrap items-center gap-2 print:hidden lg:hidden" role="group" aria-label={dict.common.sortBy}>
        <span className="text-xs font-medium text-muted">{dict.common.sortBy}</span>
        {SORTABLE_COLUMNS.map((col) => (
          <button
            key={col.key}
            type="button"
            onClick={() => goToSort(col.key)}
            aria-current={sortKey === col.key ? "true" : undefined}
            className={
              sortKey === col.key
                ? "inline-flex items-center gap-1 bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
                : "inline-flex items-center gap-1 bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
            }
          >
            {col.label}
            <span aria-hidden="true" className="text-[10px] leading-none">
              {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
            </span>
          </button>
        ))}
      </div>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:hidden">
        {sorted.map((r) => {
          const program = PROGRAMS.find((p) => p.id === r.programId);
          const isBest = r.id === cheapestId;
          return (
            <li
              key={r.id}
              className={
                isBest
                  ? "bg-emerald-500/5 p-4 ring-1 ring-emerald-500/30 [&_.text-muted]:text-muted-on-tint"
                  // --surface is the same white as --background in light mode, so a
                  // plain surface card would have no visible edge. bg-surface-muted
                  // is the panel treatment the rest of the site already uses.
                  : "bg-surface-muted p-4"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{r.programName}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {program && <Badge accent={program.accent}>{allianceLabel(program.alliance)}</Badge>}
                    {isBest && <Badge accent="emerald">{dict.resultsTable.bestPrice}</Badge>}
                    <AffordBadge programId={r.programId} milesCost={r.milesCost * passengers} />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-base font-semibold tabular-nums text-foreground" suppressHydrationWarning>
                    {formatMiles(r.milesCost, locale)}
                  </div>
                  <div className="text-[11px] text-muted">{dict.resultsTable.miles}</div>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-[13px]">
                <div>
                  <dt className="text-[11px] text-muted">{dict.resultsTable.routing}</dt>
                  <dd className="text-foreground">
                    {r.direct
                      ? dict.resultsTable.nonstop
                      : `${r.connections} ${r.connections > 1 ? dict.resultsTable.stops : dict.resultsTable.stop}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">{dict.resultsTable.duration}</dt>
                  <dd className="font-mono tabular-nums text-foreground" suppressHydrationWarning>
                    {formatDuration(r.durationMinutes, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">{dict.resultsTable.taxesFees}</dt>
                  <dd className="font-mono tabular-nums text-foreground" suppressHydrationWarning>{format(r.taxesFeesUsd)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">{dict.resultsTable.seats}</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {r.seatsRemaining} {dict.resultsTable.seatsLeft}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">{dict.resultsTable.valuePerPoint}</dt>
                  <dd className="font-mono tabular-nums text-foreground" suppressHydrationWarning>
                    {formatCentsPerPoint(r.centsPerPoint, locale)}{" "}
                    <RatedBadge row={r} peak={peakCpp} dict={dict.resultsTable} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">{dict.resultsTable.cashFare}</dt>
                  <dd className="font-mono tabular-nums text-foreground" suppressHydrationWarning>
                    {formatRounded(r.cashFareUsd)}
                  </dd>
                </div>
              </dl>

              <div className="mt-3">
                <span
                  className={
                    r.bookingWindow === "online"
                      ? "text-xs font-medium text-success-text"
                      : "text-xs font-medium text-warning-text"
                  }
                >
                  {r.bookingWindow === "online" ? dict.resultsTable.bookableOnline : dict.resultsTable.callToBook}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto bg-surface lg:block">
        <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-surface-muted text-xs font-medium text-muted">
          <tr>
            <th scope="col" className="px-4 py-3">{dict.resultsTable.program}</th>
            <th scope="col" className="px-4 py-3">{dict.resultsTable.routing}</th>
            {SORTABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={
                  col.key === "milesCost" || col.key === "centsPerPoint" ? "px-4 py-3 text-right" : "px-4 py-3"
                }
                aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => goToSort(col.key)}
                  className={[
                    "inline-flex items-center gap-1 hover:text-foreground",
                    col.key === "milesCost" || col.key === "centsPerPoint" ? "flex-row-reverse" : "",
                  ].join(" ")}
                >
                  {col.label}
                  <span aria-hidden="true" className="text-[10px] leading-none">
                    {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right">{dict.resultsTable.taxesFees}</th>
            <th scope="col" className="px-4 py-3">{dict.resultsTable.booking}</th>
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
                    ? "border-b border-border bg-emerald-500/5 last:border-0 hover:bg-emerald-500/10 [&_.text-muted]:text-muted-on-tint"
                    : "border-b border-border last:border-0 hover:bg-surface-muted/60"
                }
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{r.programName}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {program && <Badge accent={program.accent}>{allianceLabel(program.alliance)}</Badge>}
                    {isBest && <Badge accent="emerald">{dict.resultsTable.bestPrice}</Badge>}
                    <AffordBadge programId={r.programId} milesCost={r.milesCost * passengers} />
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
                <td className="px-4 py-3 text-right" suppressHydrationWarning>
                  <div className="font-mono text-[13px] tabular-nums text-foreground">
                    {formatCentsPerPoint(r.centsPerPoint, locale)}
                  </div>
                  <div className="mt-1">
                    <RatedBadge row={r} peak={peakCpp} dict={dict.resultsTable} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[13px] tabular-nums text-muted" suppressHydrationWarning>{format(r.taxesFeesUsd)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.bookingWindow === "online"
                        ? "text-xs font-medium text-success-text"
                        : "text-xs font-medium text-warning-text"
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
    </div>
  );
}

/**
 * `toggle` switches the pill between the two semantics in this row: the
 * nonstop pill is an on/off toggle (aria-pressed), while the alliance and
 * fees pills are one-of-many choices within their group (aria-current).
 */
function FilterPill({
  active,
  toggle = false,
  onClick,
  children,
}: {
  active: boolean;
  toggle?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={toggle ? active : undefined}
      aria-current={!toggle && active ? "true" : undefined}
      className={
        active
          ? "bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
          : "bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}

/** Rates a row against the best on screen and labels it in the current language. */
function RatedBadge({
  row,
  peak,
  dict,
}: {
  row: AwardResult;
  peak: number;
  dict: { valueGreat: string; valueGood: string; valueFair: string; valueWeak: string };
}) {
  const tier = valueTier(row, peak);
  if (!tier) return null;
  return <ValueBadge tier={tier} label={valueTierLabel(tier, dict)} />;
}
