"use client";

import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-context";
import { useDictionary } from "@/lib/i18n/i18n-context";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const dict = useDictionary();

  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
      <span className="sr-only">{dict.currency.label}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as (typeof CURRENCIES)[number]["code"])}
        className="cursor-pointer rounded-full border-0 bg-transparent py-1 pl-0 pr-1 text-xs font-medium text-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
