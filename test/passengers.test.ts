import { describe, expect, test } from "bun:test";
import { DEFAULT_PASSENGERS, PASSENGER_OPTIONS, parsePassengers } from "@/lib/passengers";

describe("parsePassengers", () => {
  test("accepts every option the form offers", () => {
    for (const n of PASSENGER_OPTIONS) {
      expect(parsePassengers(String(n))).toBe(n);
    }
  });

  test("falls back to one seat for anything outside the range", () => {
    for (const bad of ["0", "-1", "5", "99", "1.5", "two", "", " ", "1e1", "Infinity"]) {
      expect(parsePassengers(bad), `?pax=${bad}`).toBe(DEFAULT_PASSENGERS);
    }
  });

  test("falls back to one seat when the parameter is absent", () => {
    expect(parsePassengers(null)).toBe(DEFAULT_PASSENGERS);
    expect(parsePassengers(undefined)).toBe(DEFAULT_PASSENGERS);
  });

  /**
   * A search URL gets shared and edited by hand, so the parser is the only
   * thing standing between a typo and a page that throws. It has to answer
   * with a usable seat count for every string, never NaN.
   */
  test("always answers with one of the offered options", () => {
    const inputs = ["2", "abc", "4", "", "0x2", "+3", "3 ", null, undefined, "١٢"];
    for (const input of inputs) {
      expect(PASSENGER_OPTIONS as readonly number[]).toContain(parsePassengers(input));
    }
  });

  test("one seat is the default, and the smallest option offered", () => {
    expect(DEFAULT_PASSENGERS).toBe(1);
    expect(Math.min(...PASSENGER_OPTIONS)).toBe(DEFAULT_PASSENGERS);
  });
});
