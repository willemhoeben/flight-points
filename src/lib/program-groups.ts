import { PROGRAMS, type Alliance, type Program } from "@/data/programs";

export const ALLIANCE_ORDER: Alliance[] = ["Star Alliance", "Oneworld", "SkyTeam", "Unaligned"];

export type ProgramGroup = { alliance: Alliance; programs: Program[] };

/** Groups programs by alliance, in ALLIANCE_ORDER, omitting empty groups. */
export function groupProgramsByAlliance(programs: Program[] = PROGRAMS): ProgramGroup[] {
  return ALLIANCE_ORDER.map((alliance) => ({
    alliance,
    programs: programs.filter((p) => p.alliance === alliance),
  })).filter((group) => group.programs.length > 0);
}
