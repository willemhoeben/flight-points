export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "AU$", label: "Australian Dollar" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/**
 * Static, illustrative USD exchange rates — not a live feed, matches the
 * rest of the site's mock-data philosophy. Good enough to demonstrate
 * multi-currency display; not for anyone's actual booking decision.
 */
const RATES_FROM_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.52,
};

export function isCurrencyCode(value: string | null | undefined): value is CurrencyCode {
  return !!value && value in RATES_FROM_USD;
}

export function convertFromUsd(amountUsd: number, code: CurrencyCode): number {
  return amountUsd * RATES_FROM_USD[code];
}

export function formatCurrency(amountUsd: number, code: CurrencyCode): string {
  const converted = convertFromUsd(amountUsd, code);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: code === "JPY" ? 0 : 2,
  }).format(converted);
}
