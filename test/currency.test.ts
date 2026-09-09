import { describe, expect, test } from "bun:test";
import { CURRENCIES, convertFromUsd, formatCurrency, isCurrencyCode } from "@/lib/currency";

describe("convertFromUsd", () => {
  test("USD is identity", () => {
    expect(convertFromUsd(100, "USD")).toBe(100);
  });

  test("converts to every listed currency at a positive rate", () => {
    for (const { code } of CURRENCIES) {
      expect(convertFromUsd(100, code)).toBeGreaterThan(0);
    }
  });

  test("scales linearly with amount", () => {
    const single = convertFromUsd(1, "EUR");
    expect(convertFromUsd(50, "EUR")).toBeCloseTo(single * 50, 6);
  });

  test("zero converts to zero in every currency", () => {
    for (const { code } of CURRENCIES) {
      expect(convertFromUsd(0, code)).toBe(0);
    }
  });
});

describe("formatCurrency", () => {
  test("formats USD with a dollar sign and two decimals", () => {
    expect(formatCurrency(205, "USD")).toBe("$205.00");
  });

  test("formats JPY with no decimal places", () => {
    expect(formatCurrency(100, "JPY")).not.toContain(".");
  });

  test("every listed currency formats without throwing and includes a digit", () => {
    for (const { code } of CURRENCIES) {
      const formatted = formatCurrency(42, code);
      expect(formatted).toMatch(/\d/);
    }
  });
});

describe("isCurrencyCode", () => {
  test("accepts every known currency code", () => {
    for (const { code } of CURRENCIES) {
      expect(isCurrencyCode(code)).toBe(true);
    }
  });

  test("rejects unknown or missing values", () => {
    expect(isCurrencyCode("XXX")).toBe(false);
    expect(isCurrencyCode(undefined)).toBe(false);
    expect(isCurrencyCode(null)).toBe(false);
    expect(isCurrencyCode("")).toBe(false);
  });
});
