import { AIRPORTS, type Airport } from "@/data/airports";

/**
 * The regions award charts are actually priced in.
 *
 * Every programme in this dataset publishes its chart as a grid of regions —
 * "North America to Europe, business, 60,000" — so these are not an invented
 * taxonomy, they are the vocabulary the subject already uses. Someone asking
 * "where can I go with my points" is asking a question about regions, and a
 * list of 104 cities sorted by price answers a different one.
 *
 * The order is the one charts are printed in: your own hemisphere first, then
 * east around the world. It is fixed, so a region never moves because the
 * data changed.
 */
export const REGIONS = [
  "north-america",
  "latin-america",
  "europe",
  "africa",
  "middle-east",
  "south-asia",
  "southeast-asia",
  "north-asia",
  "oceania",
] as const;

export type Region = (typeof REGIONS)[number];

export function isRegion(value: string | null | undefined): value is Region {
  return !!value && (REGIONS as readonly string[]).includes(value);
}

/**
 * By country, not by coordinates.
 *
 * Latitude and longitude would look like the principled choice and would be
 * worse: every real boundary here is political rather than geometric. Turkey
 * and Israel sit in Europe's longitudes and in the Middle East's charts;
 * Egypt and Morocco are African by land and Middle Eastern by several
 * programmes' reckoning; a box drawn round the Pacific puts Hawaii and Fiji
 * in the same bucket. Naming countries is honest about that, and a wrong
 * entry is one line to fix instead of a boundary to re-derive.
 *
 * Unmapped is a build failure, not a fallback: test/regions.test.ts fails if
 * any airport's country is missing here, so adding an airport forces the
 * decision rather than quietly dropping it out of every region view.
 */
const REGION_BY_COUNTRY: Record<string, Region> = {
  "United States": "north-america",
  Canada: "north-america",
  Mexico: "north-america",

  "Costa Rica": "latin-america",
  Panama: "latin-america",
  Colombia: "latin-america",
  Peru: "latin-america",
  Chile: "latin-america",
  Argentina: "latin-america",
  Brazil: "latin-america",

  "United Kingdom": "europe",
  Ireland: "europe",
  Netherlands: "europe",
  Belgium: "europe",
  France: "europe",
  Germany: "europe",
  Switzerland: "europe",
  Austria: "europe",
  Italy: "europe",
  Spain: "europe",
  Portugal: "europe",
  Greece: "europe",
  Czechia: "europe",
  Hungary: "europe",
  Poland: "europe",
  Denmark: "europe",
  Norway: "europe",
  Sweden: "europe",
  Finland: "europe",
  Iceland: "europe",

  Morocco: "africa",
  Ghana: "africa",
  Nigeria: "africa",
  Ethiopia: "africa",
  Kenya: "africa",
  "South Africa": "africa",
  Mauritius: "africa",

  // Turkey, Israel and Egypt are the three that could defensibly sit in
  // Europe or Africa. Every chart in this dataset prices them east, so they
  // go east.
  Turkey: "middle-east",
  Israel: "middle-east",
  Egypt: "middle-east",
  "Saudi Arabia": "middle-east",
  Qatar: "middle-east",
  "United Arab Emirates": "middle-east",

  India: "south-asia",
  "Sri Lanka": "south-asia",
  Maldives: "south-asia",

  Thailand: "southeast-asia",
  Vietnam: "southeast-asia",
  Malaysia: "southeast-asia",
  Singapore: "southeast-asia",
  Indonesia: "southeast-asia",
  Philippines: "southeast-asia",

  China: "north-asia",
  "Hong Kong": "north-asia",
  Taiwan: "north-asia",
  "South Korea": "north-asia",
  Japan: "north-asia",

  Australia: "oceania",
  "New Zealand": "oceania",
  Fiji: "oceania",
  "French Polynesia": "oceania",
};

/** The region an airport is priced in, or null if its country is unmapped. */
export function regionOf(airport: Airport): Region | null {
  return REGION_BY_COUNTRY[airport.country] ?? null;
}

/** Countries with no region, for the test that keeps this file honest. */
export function unmappedCountries(): string[] {
  return [...new Set(AIRPORTS.map((a) => a.country))].filter((c) => !(c in REGION_BY_COUNTRY)).sort();
}
