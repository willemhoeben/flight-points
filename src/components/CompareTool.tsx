"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { PointCurrency } from "@/data/valuations";
import { Badge, Pill } from "@/components/ui";
import { interpolate } from "@/lib/i18n/format";
import { useCurrency } from "@/lib/currency-context";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { formatMiles } from "@/lib/format";
import { pointsToUsd } from "@/lib/points-calc";
import { buildCompareUrl, DEFAULT_COMPARE_BALANCE, parseBalance, toggleCompareId } from "@/lib/compare-url";
import type { Accent } from "@/lib/accent";

const TYPE_ACCENT: Record<PointCurrency["type"], Accent> = {
  bank: "sky",
  airline: "violet",
  hotel: "amber",
};

const TREND_ICON: Record<PointCurrency["trend"], string> = { up: "▲", down: "▼", flat: "•" };
const TREND_CLASS: Record<PointCurrency["trend"], string> = {
  up: "text-success-text",
  down: "text-rose-600 dark:text-rose-400",
  flat: "text-muted",
};

const TYPES: PointCurrency["type"][] = ["bank", "airline", "hotel"];

/**
 * The selection and balance arrive as props, read from the URL by the page.
 *
 * useSearchParams here would opt this component's Suspense boundary out of
 * server rendering, and fallback={null} is what would ship: /compare
 * answered a reader without JavaScript with a heading and 204 characters,
 * no picker and no comparison.
 */
export function CompareTool({
  valuations,
  requestedIds,
  balance,
}: {
  valuations: PointCurrency[];
  /** Every ?currencies= on the URL, in order, unvalidated. */
  requestedIds: string[];
  balance: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dict = useDictionary();
  const locale = useLocale();
  const { format } = useCurrency();

  // Requested ids come straight from the URL, so an id for a currency that
  // no longer exists (a stale share link after the mock dataset changes)
  // is silently dropped rather than rendered as a broken selection.
  const validIds = requestedIds.filter((id) => valuations.some((v) => v.id === id));
  // A first visit opens on a real comparison rather than an empty shell with
  // an instruction in it. The default only stands until the visitor touches
  // the picker: the URL drops the param entirely when nothing is selected,
  // so keying off the URL alone would reinstate the default under someone
  // who had just deliberately cleared it.
  const [picked, setPicked] = useState(false);
  const selectedIds =
    requestedIds.length === 0 && !picked ? valuations.slice(0, 2).map((v) => v.id) : validIds;

  function updateUrl(next: { currencyIds: string[]; balance: number }) {
    router.replace(buildCompareUrl(pathname, next), { scroll: false });
  }

  function toggleCurrency(id: string) {
    setPicked(true);
    updateUrl({ currencyIds: toggleCompareId(selectedIds, id), balance });
  }

  function handleBalanceChange(raw: string) {
    const digits = raw.replace(/[^0-9]/g, "");
    const n = Number(digits);
    updateUrl({ currencyIds: selectedIds, balance: digits && n > 0 ? n : DEFAULT_COMPARE_BALANCE });
  }

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

  const selected = selectedIds
    .map((id) => valuations.find((v) => v.id === id))
    .filter((v): v is PointCurrency => v !== undefined);
  const ranked = selected
    .map((currency) => ({ currency, valueUsd: pointsToUsd(balance, currency.centsPerPoint) }))
    .sort((a, b) => b.valueUsd - a.valueUsd);

  return (
    <div>
      {/* Banks stay out; airlines and hotels fold away.
          Thirty-one airline pills over six rows filled the top half of the
          viewport and pushed the comparison — the answer this page exists
          for — below the fold, so the control shouted and the result
          whispered. Banks are one row and where most people start, so they
          stay. The rest sit behind the same native <details> the search
          form's forty-programme picker already uses, and it opens itself
          when a selection is in there so the current choice is never
          hidden. */}
      <div role="group" aria-label={dict.compareTool.selectLabel}>
        {TYPES.map((type) => {
          const inType = valuations.filter((v) => v.type === type);
          const pills = (
            <div className="flex flex-wrap gap-2">
              {inType.map((v) => (
                <Pill
                  key={v.id}
                  selected={selectedIds.includes(v.id)}
                  semantics="toggle"
                  onClick={() => toggleCurrency(v.id)}
                >
                  {v.name}
                </Pill>
              ))}
            </div>
          );
          const label = (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{TYPE_LABEL[type]}</span>
          );

          if (type === "bank") {
            return (
              <div key={type} className="mb-4">
                <div className="mb-2">{label}</div>
                {pills}
              </div>
            );
          }

          const chosen = inType.filter((v) => selectedIds.includes(v.id)).length;
          return (
            <details key={type} className="group mb-2 bg-surface-muted" open={chosen > 0}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2.5 sm:min-h-0 [&::-webkit-details-marker]:hidden">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-3.5 w-3.5 text-muted transition-transform group-open:rotate-90"
                >
                  <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {label}
                <span className="text-xs text-muted">
                  {chosen > 0
                    ? interpolate(dict.compareTool.pickedCount, { chosen, total: inType.length })
                    : interpolate(dict.compareTool.availableCount, { total: inType.length })}
                </span>
              </summary>
              <div className="px-3 pb-3">{pills}</div>
            </details>
          );
        })}
      </div>

      <label className="mt-2 block max-w-xs">
        <span className="mb-1 block text-sm font-medium text-foreground">{dict.compareTool.balanceLabel}</span>
        <input
          type="text"
          inputMode="numeric"
          className="form-select"
          value={String(balance)}
          onChange={(e) => handleBalanceChange(e.target.value)}
          placeholder={dict.compareTool.balancePlaceholder}
        />
      </label>

      <div className="mt-6">
        {ranked.length < 2 ? (
          <div className="bg-surface-muted p-10 text-center text-sm text-muted">
            {dict.compareTool.emptyState}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ranked.map(({ currency, valueUsd }, index) => {
              const isBest = index === 0;
              return (
                <div
                  key={currency.id}
                  className={
                    isBest
                      ? "border border-emerald-500/40 bg-emerald-500/5 p-5"
                      : "bg-surface-muted p-5"
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-foreground">{currency.name}</div>
                      <div className="text-xs text-muted">{currency.issuer}</div>
                    </div>
                    <Badge accent={TYPE_ACCENT[currency.type]}>{TYPE_LABEL[currency.type]}</Badge>
                  </div>
                  {isBest && (
                    <div className="mt-2">
                      <Badge accent="emerald">{dict.compareTool.bestValue}</Badge>
                    </div>
                  )}
                  <div className="mt-4">
                    <div className="text-xs text-muted">{dict.compareTool.valueForBalance}</div>
                    <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground" suppressHydrationWarning>
                      {format(valueUsd)}
                    </div>
                    <div className="mt-1 font-mono text-xs tabular-nums text-muted" suppressHydrationWarning>
                      {formatMiles(balance, locale)} × {currency.centsPerPoint.toFixed(2)}¢
                    </div>
                  </div>
                  <div className={`mt-3 text-xs font-medium ${TREND_CLASS[currency.trend]}`}>
                    <span aria-hidden="true">{TREND_ICON[currency.trend]}</span> {TREND_LABEL[currency.trend]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
