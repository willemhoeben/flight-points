import { describe, expect, test } from "bun:test";
import { ALLIANCE_ORDER, groupProgramsByAlliance } from "@/lib/program-groups";
import { PROGRAMS } from "@/data/programs";

describe("groupProgramsByAlliance", () => {
  test("every program appears in exactly one group", () => {
    const groups = groupProgramsByAlliance();
    const seen = groups.flatMap((g) => g.programs.map((p) => p.id));
    expect(seen.sort()).toEqual(PROGRAMS.map((p) => p.id).sort());
    expect(new Set(seen).size).toBe(PROGRAMS.length);
  });

  test("groups follow ALLIANCE_ORDER", () => {
    const groups = groupProgramsByAlliance();
    const order = groups.map((g) => g.alliance);
    const expectedOrder = ALLIANCE_ORDER.filter((a) => order.includes(a));
    expect(order).toEqual(expectedOrder);
  });

  test("every program within a group actually belongs to that alliance", () => {
    const groups = groupProgramsByAlliance();
    for (const group of groups) {
      for (const program of group.programs) {
        expect(program.alliance).toBe(group.alliance);
      }
    }
  });

  test("omits alliances with no programs", () => {
    const groups = groupProgramsByAlliance([]);
    expect(groups).toEqual([]);
  });
});
