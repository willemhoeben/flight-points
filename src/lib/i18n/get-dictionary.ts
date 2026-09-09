import { cache } from "react";
import { cookies } from "next/headers";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/locales";

/**
 * Reads the visitor's language preference from a cookie (set client-side by
 * LanguageSwitcher) rather than routing by locale prefix (/en/, /nl/, ...).
 * Cached per request so every Server Component that calls this only pays
 * for one cookie read.
 */
export const getDictionary = cache(async (): Promise<{ locale: Locale; dict: Dictionary }> => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;
  return { locale, dict: dictionaries[locale] };
});
