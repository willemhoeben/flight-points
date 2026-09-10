import { describe, expect, test } from "bun:test";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { LOCALES } from "@/lib/i18n/locales";

describe("dealCategoryLabel", () => {
  test("maps each category to its dedicated dictionary label", () => {
    const dict = dictionaries.en.dealsPage;
    expect(dealCategoryLabel("transfer-bonus", dict)).toBe(dict.categoryTransferBonus);
    expect(dealCategoryLabel("sale", dict)).toBe(dict.categorySale);
    expect(dealCategoryLabel("sweet-spot", dict)).toBe(dict.categorySweetSpot);
  });

  test("resolves to a non-empty label in every locale", () => {
    for (const locale of LOCALES) {
      const dict = dictionaries[locale].dealsPage;
      for (const category of ["transfer-bonus", "sweet-spot", "sale"] as const) {
        expect(dealCategoryLabel(category, dict).length).toBeGreaterThan(0);
      }
    }
  });
});
