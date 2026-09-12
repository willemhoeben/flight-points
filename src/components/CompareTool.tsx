"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PointCurrency } from "@/data/valuations";
import { Badge } from "@/components/ui";
import { useCurrency } from "@/lib/currency-context";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { formatMiles } from "@/lib/format";
import { pointsToUsd } from "@/lib/points-calc";
import { buildCompareUrl, DEFAULT_COMPARE_BALANCE, parseBalance, toggleCompareId } from "@/lib/compare-url";

const TYPE_ACCENT: Record<PointCurrency["type"], string> = {
  bank: "sky",
  airline: "violet",
  hotel: "amber",
};

const TREND_ICON: Record<PointCurrency["trend"], string> = { up: "▲", down: "▼", flat: "•" };
const TREND_CLASS: Record<PointCurrency["trend"], string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-600 dark:text-rose-400",
  flat: "text-muted",
};

const TYPES: PointCurrency["type"][] = ["bank", "airline", "hotel"];

export function CompareTool({ valuations }: { valuations: PointCurrency[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dict = useDictionary();
  const locale = useLocale();
  const { format } = useCurrency();

  // Requested ids come straight from the URL, so an id for a currency that
  // no longer exists (a stale share link after the mock dataset changes)
  // is silently dropped rather than rendered as a broken selection.
  const selectedIds = searchParams.getAll("currencies").filter((id) => valuations.some((v) => v.id === id));
  const balance = parseBalance(searchParams.get("balance"));

  function updateUrl(next: { currencyIds: string[]; balance: number }) {
    router.replace(buildCompareUrl(pathname, next), { scroll: false });
  }

  function toggleCurrency(id: string) {
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
      <div role="group" aria-label={dict.compareTool.selectLabel}>
        {TYPES.map((type) => (
          <div key={type} className="mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{TYPE_LABEL[type]}</div>
            <div className="flex flex-wrap gap-2">
              {valuations
                .filter((v) => v.type === type)
                .map((v) => {
                  const active = selectedIds.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleCurrency(v.id)}
                      aria-pressed={active}
                      className={
                        active
                          ? "rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
                          : "rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                      }
                    >
                      {v.name}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
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
          <div className="rounded-[20px] bg-surface-muted p-10 text-center text-sm text-muted">
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
                      ? "rounded-[20px] border border-emerald-500/40 bg-emerald-500/5 p-5"
                      : "rounded-[20px] bg-surface-muted p-5"
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
