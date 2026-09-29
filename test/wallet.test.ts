import { describe, expect, test } from "bun:test";
import { PROGRAMS } from "@/data/programs";
import { TRANSFERS } from "@/data/transfers";
import { VALUATIONS } from "@/data/valuations";
import { PROGRAM_CURRENCY } from "@/lib/program-currency";
import {
  normalizeBalances,
  programsReached,
  reachFor,
  reachGroups,
  strandedBalances,
  walletValueUsd,
  type Balances,
} from "@/lib/wallet";

describe("transfer data", () => {
  test("every source is a currency we value", () => {
    const ids = new Set(VALUATIONS.map((v) => v.id));
    for (const id of Object.keys(TRANSFERS)) {
      expect(ids.has(id), `${id} transfers from a currency that is not valued`).toBe(true);
    }
  });

  test("every target is a program we search", () => {
    const ids = new Set(PROGRAMS.map((p) => p.id));
    for (const [source, targets] of Object.entries(TRANSFERS)) {
      for (const target of Object.keys(targets)) {
        expect(ids.has(target), `${source} transfers to unknown program ${target}`).toBe(true);
      }
    }
  });

  test("only 1:1 partners are listed", () => {
    for (const targets of Object.values(TRANSFERS)) {
      for (const ratio of Object.values(targets)) expect(ratio).toBe(1);
    }
  });

  test("a currency never transfers into the program that already spends it", () => {
    for (const [source, targets] of Object.entries(TRANSFERS)) {
      for (const target of Object.keys(targets)) {
        expect(PROGRAM_CURRENCY[target], `${target} both spends and receives ${source}`).not.toBe(source);
      }
    }
  });
});

describe("normalizeBalances", () => {
  test("keeps positive whole counts for known currencies", () => {
    expect(normalizeBalances({ "chase-ur": 60000 })).toEqual({ "chase-ur": 60000 });
    expect(normalizeBalances({ "chase-ur": 60000.4 })).toEqual({ "chase-ur": 60000 });
  });

  test("drops zero, negative, non-numeric and unknown entries", () => {
    expect(
      normalizeBalances({ "chase-ur": 0, "amex-mr": -5, bilt: "lots", "not-a-currency": 1000 }),
    ).toEqual({});
  });

  test("survives junk instead of an object", () => {
    for (const junk of [null, undefined, 7, "x", []]) expect(normalizeBalances(junk)).toEqual({});
  });
});

describe("walletValueUsd", () => {
  test("values a balance at its own cents-per-point", () => {
    const chase = VALUATIONS.find((v) => v.id === "chase-ur")!;
    expect(walletValueUsd({ "chase-ur": 10_000 })).toBeCloseTo(10_000 * (chase.centsPerPoint / 100), 6);
  });

  test("adds every balance held", () => {
    const a: Balances = { "chase-ur": 10_000 };
    const b: Balances = { "amex-mr": 25_000 };
    expect(walletValueUsd({ ...a, ...b })).toBeCloseTo(walletValueUsd(a) + walletValueUsd(b), 6);
  });

  test("an empty wallet is worth nothing", () => {
    expect(walletValueUsd({})).toBe(0);
  });
});

describe("reachFor", () => {
  test("returns null when nothing can reach the program", () => {
    expect(reachFor({}, "united")).toBeNull();
  });

  test("a program's own currency is reached directly", () => {
    const reach = reachFor({ "united-mp": 50_000 }, "united");
    expect(reach).toEqual({ miles: 50_000, via: null, ratio: 1 });
  });

  test("a bank balance reaches its transfer partners", () => {
    const reach = reachFor({ "chase-ur": 40_000 }, "united");
    expect(reach).toEqual({ miles: 40_000, via: "chase-ur", ratio: 1 });
  });

  test("picks the single best route rather than adding balances", () => {
    // 30k held directly plus 40k transferable is 40k of bookable miles, not
    // 70k: no airline lets you pay one award out of two programs.
    const reach = reachFor({ "united-mp": 30_000, "chase-ur": 40_000 }, "united");
    expect(reach?.miles).toBe(40_000);
    expect(reach?.via).toBe("chase-ur");
  });

  test("a balance that reaches nothing relevant is ignored", () => {
    expect(reachFor({ "hyatt": 100_000 }, "united")).toBeNull();
  });
});

describe("programsReached", () => {
  test("nothing held reaches nothing", () => {
    expect(programsReached({})).toEqual([]);
  });

  test("a bank balance reaches exactly its partners", () => {
    const reached = programsReached({ "chase-ur": 1_000 });
    expect(new Set(reached)).toEqual(new Set(Object.keys(TRANSFERS["chase-ur"])));
  });

  test("every program is reachable by someone", () => {
    const everything: Balances = Object.fromEntries(VALUATIONS.map((v) => [v.id, 1_000]));
    expect(programsReached(everything).length).toBe(PROGRAMS.length);
  });
});

describe("reachGroups", () => {
  test("one group per balance held that goes somewhere", () => {
    const groups = reachGroups({ "chase-ur": 60_000, "amex-mr": 25_000 });
    expect(groups.map((g) => g.source.id)).toEqual(["chase-ur", "amex-mr"]);
    expect(groups[0].balance).toBe(60_000);
  });

  test("a group lists direct spend and transfers separately", () => {
    const [group] = reachGroups({ "united-mp": 50_000 });
    expect(group.direct.map((p) => p.id)).toEqual(["united"]);
    expect(group.via).toEqual([]);
  });

  test("a balance that reaches nothing is left out entirely", () => {
    expect(reachGroups({ "hyatt": 100_000 })).toEqual([]);
  });

  test("follows the valuations order, not insertion order", () => {
    const a = reachGroups({ "amex-mr": 1, "chase-ur": 1 }).map((g) => g.source.id);
    const b = reachGroups({ "chase-ur": 1, "amex-mr": 1 }).map((g) => g.source.id);
    expect(a).toEqual(b);
  });
});

describe("strandedBalances", () => {
  test("names a balance that reaches nothing", () => {
    expect(strandedBalances({ hyatt: 80_000 }).map((v) => v.id)).toEqual(["hyatt"]);
  });

  test("leaves out a balance that does reach something", () => {
    expect(strandedBalances({ "chase-ur": 60_000 })).toEqual([]);
  });

  test("a wallet's balances are either grouped or stranded, never both or neither", () => {
    const balances: Balances = { "chase-ur": 1, hyatt: 1, "united-mp": 1, marriott: 1 };
    const grouped = reachGroups(balances).map((g) => g.source.id);
    const left = strandedBalances(balances).map((v) => v.id);
    expect(grouped.filter((id) => left.includes(id))).toEqual([]);
    expect([...grouped, ...left].sort()).toEqual(Object.keys(balances).sort());
  });
});
