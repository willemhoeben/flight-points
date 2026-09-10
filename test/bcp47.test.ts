import { describe, expect, test } from "bun:test";
import { BCP47, toBcp47 } from "@/lib/i18n/bcp47";
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
