import { describe, expect, test } from "bun:test";
import { searchAvailability } from "@/data/availability";
import { cheapestRoundTrip, nightsAway, parseLeg, resolveTripDates } from "@/lib/trip";

const isValidDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime());

describe("parseLeg", () => {
  test("only the exact word return selects the return leg", () => {
    expect(parseLeg("return")).toBe("return");
    for (const other of ["outbound", "Return", "back", "1", "", null, undefined]) {
      expect(parseLeg(other)).toBe("outbound");
    }
  });
});

describe("resolveTripDates", () => {
  test("no return date means a one-way trip, with nothing to explain", () => {
    for (const empty of [null, undefined, ""]) {
      expect(resolveTripDates("2026-10-29", empty, isValidDate)).toEqual({
        departure: "2026-10-29",
        returnDate: null,
        issue: null,
      });
    }
  });

  test("keeps a return on or after the departure", () => {
    expect(resolveTripDates("2026-10-29", "2026-11-05", isValidDate).returnDate).toBe("2026-11-05");
    // A same-day turn is a real trip, not a mistake.
    expect(resolveTripDates("2026-10-29", "2026-10-29", isValidDate).returnDate).toBe("2026-10-29");
  });

  test("a return before the departure falls back to one way, and says why", () => {
    const t = resolveTripDates("2026-10-29", "2026-10-28", isValidDate);
    expect(t.returnDate).toBeNull();
    expect(t.issue).toBe("before-departure");
  });

  test("a garbled return date falls back to one way, and says why", () => {
    for (const bad of ["yesterday", "2026-13-40", "29/10/2026", "2026-10", "  "]) {
      const t = resolveTripDates("2026-10-29", bad, isValidDate);
      expect(t.returnDate, bad).toBeNull();
      expect(t.issue, bad).toBe("malformed");
    }
  });

  test("never reports an issue while also keeping the date", () => {
    for (const raw of [null, "", "2026-11-05", "2026-10-29", "2026-01-01", "nonsense"]) {
      const t = resolveTripDates("2026-10-29", raw, isValidDate);
      expect(t.issue === null || t.returnDate === null).toBe(true);
    }
  });
});

describe("cheapestRoundTrip", () => {
  const BASE = { origin: "JFK", destination: "LHR", cabin: "business" as const };
  const out = searchAvailability({ ...BASE, date: "2026-10-29" });
  const back = searchAvailability({ origin: "LHR", destination: "JFK", cabin: "business", date: "2026-11-05" });

  test("is the cheapest of each leg, added", () => {
    const trip = cheapestRoundTrip(out, back)!;
    expect(trip.milesCost).toBe(
      Math.min(...out.map((r) => r.milesCost)) + Math.min(...back.map((r) => r.milesCost)),
    );
  });

  test("never quotes more than forcing one program would", () => {
    const shared = new Set(out.map((r) => r.programId)).intersection(new Set(back.map((r) => r.programId)));
    const single = [...shared].map(
      (id) =>
        out.find((r) => r.programId === id)!.milesCost + back.find((r) => r.programId === id)!.milesCost,
    );
    const trip = cheapestRoundTrip(out, back)!;
    if (single.length) expect(trip.milesCost).toBeLessThanOrEqual(Math.min(...single));
  });

  test("reports whether one program covers both legs", () => {
    const trip = cheapestRoundTrip(out, back)!;
    expect(trip.sameProgram).toBe(trip.outbound.programId === trip.inbound.programId);
  });

  test("adds the taxes too, without floating-point dust", () => {
    const trip = cheapestRoundTrip(out, back)!;
    expect(trip.taxesFeesUsd).toBe(
      Math.round((trip.outbound.taxesFeesUsd + trip.inbound.taxesFeesUsd) * 100) / 100,
    );
    expect(String(trip.taxesFeesUsd).split(".")[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });

  test("an empty leg means no round trip at all", () => {
    expect(cheapestRoundTrip([], back)).toBeNull();
    expect(cheapestRoundTrip(out, [])).toBeNull();
    expect(cheapestRoundTrip([], [])).toBeNull();
  });
});

describe("nightsAway", () => {
  test("counts the nights between the two dates", () => {
    expect(nightsAway("2026-10-29", "2026-11-05")).toBe(7);
    expect(nightsAway("2026-10-29", "2026-10-30")).toBe(1);
    expect(nightsAway("2026-10-29", "2026-10-29")).toBe(0);
  });

  test("is unmoved by daylight saving, which lands inside this very range", () => {
    // Europe turns the clocks back on 25 October 2026 and the US on 1
    // November; a local-time subtraction reports 6.958 nights here.
    expect(nightsAway("2026-10-24", "2026-11-03")).toBe(10);
    expect(nightsAway("2026-03-27", "2026-04-03")).toBe(7);
  });

  test("counts across a month and a year boundary", () => {
    expect(nightsAway("2026-12-28", "2027-01-04")).toBe(7);
    expect(nightsAway("2028-02-27", "2028-03-01")).toBe(3);
  });
});
