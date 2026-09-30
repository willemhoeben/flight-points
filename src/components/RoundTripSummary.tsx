"use client";

import { useCurrency } from "@/lib/currency-context";
import { formatMiles } from "@/lib/format";
import { useLocale } from "@/lib/i18n/i18n-context";
import { interpolate } from "@/lib/i18n/format";

/**
 * What the whole trip costs, before the visitor works through either leg.
 *
 * The number people actually budget against is out plus back, and a page
 * that only ever shows one leg makes them add it up themselves. A client
 * island because the cash half follows the currency selector, which lives
 * in the browser.
 */
export function RoundTripSummary({
  heading,
  total,
  milesCost,
  taxesFeesUsd,
  programLine,
  nights,
}: {
  heading: string;
  /** "From {miles} miles + {cash}". */
  total: string;
  milesCost: number;
  taxesFeesUsd: number;
  programLine: string;
  nights: string;
}) {
  const { format } = useCurrency();
  const locale = useLocale();

  return (
    <div className="border-t border-border-strong pt-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-semibold text-foreground">{heading}</h2>
        <span className="font-mono text-xs text-muted" suppressHydrationWarning>
          {nights}
        </span>
      </div>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground" suppressHydrationWarning>
        {interpolate(total, {
          miles: formatMiles(milesCost, locale),
          cash: format(taxesFeesUsd),
        })}
      </p>
      <p className="mt-1 max-w-[62ch] text-sm text-muted">{programLine}</p>
    </div>
  );
}
