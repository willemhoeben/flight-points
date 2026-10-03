import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "../src/data/airports";
import { CHART_REGIONS, chartRegionOf } from "../src/data/chart-regions";
import { exploreDestinations, filterByRegion, summariseByRegion } from "../src/lib/explore";
import { addDays, todayIso } from "../src/lib/format";

const ROWS = exploreDestinations({ origin: "JFK", cabin: "business", startDate: addDays(todayIso(), 30) });

describe("explore region summary", () => {
  test("the scan finds destinations to summarise", () => {
    expect(ROWS.length).toBeGreaterThan(20);
  });

  test("the counts add up to the whole list", () => {
    const summed = summariseByRegion(ROWS).reduce((n, s) => n + s.count, 0);
    expect(summed).toBe(ROWS.length);
  });

  test("regions come back in chart order, and empty ones are left out", () => {
    const got = summariseByRegion(ROWS).map((s) => s.region);
    expect(got).toEqual(CHART_REGIONS.filter((r) => got.includes(r)));
    for (const s of summariseByRegion(ROWS)) expect(s.count).toBeGreaterThan(0);
  });

  test("fromMiles and bestCentsPerPoint are the real extremes of each region", () => {
    for (const s of summariseByRegion(ROWS)) {
      const inRegion = ROWS.filter((r) => chartRegionOf(r.airport) === s.region);
      expect(s.fromMiles).toBe(Math.min(...inRegion.map((r) => r.best.milesCost)));
      expect(s.bestCentsPerPoint).toBe(Math.max(...inRegion.map((r) => r.best.centsPerPoint)));
      // The cheapest award in a region is never cheaper than the cheapest
      // anywhere, which is the sanity check that catches a filter applied to
      // the wrong side of the summary.
      expect(s.fromMiles).toBeGreaterThanOrEqual(Math.min(...ROWS.map((r) => r.best.milesCost)));
    }
  });

  /**
   * The summary is built before the region filter runs, so choosing a region
   * leaves the other rows exactly where they were. A table whose numbers move
   * when you press one of its rows cannot be compared against itself.
   */
  test("filtering to one region does not change what the summary would say", () => {
    const before = summariseByRegion(ROWS);
    for (const region of CHART_REGIONS) {
      const filtered = filterByRegion(ROWS, region);
      const row = before.find((s) => s.region === region);
      if (!row) {
        expect(filtered).toEqual([]);
        continue;
      }
      expect(filtered.length).toBe(row.count);
      expect(summariseByRegion(ROWS)).toEqual(before);
    }
  });

  test("a null region keeps every row", () => {
    expect(filterByRegion(ROWS, null)).toBe(ROWS);
  });

  test("every destination found is inside exactly one summarised region", () => {
    for (const row of ROWS) {
      const region = chartRegionOf(row.airport);
      expect(region, `${row.airport.code}`).not.toBeNull();
      expect(filterByRegion(ROWS, region!)).toContain(row);
    }
  });

  test("the origin is never offered as a destination", () => {
    expect(ROWS.some((r) => r.airport.code === "JFK")).toBe(false);
    expect(ROWS.length).toBeLessThan(AIRPORTS.length);
  });
});
