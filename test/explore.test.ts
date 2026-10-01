import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "@/data/airports";
import { searchAvailability } from "@/data/availability";
import { distanceKm, MIN_ROUTE_KM } from "@/lib/distance";
import { exploreDestinations, isExploreSort, sortDestinations } from "@/lib/explore";

const params = { origin: "JFK", cabin: "business" as const, startDate: "2026-06-01" };

describe("exploreDestinations", () => {
  const rows = exploreDestinations(params);

  /**
   * Stated as the rule rather than a count: New York has three gateways
   * now and could have four, and a test that hard-codes how many are
   * dropped fails on the day one is added rather than on the day the rule
   * breaks.
   */
  test("covers every airport except the origin and its own metro area", () => {
    const codes = new Set(rows.map((r) => r.airport.code));
    const nearJfk = AIRPORTS.filter((a) => distanceKm("JFK", a.code) < MIN_ROUTE_KM).map((a) => a.code);
    expect(nearJfk).toContain("JFK");
    expect(nearJfk).toContain("EWR");
    expect(nearJfk).toContain("LGA");
    for (const code of nearJfk) expect(codes.has(code), `${code} is in the JFK metro`).toBe(false);
    expect(codes.size).toBe(AIRPORTS.length - nearJfk.length);
  });

  test("is sorted cheapest first", () => {
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].best.milesCost).toBeGreaterThanOrEqual(rows[i - 1].best.milesCost);
    }
  });

  test("spreads prices by distance rather than bunching them", () => {
    const cheapest = rows[0].best.milesCost;
    const priciest = rows[rows.length - 1].best.milesCost;
    // Before distance pricing every destination landed within a few thousand
    // miles of every other, which made the whole page useless.
    expect(priciest / cheapest).toBeGreaterThan(2);
  });

  test("puts a neighbour ahead of the far side of the world", () => {
    const rank = (code: string) => rows.findIndex((r) => r.airport.code === code);
    expect(rank("IAD")).toBeLessThan(rank("SYD"));
    expect(rank("LHR")).toBeLessThan(rank("HND"));
  });

  test("carries the date the cheapest award was found on", () => {
    for (const r of rows) expect(r.best.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("is deterministic", () => {
    expect(exploreDestinations(params).map((r) => r.best.milesCost)).toEqual(rows.map((r) => r.best.milesCost));
  });

  test("honours the program filter", () => {
    const united = exploreDestinations({ ...params, programIds: ["united"] });
    for (const r of united) expect(r.best.programId).toBe("united");
  });
});

describe("sortDestinations", () => {
  const rows = exploreDestinations(params);

  test("leaves the cheapest-first order alone", () => {
    expect(sortDestinations(rows, "cheapest")).toBe(rows);
  });

  test("ranks by value per point without mutating the input", () => {
    const byValue = sortDestinations(rows, "value");
    for (let i = 1; i < byValue.length; i++) {
      expect(byValue[i].best.centsPerPoint).toBeLessThanOrEqual(byValue[i - 1].best.centsPerPoint);
    }
    expect(rows[0].airport.code).toBe(exploreDestinations(params)[0].airport.code);
  });

  test("picks a different winner than cheapest does", () => {
    expect(sortDestinations(rows, "value")[0].airport.code).not.toBe(rows[0].airport.code);
  });
});

describe("isExploreSort", () => {
  test("accepts the two sorts and nothing else", () => {
    expect(isExploreSort("cheapest")).toBe(true);
    expect(isExploreSort("value")).toBe(true);
    expect(isExploreSort("price")).toBe(false);
    expect(isExploreSort(undefined)).toBe(false);
  });
});

describe("exploreDestinations with a party", () => {
  const base = { origin: "JFK", cabin: "business" as const, startDate: "2026-06-01" };

  test("only ever shows a destination the search would also show", () => {
    for (const minSeats of [1, 2, 3, 4]) {
      for (const row of exploreDestinations({ ...base, minSeats })) {
        expect(row.best.seatsRemaining, `${row.airport.code} with ${minSeats} seats`).toBeGreaterThanOrEqual(minSeats);
        const rows = searchAvailability({
          origin: base.origin,
          destination: row.airport.code,
          date: row.best.date,
          cabin: base.cabin,
        }).filter((r) => r.seatsRemaining >= minSeats);
        expect(rows.length, `${row.airport.code} on ${row.best.date}`).toBeGreaterThan(0);
      }
    }
  });

  test("asking for more seats never adds a destination", () => {
    const one = new Set(exploreDestinations({ ...base, minSeats: 1 }).map((r) => r.airport.code));
    for (const n of [2, 3, 4]) {
      for (const row of exploreDestinations({ ...base, minSeats: n })) {
        expect(one.has(row.airport.code), `${row.airport.code} at ${n} seats`).toBe(true);
      }
    }
  });

  test("a bigger party never finds a cheaper award than a smaller one", () => {
    const byCode = (n: number) =>
      new Map(exploreDestinations({ ...base, minSeats: n }).map((r) => [r.airport.code, r.best.milesCost]));
    const one = byCode(1);
    for (const [code, miles] of byCode(3)) {
      expect(miles, code).toBeGreaterThanOrEqual(one.get(code)!);
    }
  });

  test("defaults to one seat", () => {
    expect(exploreDestinations(base)).toEqual(exploreDestinations({ ...base, minSeats: 1 }));
  });
});
