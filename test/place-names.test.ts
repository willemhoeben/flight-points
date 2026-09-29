import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "@/data/airports";
import { LOCALES } from "@/lib/i18n/locales";
import { CITY_NAMES, cityName, COUNTRY_NAMES, countryName } from "@/lib/i18n/place-names";

const OTHERS = LOCALES.filter((l) => l !== "en");

describe("place names", () => {
  test("every airport city has a translation in every other locale", () => {
    for (const a of AIRPORTS) {
      const entry = CITY_NAMES[a.city];
      expect(entry, `no entry for ${a.city}`).toBeDefined();
      for (const l of OTHERS) expect(entry[l], `${a.city} missing ${l}`).toBeTruthy();
    }
  });

  test("every airport country has a translation in every other locale", () => {
    for (const a of AIRPORTS) {
      const entry = COUNTRY_NAMES[a.country];
      expect(entry, `no entry for ${a.country}`).toBeDefined();
      for (const l of OTHERS) expect(entry[l], `${a.country} missing ${l}`).toBeTruthy();
    }
  });

  test("English reads straight from the data", () => {
    const ams = AIRPORTS.find((a) => a.code === "AMS")!;
    expect(cityName(ams, "en")).toBe("Amsterdam");
    expect(countryName(ams, "en")).toBe("Netherlands");
  });

  test("other locales get their own spelling", () => {
    const cph = AIRPORTS.find((a) => a.code === "CPH")!;
    expect(cityName(cph, "nl")).toBe("Kopenhagen");
    expect(cityName(cph, "fr")).toBe("Copenhague");
    expect(cityName(cph, "ja")).toBe("コペンハーゲン");
    expect(countryName(cph, "de")).toBe("Dänemark");
  });

  test("falls back to the data when a place has no entry", () => {
    const made_up = { code: "ZZZ", city: "Nowhere", country: "Neverland", name: "", lat: 0, lon: 0 };
    expect(cityName(made_up, "nl")).toBe("Nowhere");
    expect(countryName(made_up, "ja")).toBe("Neverland");
  });

  test("carries no entries for places the data does not have", () => {
    const cities = new Set(AIRPORTS.map((a) => a.city));
    const countries = new Set(AIRPORTS.map((a) => a.country));
    expect(Object.keys(CITY_NAMES).filter((c) => !cities.has(c))).toEqual([]);
    expect(Object.keys(COUNTRY_NAMES).filter((c) => !countries.has(c))).toEqual([]);
  });
});
