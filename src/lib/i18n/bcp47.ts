import type { Locale } from "@/lib/i18n/locales";

/** Maps our short locale codes to a full BCP-47 tag for Intl formatters. */
export const BCP47: Record<Locale, string> = {
  en: "en-US",
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
};

export function toBcp47(locale: Locale): string {
  return BCP47[locale];
}
