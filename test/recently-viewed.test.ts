import { describe, expect, test } from "bun:test";
import { addRecentlyViewed, MAX_RECENTLY_VIEWED } from "@/lib/recently-viewed";

describe("addRecentlyViewed", () => {
  test("adds a new slug to the front", () => {
    expect(addRecentlyViewed([], "a")).toEqual(["a"]);
    expect(addRecentlyViewed(["b", "c"], "a")).toEqual(["a", "b", "c"]);
  });

  test("moves an existing slug to the front instead of duplicating it", () => {
    expect(addRecentlyViewed(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  test("caps at the given max, dropping the oldest", () => {
    expect(addRecentlyViewed(["a", "b"], "c", 2)).toEqual(["c", "a"]);
  });

  test("re-viewing the most recent slug is a no-op", () => {
    expect(addRecentlyViewed(["a", "b"], "a")).toEqual(["a", "b"]);
  });

  test("never mutates the input array", () => {
    const input = ["a", "b"];
    addRecentlyViewed(input, "c");
    expect(input).toEqual(["a", "b"]);
  });

  test("defaults to MAX_RECENTLY_VIEWED when max is omitted", () => {
    const filled = Array.from({ length: MAX_RECENTLY_VIEWED }, (_, i) => `slug-${i}`);
    expect(addRecentlyViewed(filled, "new")).toHaveLength(MAX_RECENTLY_VIEWED);
  });
});
