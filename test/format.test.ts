import { describe, expect, test } from "bun:test";
import { addDays, formatDateLabel, formatDateShort, formatDuration, formatMiles } from "@/lib/format";

describe("formatMiles", () => {
  test("adds thousands separators", () => {
    expect(formatMiles(65000)).toBe("65,000");
    expect(formatMiles(500)).toBe("500");
  });
});

describe("formatDuration", () => {
  test("splits minutes into hours and zero-padded minutes", () => {
    expect(formatDuration(605)).toBe("10h 05m");
    expect(formatDuration(60)).toBe("1h 00m");
    expect(formatDuration(45)).toBe("0h 45m");
  });
});

describe("addDays", () => {
  test("adds days across a month boundary", () => {
    expect(addDays("2026-01-30", 3)).toBe("2026-02-02");
  });

  test("supports negative offsets", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("date labels", () => {
  test("formatDateLabel includes weekday, month, and day", () => {
    // 2026-09-09 is a Wednesday.
    expect(formatDateLabel("2026-09-09")).toBe("Wed, Sep 9");
  });

  test("formatDateShort omits the month", () => {
    expect(formatDateShort("2026-09-09")).toBe("9 Wed");
  });
});
