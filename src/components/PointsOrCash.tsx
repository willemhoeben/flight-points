"use client";

import type { AwardResult } from "@/data/availability";
import { useCurrency } from "@/lib/currency-context";
import { formatCentsPerPoint } from "@/lib/format";
import { interpolate } from "@/lib/i18n/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { pointsBeatCash } from "@/lib/value";

/**
 * The site's two halves finally talking to each other: the search knows what
 * the seat costs in points, the valuations table knows what those points are
 * normally worth, and this says which way to pay.
 */
export function PointsOrCash({ results }: { results: AwardResult[] }) {
  const { formatRounded } = useCurrency();
  const dict = useDictionary();
  const locale = useLocale();

  const verdict = pointsBeatCash(results);
  if (!verdict) return null;

  const best = verdict.best as AwardResult;
  const line = interpolate(
    verdict.pointsWin ? dict.resultsTable.verdictPoints : dict.resultsTable.verdictCash,
    {
      program: best.programName,
      cpp: formatCentsPerPoint(best.centsPerPoint, locale),
      baseline: formatCentsPerPoint(verdict.baseline, locale),
    },
  );

  return (
    <div
      className={[
        "mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-[20px] bg-surface-muted p-4 pl-5",
        "border-l-[3px]",
        verdict.pointsWin ? "border-l-emerald-500" : "border-l-amber-500",
      ].join(" ")}
    >
      <div className="min-w-[280px] flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {dict.resultsTable.verdictHeading}
        </div>
        <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-foreground">{line}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono text-xl font-medium tabular-nums text-foreground" suppressHydrationWarning>
          {formatRounded(best.cashFareUsd)}
        </div>
        <div className="text-[11px] text-muted">{dict.resultsTable.verdictCashLabel}</div>
      </div>
    </div>
  );
}
