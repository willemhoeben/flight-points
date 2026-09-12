import { LOCALES, type Locale } from "@/lib/i18n/locales";

/** Maps our short locale codes to a full BCP-47 tag for Intl formatters. */
export const BCP47: Record<Locale, string> = {
  en: "en-US",
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  ja: "ja-JP",
};

export function toBcp47(locale: Locale): string {
  return BCP47[locale];
}

/** Maps our short locale codes to the underscore-separated form Open Graph
 * expects for og:locale / og:locale:alternate (e.g. "en_US", not "en-US"). */
export function toOgLocale(locale: Locale): string {
  return BCP47[locale].replace("-", "_");
}

/** The other six locales' Open Graph tags, for og:locale:alternate — every
 * page lives at one URL regardless of language (cookie-based, not
 * route-based), so all of them are genuinely alternates of the current one. */
export function alternateOgLocales(locale: Locale): string[] {
  return LOCALES.filter((l) => l !== locale).map(toOgLocale);
}
