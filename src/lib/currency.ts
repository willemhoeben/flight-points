import type { Locale } from "@/lib/i18n/locales";
import { toBcp47 } from "@/lib/i18n/bcp47";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "SEK" | "SGD" | "HKD";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "AU$", label: "Australian Dollar" },
  { code: "CHF", symbol: "Fr.", label: "Swiss Franc" },
  { code: "SEK", symbol: "kr", label: "Swedish Krona" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", label: "Hong Kong Dollar" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/**
 * Sensible starting currency per UI language, used only until the visitor
 * makes an explicit choice (persisted to localStorage from then on) — same
 * "infer, then let an explicit choice win" idea as the Accept-Language
 * fallback for the language switcher itself.
 */
const DEFAULT_CURRENCY_FOR_LOCALE: Record<Locale, CurrencyCode> = {
  en: "USD",
  nl: "EUR",
  de: "EUR",
  fr: "EUR",
  es: "EUR",
  it: "EUR",
  ja: "JPY",
};

export function defaultCurrencyForLocale(locale: Locale): CurrencyCode {
  return DEFAULT_CURRENCY_FOR_LOCALE[locale];
}

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
  CHF: 0.88,
  SEK: 10.45,
  SGD: 1.34,
  HKD: 7.82,
};

export function isCurrencyCode(value: string | null | undefined): value is CurrencyCode {
  return !!value && value in RATES_FROM_USD;
}

export function convertFromUsd(amountUsd: number, code: CurrencyCode): number {
  return amountUsd * RATES_FROM_USD[code];
}

export function convertToUsd(amount: number, code: CurrencyCode): number {
  return amount / RATES_FROM_USD[code];
}

export function formatCurrency(amountUsd: number, code: CurrencyCode, locale: Locale): string {
  const converted = convertFromUsd(amountUsd, code);
  return new Intl.NumberFormat(toBcp47(locale), {
    style: "currency",
    currency: code,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: code === "JPY" ? 0 : 2,
  }).format(converted);
}
