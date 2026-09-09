import { describe, expect, test } from "bun:test";
import { searchAvailability, searchCalendar } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";

const BASE_SEARCH = { origin: "JFK", destination: "LHR", date: "2026-10-09", cabin: "business" as const };

describe("searchAvailability", () => {
  test("is deterministic for identical inputs", () => {
    const a = searchAvailability(BASE_SEARCH);
    const b = searchAvailability(BASE_SEARCH);
    expect(a).toEqual(b);
  });

  test("only returns results for requested programs", () => {
    const results = searchAvailability({ ...BASE_SEARCH, programIds: ["united", "delta"] });
    for (const r of results) {
      expect(["united", "delta"]).toContain(r.programId);
    }
  });

  test("never returns more rows than programs searched", () => {
    const results = searchAvailability(BASE_SEARCH);
    expect(results.length).toBeLessThanOrEqual(PROGRAMS.length);
  });

  test("is sorted ascending by miles cost", () => {
    const results = searchAvailability(BASE_SEARCH);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].milesCost).toBeGreaterThanOrEqual(results[i - 1].milesCost);
    }
  });

  test("a pricier cabin never costs fewer miles than a cheaper one for the same program", () => {
    const economy = searchAvailability({ ...BASE_SEARCH, cabin: "economy", programIds: ["united"] });
    const first = searchAvailability({ ...BASE_SEARCH, cabin: "first", programIds: ["united"] });
    if (economy.length > 0 && first.length > 0) {
      expect(first[0].milesCost).toBeGreaterThan(economy[0].milesCost);
    }
  });
});

describe("searchCalendar", () => {
  test("returns one entry per requested day", () => {
    const days = searchCalendar({ ...BASE_SEARCH, startDate: "2026-10-09", days: 14 });
    expect(days).toHaveLength(14);
    expect(days[0].date).toBe("2026-10-09");
    expect(days[13].date).toBe("2026-10-22");
  });

  test("matches the cheapest same-day searchAvailability result", () => {
    const days = searchCalendar({ ...BASE_SEARCH, startDate: BASE_SEARCH.date, days: 1 });
    const direct = searchAvailability(BASE_SEARCH);
    expect(days[0].lowestMiles).toBe(direct.length > 0 ? direct[0].milesCost : null);
  });
});
