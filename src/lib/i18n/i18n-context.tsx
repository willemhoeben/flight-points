"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

type I18nContextValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Hands the server-resolved locale/dictionary (read once from a cookie in
 * the root layout) down to Client Components via context, so leaf
 * components like ResultsTable don't need dict/locale prop-drilled through
 * every intermediate server component.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

export function useDictionary(): Dictionary {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useDictionary must be used within an I18nProvider");
  return ctx.dict;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used within an I18nProvider");
  return ctx.locale;
}
