import { describe, expect, test } from "bun:test";
import { alternateOgLocales, BCP47, toBcp47, toOgLocale } from "@/lib/i18n/bcp47";
import { LOCALES } from "@/lib/i18n/locales";

describe("toBcp47", () => {
  test("returns a valid BCP-47 tag for every supported locale", () => {
    for (const locale of LOCALES) {
      expect(toBcp47(locale)).toBe(BCP47[locale]);
      expect(toBcp47(locale)).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    }
  });

  test("every tag is accepted by Intl formatters without throwing", () => {
    for (const locale of LOCALES) {
      expect(() => new Intl.NumberFormat(toBcp47(locale))).not.toThrow();
    }
  });

  test("maps English to en-US", () => {
    expect(toBcp47("en")).toBe("en-US");
  });
});

describe("toOgLocale", () => {
  test("returns the underscore-separated Open Graph form for every locale", () => {
    for (const locale of LOCALES) {
      expect(toOgLocale(locale)).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
      expect(toOgLocale(locale)).toBe(toBcp47(locale).replace("-", "_"));
    }
  });

  test("maps English to en_US", () => {
    expect(toOgLocale("en")).toBe("en_US");
  });
});

describe("alternateOgLocales", () => {
  test("returns every other locale's tag, excluding the current one", () => {
    for (const locale of LOCALES) {
      const alternates = alternateOgLocales(locale);
      expect(alternates).toHaveLength(LOCALES.length - 1);
      expect(alternates).not.toContain(toOgLocale(locale));
      for (const other of LOCALES) {
        if (other !== locale) expect(alternates).toContain(toOgLocale(other));
      }
    }
  });
});
