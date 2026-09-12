import { cache } from "react";
import { cookies, headers } from "next/headers";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";
import { isLocale, LOCALE_COOKIE, pickLocaleFromAcceptLanguage, type Locale } from "@/lib/i18n/locales";

/**
 * Reads the visitor's language preference from a cookie (set client-side by
 * LanguageSwitcher) rather than routing by locale prefix (/en/, /nl/, ...).
 * Before that cookie exists — a visitor's very first request — falls back to
 * the browser's own Accept-Language header instead of always defaulting to
 * English, so a Dutch or Japanese visitor sees their language immediately
 * without having to find and use the switcher.
 * Cached per request so every Server Component that calls this only pays
 * for one cookie/header read.
 */
export const getDictionary = cache(async (): Promise<{ locale: Locale; dict: Dictionary }> => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(value)
    ? value
    : pickLocaleFromAcceptLanguage((await headers()).get("accept-language"));
  return { locale, dict: dictionaries[locale] };
});
