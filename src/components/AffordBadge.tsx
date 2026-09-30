"use client";

import { Badge } from "@/components/ui";
import { useBalances } from "@/lib/balances-context";
import { formatMiles } from "@/lib/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { interpolate } from "@/lib/i18n/format";
import { affordability, currencyName } from "@/lib/wallet";

/**
 * What the visitor's own balances say about one award: covered outright,
 * covered after a named transfer, short by a stated number of miles, or out
 * of reach entirely.
 *
 * Renders nothing until a balance is entered on /wallet, so every page that
 * uses it looks exactly as it did before for anyone who has not been there.
 * A client island rather than a prop, because the balances live in the
 * browser and the pages around it are server-rendered.
 */
export function AffordBadge({ programId, milesCost }: { programId: string; milesCost: number }) {
  const { balances } = useBalances();
  const dict = useDictionary();
  const locale = useLocale();

  const state = affordability(balances, programId, milesCost);
  if (state.kind === "unknown") return null;

  if (state.kind === "covered") return <Badge accent="emerald">{dict.resultsTable.affordCovered}</Badge>;

  if (state.kind === "transfer") {
    return (
      <Badge accent="amber">
        {interpolate(dict.resultsTable.affordVia, { source: currencyName(state.via) })}
      </Badge>
    );
  }

  if (state.kind === "short") {
    return (
      <span
        className="inline-flex items-center bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted"
        suppressHydrationWarning
      >
        {interpolate(dict.resultsTable.affordShort, { miles: formatMiles(state.shortfall, locale) })}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
      {dict.resultsTable.affordNoRoute}
    </span>
  );
}
