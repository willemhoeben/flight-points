import { describe, expect, test } from "bun:test";
import { toggleSavedSlug } from "@/lib/saved-deals";

describe("toggleSavedSlug", () => {
  test("adds a slug that isn't saved yet", () => {
    expect(toggleSavedSlug([], "a")).toEqual(["a"]);
    expect(toggleSavedSlug(["a"], "b")).toEqual(["a", "b"]);
  });

  test("removes a slug that's already saved", () => {
    expect(toggleSavedSlug(["a"], "a")).toEqual([]);
    expect(toggleSavedSlug(["a", "b"], "a")).toEqual(["b"]);
  });

  test("never mutates the input array", () => {
    const original = ["a", "b"];
    const copy = [...original];
    toggleSavedSlug(original, "a");
    toggleSavedSlug(original, "c");
    expect(original).toEqual(copy);
  });
});
