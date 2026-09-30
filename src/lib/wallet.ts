import { PROGRAMS, type Program } from "@/data/programs";
import { TRANSFERS } from "@/data/transfers";
import { VALUATIONS, type PointCurrency } from "@/data/valuations";
import { PROGRAM_CURRENCY } from "@/lib/program-currency";

/** What the visitor holds, keyed by valuation id. Missing means zero. */
export type Balances = Record<string, number>;

/** Drops anything that isn't a currency we value, or isn't a positive count. */
export function normalizeBalances(raw: unknown): Balances {
  if (!raw || typeof raw !== "object") return {};
  const source = raw as Record<string, unknown>;
  const out: Balances = {};
  for (const v of VALUATIONS) {
    const n = Number(source[v.id]);
    if (Number.isFinite(n) && n > 0) out[v.id] = Math.round(n);
  }
  return out;
}

/** Cash value of everything held, in USD, at the valuations table's rates. */
export function walletValueUsd(balances: Balances): number {
  return VALUATIONS.reduce((sum, v) => sum + (balances[v.id] ?? 0) * (v.centsPerPoint / 100), 0);
}

export type Reach = {
  /** Miles available on that program by the single best route. */
  miles: number;
  /** The bank currency they came through, or null when held directly. */
  via: string | null;
  ratio: number;
};

/**
 * How many miles the visitor can put behind an award on `programId`, and
 * how they get there. Deliberately the best SINGLE route rather than the
 * sum of every balance that could reach it: no airline lets you pay one
 * award out of two programs, so adding them would overstate what is
 * actually bookable.
 */
export function reachFor(balances: Balances, programId: string): Reach | null {
  let best: Reach | null = null;

  const own = PROGRAM_CURRENCY[programId];
  if (own && balances[own]) best = { miles: balances[own], via: null, ratio: 1 };

  for (const [currencyId, targets] of Object.entries(TRANSFERS)) {
    const ratio = targets[programId];
    if (!ratio) continue;
    const held = balances[currencyId] ?? 0;
    if (!held) continue;
    const miles = Math.floor(held * ratio);
    if (!best || miles > best.miles) best = { miles, via: currencyId, ratio };
  }

  return best;
}

/** Every program the visitor can put miles behind at all. */
export function programsReached(balances: Balances): string[] {
  return PROGRAMS.filter((p) => reachFor(balances, p.id) !== null).map((p) => p.id);
}

export type ReachGroup = {
  source: PointCurrency;
  balance: number;
  /** Programs that spend this currency directly. */
  direct: Program[];
  /** Programs this currency transfers into. */
  via: Program[];
};

/**
 * Grouped by the balance you hold, not by the program you could reach. A
 * row per reachable program repeated the same figure a dozen times over;
 * the balance is the fact, and the programs are what follows from it.
 */
export function reachGroups(balances: Balances): ReachGroup[] {
  const groups: ReachGroup[] = [];
  for (const v of VALUATIONS) {
    const balance = balances[v.id];
    if (!balance) continue;
    const direct = PROGRAMS.filter((p) => PROGRAM_CURRENCY[p.id] === v.id);
    const targets = TRANSFERS[v.id] ?? {};
    const via = PROGRAMS.filter((p) => targets[p.id]);
    if (!direct.length && !via.length) continue;
    groups.push({ source: v, balance, direct, via });
  }
  return groups;
}

/**
 * Currencies the visitor holds that reach no airline program at all — hotel
 * points, mostly. They count toward the total value, so leaving them out of
 * the reach column with no explanation reads as a bug rather than an answer.
 */
export function strandedBalances(balances: Balances): PointCurrency[] {
  const reaching = new Set(reachGroups(balances).map((g) => g.source.id));
  return VALUATIONS.filter((v) => balances[v.id] && !reaching.has(v.id));
}

export type Affordability =
  /** Nothing entered, so the page says nothing. */
  | { kind: "unknown" }
  /** Held directly in that program's own currency. */
  | { kind: "covered" }
  /** Covered, but only after moving points from a bank currency. */
  | { kind: "transfer"; via: string }
  /** Short by this many miles on the best single route. */
  | { kind: "short"; shortfall: number }
  /** Nothing held reaches that program at all. */
  | { kind: "no-route" };

/**
 * Whether a given award is within reach of what the visitor holds. Reads
 * `reachFor`, so it inherits the best-single-route rule: a result is only
 * "covered" if one program can pay for it on its own.
 */
export function affordability(
  balances: Balances,
  programId: string,
  milesCost: number,
): Affordability {
  if (Object.keys(balances).length === 0) return { kind: "unknown" };
  const reach = reachFor(balances, programId);
  if (!reach) return { kind: "no-route" };
  if (reach.miles < milesCost) return { kind: "short", shortfall: milesCost - reach.miles };
  return reach.via ? { kind: "transfer", via: reach.via } : { kind: "covered" };
}

/** The display name of a point currency, for the "via Chase" line. */
export function currencyName(currencyId: string): string {
  return VALUATIONS.find((v) => v.id === currencyId)?.name ?? currencyId;
}

/**
 * The largest number of miles the visitor can put behind a single award,
 * across every program they can reach. That is the right budget for
 * "where can I go": the most expensive seat they could actually pay for is
 * capped by their best single route, not by the sum of everything held.
 */
export function bestSingleReach(balances: Balances): number {
  let best = 0;
  for (const p of PROGRAMS) {
    const reach = reachFor(balances, p.id);
    if (reach && reach.miles > best) best = reach.miles;
  }
  return best;
}
