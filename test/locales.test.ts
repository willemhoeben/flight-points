import { describe, expect, test } from "bun:test";
import { DEFAULT_LOCALE, isLocale, LOCALE_LABELS, LOCALES, pickLocaleFromAcceptLanguage } from "@/lib/i18n/locales";

describe("isLocale", () => {
  test("accepts every listed locale", () => {
    for (const locale of LOCALES) {
      expect(isLocale(locale)).toBe(true);
    }
  });

  test("rejects unknown values", () => {
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("DEFAULT_LOCALE", () => {
  test("is itself a valid, listed locale", () => {
    expect(isLocale(DEFAULT_LOCALE)).toBe(true);
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });
});

describe("LOCALE_LABELS", () => {
  test("has a label for every locale, and no extras", () => {
    expect(Object.keys(LOCALE_LABELS).sort()).toEqual([...LOCALES].sort());
  });

  test("every label is a non-empty string", () => {
    for (const locale of LOCALES) {
      expect(LOCALE_LABELS[locale].length).toBeGreaterThan(0);
    }
  });
});

describe("pickLocaleFromAcceptLanguage", () => {
  test("falls back to DEFAULT_LOCALE when the header is missing or empty", () => {
    expect(pickLocaleFromAcceptLanguage(null)).toBe(DEFAULT_LOCALE);
    expect(pickLocaleFromAcceptLanguage(undefined)).toBe(DEFAULT_LOCALE);
    expect(pickLocaleFromAcceptLanguage("")).toBe(DEFAULT_LOCALE);
  });

  test("picks a supported single-language header", () => {
    expect(pickLocaleFromAcceptLanguage("nl")).toBe("nl");
    expect(pickLocaleFromAcceptLanguage("ja")).toBe("ja");
  });

  test("matches a region-qualified tag by its primary subtag", () => {
    expect(pickLocaleFromAcceptLanguage("nl-NL")).toBe("nl");
    expect(pickLocaleFromAcceptLanguage("de-DE")).toBe("de");
  });

  test("honors q-value ranking over list order", () => {
    // en listed first but lower quality than nl
    expect(pickLocaleFromAcceptLanguage("en;q=0.5,nl;q=0.9")).toBe("nl");
  });

  test("skips unsupported languages to find the best supported match", () => {
    expect(pickLocaleFromAcceptLanguage("zh-CN,zh;q=0.9,fr;q=0.8,en;q=0.5")).toBe("fr");
  });

  test("falls back to DEFAULT_LOCALE when nothing in the header is supported", () => {
    expect(pickLocaleFromAcceptLanguage("zh-CN,zh;q=0.9,ko;q=0.8")).toBe(DEFAULT_LOCALE);
  });

  test("is case-insensitive", () => {
    expect(pickLocaleFromAcceptLanguage("NL-nl")).toBe("nl");
  });

  test("treats a missing q-value as 1 (highest priority)", () => {
    expect(pickLocaleFromAcceptLanguage("de;q=0.9,nl")).toBe("nl");
  });
});
