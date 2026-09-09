import { describe, expect, test } from "bun:test";
import { addDays, formatDateLabel, formatDateShort, formatDuration, formatMiles } from "@/lib/format";

describe("formatMiles", () => {
  test("adds thousands separators", () => {
    expect(formatMiles(65000, "en")).toBe("65,000");
    expect(formatMiles(500, "en")).toBe("500");
  });

  test("uses locale-appropriate thousands separators", () => {
    expect(formatMiles(65000, "de")).toBe("65.000");
    expect(formatMiles(65000, "nl")).toBe("65.000");
  });
});

describe("formatDuration", () => {
  test("splits minutes into hours and zero-padded minutes", () => {
    expect(formatDuration(605, "en")).toBe("10h 05m");
    expect(formatDuration(60, "en")).toBe("1h 00m");
    expect(formatDuration(45, "en")).toBe("0h 45m");
  });

  test("uses the Dutch 'u' abbreviation for nl", () => {
    expect(formatDuration(605, "nl")).toBe("10u 05");
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
    expect(formatDateLabel("2026-09-09", "en")).toBe("Wed, Sep 9");
  });

  test("formatDateShort omits the month", () => {
    expect(formatDateShort("2026-09-09", "en")).toBe("9 Wed");
  });

  test("formats in the requested locale", () => {
    expect(formatDateLabel("2026-09-09", "nl")).toBe("wo 9 sep");
  });
});
