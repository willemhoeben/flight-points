"use client";

import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-context";
import { useDictionary } from "@/lib/i18n/i18n-context";
import { BARE_SELECT } from "@/components/ui";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const dict = useDictionary();

  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
      <span className="sr-only">{dict.currency.label}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as (typeof CURRENCIES)[number]["code"])}
        className={BARE_SELECT}
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
