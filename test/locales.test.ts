import { describe, expect, test } from "bun:test";
import { DEFAULT_LOCALE, isLocale, LOCALE_LABELS, LOCALES } from "@/lib/i18n/locales";

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
