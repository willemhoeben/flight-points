import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "@/data/airports";
import { exploreDestinations, isExploreSort, sortDestinations } from "@/lib/explore";

const params = { origin: "JFK", cabin: "business" as const, startDate: "2026-06-01" };

describe("exploreDestinations", () => {
  const rows = exploreDestinations(params);

  test("covers every airport except the origin and its own metro area", () => {
    const codes = rows.map((r) => r.airport.code);
    expect(codes).not.toContain("JFK");
    // EWR is 35 km from JFK, so it is not a route anyone redeems for.
    expect(codes).not.toContain("EWR");
    expect(codes.length).toBe(AIRPORTS.length - 2);
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
