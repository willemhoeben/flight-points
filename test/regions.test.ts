import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "../src/data/airports";
import { REGIONS, isRegion, regionOf, unmappedCountries, type Region } from "../src/data/regions";
import { dictionaries } from "../src/lib/i18n/dictionaries";
import { LOCALES } from "../src/lib/i18n/locales";

describe("regions", () => {
  /**
   * The tripwire the map exists for. Adding an airport in a country nobody
   * has placed would otherwise drop it out of every region view silently —
   * it would still be in the list, just never in a group, and the group
   * counts would quietly stop adding up to the total.
   */
  test("every airport's country has a region", () => {
    expect(unmappedCountries()).toEqual([]);
  });

  test("every airport resolves to a region in REGIONS", () => {
    for (const airport of AIRPORTS) {
      const region = regionOf(airport);
      expect(region, `${airport.code} (${airport.country})`).not.toBeNull();
      expect(REGIONS).toContain(region as Region);
    }
  });

  test("every region has at least one airport", () => {
    const used = new Set(AIRPORTS.map(regionOf));
    for (const region of REGIONS) {
      expect(used.has(region), `no airport is in ${region}`).toBe(true);
    }
  });

  test("isRegion accepts the real ones and nothing else", () => {
    for (const region of REGIONS) expect(isRegion(region)).toBe(true);
    for (const bogus of ["", "antarctica", "EUROPE", null, undefined]) {
      expect(isRegion(bogus as string | null)).toBe(false);
    }
  });

  /** A region with no name in some language renders as a blank heading. */
  test("every region is named in every language", () => {
    for (const locale of LOCALES) {
      const names = dictionaries[locale].regions;
      for (const region of REGIONS) {
        expect(names[region], `${locale} is missing ${region}`).toBeTruthy();
      }
    }
  });
});
