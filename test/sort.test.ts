import { describe, expect, test } from "bun:test";
import { nextSort, sortBy } from "@/lib/sort";

type Row = { id: string; name: string; value: number };

const rows: Row[] = [
  { id: "b", name: "Bravo", value: 20 },
  { id: "a", name: "Alpha", value: 30 },
  { id: "c", name: "Charlie", value: 10 },
];

describe("sortBy", () => {
  test("sorts numeric fields ascending and descending", () => {
    expect(sortBy(rows, "value", "asc").map((r) => r.id)).toEqual(["c", "b", "a"]);
    expect(sortBy(rows, "value", "desc").map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  test("sorts string fields with localeCompare", () => {
    expect(sortBy(rows, "name", "asc").map((r) => r.id)).toEqual(["a", "b", "c"]);
    expect(sortBy(rows, "name", "desc").map((r) => r.id)).toEqual(["c", "b", "a"]);
  });

  test("does not mutate the input array", () => {
    const original = [...rows];
    sortBy(rows, "value", "asc");
    expect(rows).toEqual(original);
  });
});

describe("nextSort", () => {
  test("toggles direction when re-selecting the same key", () => {
    expect(nextSort("value", "asc", "value", () => "asc")).toEqual({ key: "value", dir: "desc" });
    expect(nextSort("value", "desc", "value", () => "asc")).toEqual({ key: "value", dir: "asc" });
  });

  test("uses the provided default direction when switching keys", () => {
    expect(nextSort("value", "desc", "name", (k) => (k === "name" ? "asc" : "desc"))).toEqual({
      key: "name",
      dir: "asc",
    });
  });
});
