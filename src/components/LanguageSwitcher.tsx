"use client";

import { useRouter } from "next/navigation";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const locale = useLocale();
  const dict = useDictionary();
  const router = useRouter();

  function handleChange(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Server Components (this page, the layout, every dict-reading page)
    // re-render with the new cookie value; client state elsewhere survives.
    router.refresh();
  }

  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
      <span className="sr-only">{dict.language.label}</span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value as Locale)}
        className="cursor-pointer rounded-full border-0 bg-transparent py-1 pl-0 pr-1 text-xs font-medium text-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
