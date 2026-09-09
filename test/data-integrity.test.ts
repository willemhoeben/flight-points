import { describe, expect, test } from "bun:test";
import { AIRPORTS, findAirport } from "@/data/airports";
import { PROGRAMS, findProgram, type Alliance } from "@/data/programs";
import { DEALS, findDeal, type DealCategory } from "@/data/deals";
import { VALUATIONS, findValuation } from "@/data/valuations";

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

describe("AIRPORTS", () => {
  test("codes are unique", () => {
    const codes = AIRPORTS.map((a) => a.code);
    expect(uniqueValues(codes)).toHaveLength(codes.length);
  });

  test("every airport has a non-empty city, country, and name", () => {
    for (const airport of AIRPORTS) {
      expect(airport.city.length).toBeGreaterThan(0);
      expect(airport.country.length).toBeGreaterThan(0);
      expect(airport.name.length).toBeGreaterThan(0);
    }
  });

  test("findAirport looks up every known code and rejects unknown ones", () => {
    for (const airport of AIRPORTS) {
      expect(findAirport(airport.code)).toEqual(airport);
    }
    expect(findAirport("ZZZ")).toBeUndefined();
  });
});

describe("PROGRAMS", () => {
  const VALID_ALLIANCES: Alliance[] = ["Star Alliance", "Oneworld", "SkyTeam", "Unaligned"];

  test("ids are unique", () => {
    const ids = PROGRAMS.map((p) => p.id);
    expect(uniqueValues(ids)).toHaveLength(ids.length);
  });

  test("every program has a recognized alliance", () => {
    for (const program of PROGRAMS) {
      expect(VALID_ALLIANCES).toContain(program.alliance);
    }
  });

  test("findProgram looks up every known id and rejects unknown ones", () => {
    for (const program of PROGRAMS) {
      expect(findProgram(program.id)).toEqual(program);
    }
    expect(findProgram("not-a-real-program")).toBeUndefined();
  });
});

describe("DEALS", () => {
  const VALID_CATEGORIES: DealCategory[] = ["transfer-bonus", "sweet-spot", "sale"];
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

  test("slugs are unique", () => {
    const slugs = DEALS.map((d) => d.slug);
    expect(uniqueValues(slugs)).toHaveLength(slugs.length);
  });

  test("every deal has a recognized category and a non-empty program label", () => {
    for (const deal of DEALS) {
      expect(VALID_CATEGORIES).toContain(deal.category);
      expect(deal.program.length).toBeGreaterThan(0);
    }
  });

  test("publishedAt and expires (when present) are ISO dates, and expires is not before publishedAt", () => {
    for (const deal of DEALS) {
      expect(deal.publishedAt).toMatch(ISO_DATE);
      if (deal.expires) {
        expect(deal.expires).toMatch(ISO_DATE);
        expect(deal.expires >= deal.publishedAt).toBe(true);
      }
    }
  });

  test("bonusPercent, when present, is a plausible positive percentage", () => {
    for (const deal of DEALS) {
      if (deal.bonusPercent !== undefined) {
        expect(deal.bonusPercent).toBeGreaterThan(0);
        expect(deal.bonusPercent).toBeLessThanOrEqual(100);
      }
    }
  });

  test("every deal has at least one body paragraph", () => {
    for (const deal of DEALS) {
      expect(deal.body.length).toBeGreaterThan(0);
    }
  });

  test("findDeal looks up every known slug and rejects unknown ones", () => {
    for (const deal of DEALS) {
      expect(findDeal(deal.slug)).toEqual(deal);
    }
    expect(findDeal("not-a-real-deal")).toBeUndefined();
  });
});

describe("VALUATIONS", () => {
  test("ids are unique", () => {
    const ids = VALUATIONS.map((v) => v.id);
    expect(uniqueValues(ids)).toHaveLength(ids.length);
  });

  test("centsPerPoint is a positive number for every currency", () => {
    for (const valuation of VALUATIONS) {
      expect(valuation.centsPerPoint).toBeGreaterThan(0);
    }
  });

  test("findValuation looks up every known id and rejects unknown ones", () => {
    for (const valuation of VALUATIONS) {
      expect(findValuation(valuation.id)).toEqual(valuation);
    }
    expect(findValuation("not-a-real-currency")).toBeUndefined();
  });
});
