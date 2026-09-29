"use client";

import { useCurrency } from "@/lib/currency-context";

/**
 * Renders a USD figure in the visitor's chosen display currency. Server pages
 * can't reach the currency context themselves, so this thin client component
 * is the boundary — it keeps the rest of a page server-rendered.
 */
export function CurrencyAmount({ usd, rounded = false }: { usd: number; rounded?: boolean }) {
  const { format, formatRounded } = useCurrency();
  return <span suppressHydrationWarning>{rounded ? formatRounded(usd) : format(usd)}</span>;
}
