import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "../src/data/airports";
import { CHART_REGIONS, isChartRegion, chartRegionOf, unmappedCountries, type ChartRegion } from "../src/data/chart-regions";
import { REGION_ORDER } from "../src/data/networks";
import { dictionaries } from "../src/lib/i18n/dictionaries";
import { LOCALES } from "../src/lib/i18n/locales";

describe("chart regions", () => {
  /**
   * There are two region schemes in this codebase and they mean different
   * things: these nine price an award, and `Region` in data/networks.ts
   * describes which continents an airline's own metal reaches. Handing a
   * value from one to the other matches nothing, so the page empties
   * silently instead of throwing — which is exactly how it was found,
   * after a redefinition in the single-file build wiped out every route.
   *
   * Keeping the two sets textually disjoint means a mix-up can never be a
   * near-miss that half works.
   */
  test("the two region vocabularies share no value", () => {
    const reach: string[] = [...REGION_ORDER];
    for (const chart of CHART_REGIONS) {
      expect(reach, `"${chart}" is in both schemes`).not.toContain(chart as string);
    }
    // And the shapes differ, so even a careless comparison looks wrong.
    for (const chart of CHART_REGIONS) expect(chart).toMatch(/^[a-z-]+$/);
    for (const r of reach) expect(r).toMatch(/^[A-Z]/);
  });

  /**
   * The tripwire the map exists for. Adding an airport in a country nobody
   * has placed would otherwise drop it out of every region view silently —
   * it would still be in the list, just never in a group, and the group
   * counts would quietly stop adding up to the total.
   */
  test("every airport's country has a region", () => {
    expect(unmappedCountries()).toEqual([]);
  });

  test("every airport resolves to a region in CHART_REGIONS", () => {
    for (const airport of AIRPORTS) {
      const region = chartRegionOf(airport);
      expect(region, `${airport.code} (${airport.country})`).not.toBeNull();
      expect(CHART_REGIONS).toContain(region as ChartRegion);
    }
  });

  test("every region has at least one airport", () => {
    const used = new Set(AIRPORTS.map(chartRegionOf));
    for (const region of CHART_REGIONS) {
      expect(used.has(region), `no airport is in ${region}`).toBe(true);
    }
  });

  test("isChartRegion accepts the real ones and nothing else", () => {
    for (const region of CHART_REGIONS) expect(isChartRegion(region)).toBe(true);
    for (const bogus of ["", "antarctica", "EUROPE", null, undefined]) {
      expect(isChartRegion(bogus as string | null)).toBe(false);
    }
  });

  /** A region with no name in some language renders as a blank heading. */
  test("every region is named in every language", () => {
    for (const locale of LOCALES) {
      const names = dictionaries[locale].regions;
      for (const region of CHART_REGIONS) {
        expect(names[region], `${locale} is missing ${region}`).toBeTruthy();
      }
    }
  });
});
