import { describe, expect, test } from "bun:test";
import { PROGRAMS } from "@/data/programs";
import { VALUATIONS } from "@/data/valuations";
import { baselineCentsPerPoint, PROGRAM_CURRENCY } from "@/lib/program-currency";
import { peakCentsPerPoint, pointsBeatCash, valueTier } from "@/lib/value";

describe("PROGRAM_CURRENCY", () => {
  test("covers every searchable program", () => {
    for (const p of PROGRAMS) expect(PROGRAM_CURRENCY[p.id]).toBeDefined();
  });

  test("points only at currencies that exist", () => {
    const ids = new Set(VALUATIONS.map((v) => v.id));
    for (const currencyId of Object.values(PROGRAM_CURRENCY)) expect(ids.has(currencyId)).toBe(true);
  });

  test("maps no two programs to the same currency", () => {
    const used = Object.values(PROGRAM_CURRENCY);
    expect(new Set(used).size).toBe(used.length);
  });

  test("baselineCentsPerPoint resolves for every program and is null otherwise", () => {
    for (const p of PROGRAMS) expect(baselineCentsPerPoint(p.id)).toBeGreaterThan(0);
    expect(baselineCentsPerPoint("not-a-program")).toBeNull();
  });
});

describe("valueTier", () => {
  // united-mp sits at 1.3 cents, so 2.6 is comfortably above its baseline.
  const row = (centsPerPoint: number) => ({ programId: "united", centsPerPoint });

  test("rates the best row on screen as great", () => {
    expect(valueTier(row(2.6), 2.6)).toBe("great");
  });

  test("grades down as a row falls behind the best", () => {
    expect(valueTier(row(2.2), 2.6)).toBe("good");
    expect(valueTier(row(1.7), 2.6)).toBe("fair");
    expect(valueTier(row(1.4), 2.6)).toBe("weak");
  });

  test("never rates a below-baseline redemption above fair, however it compares", () => {
    // 1.2 is the top of this set but still under the 1.3-cent baseline.
    expect(valueTier(row(1.2), 1.2)).toBe("fair");
  });

  test("rates a far-below-baseline redemption weak even when it leads the set", () => {
    expect(valueTier(row(0.5), 0.5)).toBe("weak");
  });

  test("returns null without a usable figure", () => {
    expect(valueTier(row(0), 2)).toBeNull();
    expect(valueTier(row(2), 0)).toBeNull();
  });
});

describe("peakCentsPerPoint", () => {
  test("finds the best figure in the set", () => {
    expect(peakCentsPerPoint([{ programId: "united", centsPerPoint: 1.1 }, { programId: "delta", centsPerPoint: 3.4 }])).toBe(3.4);
  });

  test("is 0 for an empty set", () => {
    expect(peakCentsPerPoint([])).toBe(0);
  });
});

describe("pointsBeatCash", () => {
  test("says points win when the best redemption beats its baseline", () => {
    const got = pointsBeatCash([{ programId: "united", centsPerPoint: 3.9 }]);
    expect(got?.pointsWin).toBe(true);
    expect(got?.baseline).toBe(1.3);
  });

  test("says cash wins when even the best redemption is under baseline", () => {
    expect(pointsBeatCash([{ programId: "united", centsPerPoint: 0.9 }])?.pointsWin).toBe(false);
  });

  test("judges on the best value available, not the first row", () => {
    const got = pointsBeatCash([
      { programId: "united", centsPerPoint: 0.9 },
      { programId: "delta", centsPerPoint: 4.2 },
    ]);
    expect(got?.best.programId).toBe("delta");
    expect(got?.pointsWin).toBe(true);
  });

  test("returns null when nothing in the set can be judged", () => {
    expect(pointsBeatCash([])).toBeNull();
    expect(pointsBeatCash([{ programId: "united", centsPerPoint: 0 }])).toBeNull();
  });
});
