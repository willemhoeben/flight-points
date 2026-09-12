export const LOCALES = ["en", "nl", "de", "fr", "es", "it", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  ja: "日本語",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "locale";

/**
 * Picks the best-supported locale from a raw `Accept-Language` header
 * (e.g. "nl-NL,nl;q=0.9,en;q=0.8"), used for a first-time visitor who
 * hasn't set the locale cookie yet. Falls back to DEFAULT_LOCALE when the
 * header is missing or names nothing we support.
 */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1;
      const primary = tag.trim().split("-")[0].toLowerCase();
      return { primary, q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);
  for (const { primary } of ranked) {
    if (isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}
