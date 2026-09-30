import { describe, expect, test } from "bun:test";
import { DEALS } from "@/data/deals";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { DEAL_TEXT, dealText, isFullyTranslated } from "@/lib/i18n/deal-text";

const TRANSLATED = LOCALES.filter((l): l is Exclude<Locale, "en"> => l !== "en");

describe("deal translations", () => {
  test("every locale but English has a map", () => {
    for (const locale of TRANSLATED) {
      expect(DEAL_TEXT[locale], `no deal copy for ${locale}`).toBeDefined();
    }
  });

  /**
   * Both directions. A deal added without copy would fall back to English
   * inside an otherwise translated page, which is exactly the gap that used
   * to be papered over with a notice; a deal removed would leave copy
   * nobody can reach.
   */
  test("every deal is translated into every locale, and nothing extra", () => {
    const slugs = DEALS.map((d) => d.slug).sort();
    for (const locale of TRANSLATED) {
      expect(Object.keys(DEAL_TEXT[locale]).sort(), `${locale} key set`).toEqual(slugs);
    }
  });

  test("no translated field is empty, and the body keeps its paragraphs", () => {
    for (const locale of TRANSLATED) {
      for (const deal of DEALS) {
        const text = DEAL_TEXT[locale][deal.slug];
        expect(text.title.trim().length, `${locale}/${deal.slug} title`).toBeGreaterThan(0);
        expect(text.summary.trim().length, `${locale}/${deal.slug} summary`).toBeGreaterThan(0);
        expect(text.body.length, `${locale}/${deal.slug} body`).toBe(deal.body.length);
        for (const para of text.body) expect(para.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test("a translation is not the English left untouched", () => {
    // Japanese and the Latin-script languages alike: a body identical to the
    // original means the copy was never written, only copied across.
    for (const locale of TRANSLATED) {
      for (const deal of DEALS) {
        expect(DEAL_TEXT[locale][deal.slug].body.join(" "), `${locale}/${deal.slug}`).not.toBe(
          deal.body.join(" "),
        );
      }
    }
  });
});

describe("dealText", () => {
  test("English reads straight from the deal", () => {
    const deal = DEALS[0];
    expect(dealText(deal, "en")).toEqual({
      title: deal.title,
      summary: deal.summary,
      body: deal.body,
    });
  });

  test("another locale reads from the translation", () => {
    const deal = DEALS[0];
    expect(dealText(deal, "nl")).toEqual(DEAL_TEXT.nl[deal.slug]);
  });

  test("falls back to English rather than rendering nothing", () => {
    const missing = { ...DEALS[0], slug: "not-a-deal" };
    expect(dealText(missing, "nl").title).toBe(missing.title);
  });
});

describe("isFullyTranslated", () => {
  test("holds for every locale the site offers", () => {
    for (const locale of LOCALES) expect(isFullyTranslated(locale), locale).toBe(true);
  });
});
