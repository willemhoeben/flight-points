import { describe, expect, test } from "bun:test";
import { cashFareUsd, searchAvailability, searchCalendar } from "@/data/availability";
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

  /**
   * The calendar is the one place that quotes a price for a day the visitor
   * has not opened yet. If it ignored the party size it would advertise a
   * cheaper day that the search then shows as empty.
   */
  test("minSeats only ever quotes a day the same search would show", () => {
    for (const minSeats of [1, 2, 3, 4]) {
      const days = searchCalendar({ ...BASE_SEARCH, startDate: "2026-10-01", days: 30, minSeats });
      for (const day of days) {
        if (day.lowestMiles === null) continue;
        const rows = searchAvailability({ ...BASE_SEARCH, date: day.date }).filter(
          (r) => r.seatsRemaining >= minSeats,
        );
        expect(rows.length, `${day.date} with ${minSeats} seats`).toBeGreaterThan(0);
        expect(day.lowestMiles).toBe(rows[0].milesCost);
      }
    }
  });

  test("asking for more seats never opens a day that one seat could not", () => {
    const one = searchCalendar({ ...BASE_SEARCH, startDate: "2026-10-01", days: 30, minSeats: 1 });
    const four = searchCalendar({ ...BASE_SEARCH, startDate: "2026-10-01", days: 30, minSeats: 4 });
    for (let i = 0; i < one.length; i++) {
      if (four[i].lowestMiles !== null) expect(one[i].lowestMiles).not.toBeNull();
    }
  });

  test("defaults to one seat when minSeats is left out", () => {
    const implicit = searchCalendar({ ...BASE_SEARCH, startDate: "2026-10-01", days: 14 });
    const explicit = searchCalendar({ ...BASE_SEARCH, startDate: "2026-10-01", days: 14, minSeats: 1 });
    expect(implicit).toEqual(explicit);
  });
});

describe("distance-aware pricing", () => {
  const base = { date: "2026-06-01", cabin: "business" as const };

  test("prices a long route above a short one", () => {
    const short = searchAvailability({ ...base, origin: "AMS", destination: "LHR" });
    const long = searchAvailability({ ...base, origin: "JFK", destination: "SYD" });
    expect(Math.min(...long.map((r) => r.milesCost))).toBeGreaterThan(
      Math.max(...short.map((r) => r.milesCost)),
    );
  });

  test("returns nothing for two airports in the same metro area", () => {
    expect(searchAvailability({ ...base, origin: "JFK", destination: "EWR" })).toEqual([]);
    expect(searchAvailability({ ...base, origin: "HND", destination: "NRT" })).toEqual([]);
  });

  test("flight times track the distance flown", () => {
    const shortHop = searchAvailability({ ...base, origin: "AMS", destination: "LHR" })
      .filter((r) => r.direct);
    const longHaul = searchAvailability({ ...base, origin: "JFK", destination: "HND" })
      .filter((r) => r.direct);
    // ~365 km: well under two hours. ~10,850 km: comfortably over ten.
    for (const r of shortHop) expect(r.durationMinutes).toBeLessThan(120);
    for (const r of longHaul) expect(r.durationMinutes).toBeGreaterThan(600);
  });

  test("short routes never claim two connections", () => {
    const rows = searchAvailability({ ...base, origin: "AMS", destination: "MAD" });
    for (const r of rows) expect(r.connections).toBeLessThanOrEqual(1);
  });
});

describe("cash fare and cents per point", () => {
  test("every program sees the same cash fare for the same seat", () => {
    const rows = searchAvailability({
      origin: "JFK", destination: "LHR", date: "2026-06-01", cabin: "business",
    });
    expect(new Set(rows.map((r) => r.cashFareUsd)).size).toBe(1);
  });

  test("a premium cabin costs more in cash than economy on the same route", () => {
    const shared = { origin: "JFK", destination: "LHR", date: "2026-06-01" };
    const economy = cashFareUsd({ ...shared, cabin: "economy" });
    const business = cashFareUsd({ ...shared, cabin: "business" });
    expect(business).toBeGreaterThan(economy * 3);
  });

  test("cents per point is the cash fare net of taxes, over the miles", () => {
    const rows = searchAvailability({
      origin: "JFK", destination: "HND", date: "2026-06-01", cabin: "business",
    });
    for (const r of rows) {
      const expected = Math.round(((r.cashFareUsd - r.taxesFeesUsd) / r.milesCost) * 10000) / 100;
      expect(r.centsPerPoint).toBe(expected);
    }
  });

  test("long-haul premium beats short-haul economy on value per point", () => {
    const shortEconomy = searchAvailability({
      origin: "AMS", destination: "LHR", date: "2026-06-01", cabin: "economy",
    });
    const longBusiness = searchAvailability({
      origin: "JFK", destination: "HND", date: "2026-06-01", cabin: "business",
    });
    expect(Math.max(...longBusiness.map((r) => r.centsPerPoint))).toBeGreaterThan(
      Math.max(...shortEconomy.map((r) => r.centsPerPoint)),
    );
  });

  test("never reports a negative value per point", () => {
    for (const cabin of ["economy", "premium", "business", "first"] as const) {
      for (const [o, d] of [["AMS", "LHR"], ["JFK", "MIA"], ["JFK", "SYD"]]) {
        for (const r of searchAvailability({ origin: o, destination: d, date: "2026-06-01", cabin })) {
          expect(r.centsPerPoint).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
