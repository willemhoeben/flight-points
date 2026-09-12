import { describe, expect, test } from "bun:test";
import { VALUATIONS } from "@/data/valuations";
import { VALUATION_NOTES, valuationNote } from "@/lib/i18n/valuation-notes";
import { LOCALES } from "@/lib/i18n/locales";

const TRANSLATED = LOCALES.filter((l) => l !== "en");
const IDS = VALUATIONS.map((v) => v.id).sort();

describe("VALUATION_NOTES", () => {
  test("covers every currency in every translated locale", () => {
    // The point of the test: adding a currency to the data file without
    // translating its note would silently ship one English line into six
    // otherwise-translated tables.
    for (const locale of TRANSLATED) {
      expect(Object.keys(VALUATION_NOTES[locale]).sort()).toEqual(IDS);
    }
  });

  test("has no entries for currencies that no longer exist", () => {
    // Same check from the other direction — a removed currency leaves six
    // orphaned translations that nothing renders.
    for (const locale of TRANSLATED) {
      for (const id of Object.keys(VALUATION_NOTES[locale])) {
        expect(IDS).toContain(id);
      }
    }
  });

  test("every note is non-empty and distinct from the English original", () => {
    for (const locale of TRANSLATED) {
      for (const v of VALUATIONS) {
        const note = VALUATION_NOTES[locale][v.id];
        expect(note.trim().length).toBeGreaterThan(0);
        expect(note).not.toBe(v.notes);
      }
    }
  });
});

describe("valuationNote", () => {
  test("returns the data file's own wording for English", () => {
    for (const v of VALUATIONS) {
      expect(valuationNote(v.id, "en", v.notes)).toBe(v.notes);
    }
  });

  test("returns the translation for every other locale", () => {
    for (const locale of TRANSLATED) {
      for (const v of VALUATIONS) {
        expect(valuationNote(v.id, locale, v.notes)).toBe(VALUATION_NOTES[locale][v.id]);
      }
    }
  });

  test("falls back to the English original for an unknown id", () => {
    expect(valuationNote("not-a-currency", "nl", "fallback text")).toBe("fallback text");
  });
});
