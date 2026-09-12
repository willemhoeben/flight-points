import { describe, expect, test } from "bun:test";
import {
  addSavedSearch,
  isSearchSaved,
  isValidSavedSearch,
  removeSavedSearch,
  sanitizeSavedSearches,
  savedSearchId,
  type SavedSearch,
} from "@/lib/saved-searches";

const JFK_LHR = { origin: "JFK", destination: "LHR", date: "2026-11-15", cabin: "business" as const, programs: ["united", "ana"] };
const JFK_CDG = { origin: "JFK", destination: "CDG", date: "2026-12-01", cabin: "economy" as const, programs: [] };

describe("savedSearchId", () => {
  test("is stable for the same route/date/cabin regardless of programs", () => {
    const withDifferentPrograms = { ...JFK_LHR, programs: [] };
    expect(savedSearchId(JFK_LHR)).toBe(savedSearchId(withDifferentPrograms));
  });

  test("differs when any of route/date/cabin differs", () => {
    const base = savedSearchId(JFK_LHR);
    expect(savedSearchId({ ...JFK_LHR, destination: "CDG" })).not.toBe(base);
    expect(savedSearchId({ ...JFK_LHR, date: "2026-11-16" })).not.toBe(base);
    expect(savedSearchId({ ...JFK_LHR, cabin: "first" })).not.toBe(base);
  });
});

describe("addSavedSearch", () => {
  const now = () => "2026-09-12T00:00:00.000Z";

  test("adds a new search to the front of the list", () => {
    const result = addSavedSearch([], JFK_LHR, 8, now);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ ...JFK_LHR, id: savedSearchId(JFK_LHR), savedAt: "2026-09-12T00:00:00.000Z" });
  });

  test("refreshes (moves to front, updates savedAt) instead of duplicating an existing route/date/cabin", () => {
    const first = addSavedSearch([], JFK_LHR, 8, () => "2026-09-01T00:00:00.000Z");
    const withSecond = addSavedSearch(first, JFK_CDG, 8, () => "2026-09-02T00:00:00.000Z");
    const refreshed = addSavedSearch(withSecond, { ...JFK_LHR, programs: ["delta"] }, 8, now);

    expect(refreshed).toHaveLength(2);
    expect(refreshed[0].id).toBe(savedSearchId(JFK_LHR));
    expect(refreshed[0].programs).toEqual(["delta"]);
    expect(refreshed[0].savedAt).toBe("2026-09-12T00:00:00.000Z");
    expect(refreshed[1].id).toBe(savedSearchId(JFK_CDG));
  });

  test("caps at max, dropping the oldest", () => {
    let list: SavedSearch[] = [];
    for (let i = 0; i < 5; i++) {
      list = addSavedSearch(list, { ...JFK_LHR, date: `2026-11-${10 + i}` }, 3, now);
    }
    expect(list).toHaveLength(3);
    expect(list[0].date).toBe("2026-11-14");
    expect(list[2].date).toBe("2026-11-12");
  });

  test("never mutates the input array", () => {
    const original: SavedSearch[] = [];
    addSavedSearch(original, JFK_LHR, 8, now);
    expect(original).toEqual([]);
  });
});

describe("removeSavedSearch", () => {
  test("removes a saved search by id", () => {
    const list = addSavedSearch([], JFK_LHR);
    expect(removeSavedSearch(list, savedSearchId(JFK_LHR))).toEqual([]);
  });

  test("is a no-op for an unknown id", () => {
    const list = addSavedSearch([], JFK_LHR);
    expect(removeSavedSearch(list, "not-a-real-id")).toEqual(list);
  });
});

describe("isSearchSaved", () => {
  test("true only for a saved route/date/cabin", () => {
    const list = addSavedSearch([], JFK_LHR);
    expect(isSearchSaved(list, JFK_LHR)).toBe(true);
    expect(isSearchSaved(list, JFK_CDG)).toBe(false);
  });
});

describe("isValidSavedSearch", () => {
  const valid: SavedSearch = { id: savedSearchId(JFK_LHR), ...JFK_LHR, savedAt: "2026-09-12T00:00:00.000Z" };

  test("accepts a well-formed saved search", () => {
    expect(isValidSavedSearch(valid)).toBe(true);
  });

  test("rejects an unknown airport code", () => {
    expect(isValidSavedSearch({ ...valid, origin: "ZZZ" })).toBe(false);
  });

  test("rejects an unknown cabin", () => {
    expect(isValidSavedSearch({ ...valid, cabin: "supersonic" })).toBe(false);
  });

  test("rejects a malformed date", () => {
    expect(isValidSavedSearch({ ...valid, date: "not-a-date" })).toBe(false);
  });

  test("rejects non-object values", () => {
    expect(isValidSavedSearch(null)).toBe(false);
    expect(isValidSavedSearch("JFK")).toBe(false);
    expect(isValidSavedSearch(42)).toBe(false);
  });
});

describe("sanitizeSavedSearches", () => {
  const valid: SavedSearch = { id: savedSearchId(JFK_LHR), ...JFK_LHR, savedAt: "2026-09-12T00:00:00.000Z" };

  test("passes through valid entries and drops invalid ones", () => {
    const result = sanitizeSavedSearches([valid, { ...valid, origin: "ZZZ" }, "garbage"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(valid.id);
  });

  test("returns an empty array for non-array input", () => {
    expect(sanitizeSavedSearches(null)).toEqual([]);
    expect(sanitizeSavedSearches({})).toEqual([]);
  });

  test("strips unknown program ids from an otherwise-valid entry", () => {
    const result = sanitizeSavedSearches([{ ...valid, programs: ["united", "not-a-real-program"] }]);
    expect(result).toHaveLength(1);
    expect(result[0].programs).toEqual(["united"]);
  });
});
