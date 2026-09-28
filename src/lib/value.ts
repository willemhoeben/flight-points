import { baselineCentsPerPoint } from "@/lib/program-currency";

export type ValueTier = "great" | "good" | "fair" | "weak";

type Rated = { programId: string; centsPerPoint: number };

const TIERS: { min: number; tier: ValueTier }[] = [
  { min: 0.95, tier: "great" },
  { min: 0.8, tier: "good" },
  { min: 0.6, tier: "fair" },
  { min: 0, tier: "weak" },
];

/** The best cents-per-point figure among a set of results. */
export function peakCentsPerPoint(rows: Rated[]): number {
  return rows.reduce((max, r) => Math.max(max, r.centsPerPoint || 0), 0);
}

/**
 * Rate a redemption against the best option on screen, not against the
 * currency's lifetime average.
 *
 * Every row of a search prices the same seat, so an absolute scale put all
 * eight rows of a long-haul search in one band and said nothing about which
 * to book. The absolute number still has a vote: a redemption below what
 * that currency is normally worth can never come out on top, however well
 * it compares to its neighbours.
 */
export function valueTier(row: Rated, peak: number): ValueTier | null {
  if (!row.centsPerPoint || !peak) return null;

  const relative = row.centsPerPoint / peak;
  let index = 0;
  while (index < TIERS.length - 1 && relative < TIERS[index].min) index++;

  const baseline = baselineCentsPerPoint(row.programId);
  if (baseline) {
    const absolute = row.centsPerPoint / baseline;
    if (absolute < 0.7) index = TIERS.length - 1;
    else if (absolute < 1 && index < 2) index = 2;
  }

  return TIERS[index].tier;
}

/**
 * Whether points or cash is the better way to pay for this search, judged on
 * the best value available rather than the cheapest row: the question is
 * "should I use points at all", not "which row is cheapest".
 */
export function pointsBeatCash(rows: Rated[]): { best: Rated; baseline: number; pointsWin: boolean } | null {
  const rated = rows
    .map((r) => ({ row: r, baseline: baselineCentsPerPoint(r.programId) }))
    .filter((x): x is { row: Rated; baseline: number } => x.baseline !== null && x.row.centsPerPoint > 0);
  if (rated.length === 0) return null;

  const winner = rated.reduce((a, b) => (b.row.centsPerPoint > a.row.centsPerPoint ? b : a));
  return {
    best: winner.row,
    baseline: winner.baseline,
    pointsWin: winner.row.centsPerPoint >= winner.baseline,
  };
}
