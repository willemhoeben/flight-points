import type { Alliance } from "@/data/programs";
import type { SortDir } from "@/lib/sort";

export type ResultsSortKey = "milesCost" | "durationMinutes" | "seatsRemaining";

export const DEFAULT_RESULTS_SORT_KEY: ResultsSortKey = "milesCost";
export const DEFAULT_RESULTS_SORT_DIR: SortDir = "asc";

export function isResultsSortKey(value: string | null): value is ResultsSortKey {
  return value === "milesCost" || value === "durationMinutes" || value === "seatsRemaining";
}

export function isNonstopOnlyParam(value: string | null): boolean {
  return value === "1";
}

// URL slugs instead of the raw Alliance strings — "Star Alliance" contains a
// space, and a plain query param round-trips ambiguously across encodings.
const ALLIANCE_SLUGS: Record<Alliance, string> = {
  "Star Alliance": "star-alliance",
  Oneworld: "oneworld",
  SkyTeam: "skyteam",
  Unaligned: "unaligned",
};
const SLUG_TO_ALLIANCE = Object.fromEntries(
  Object.entries(ALLIANCE_SLUGS).map(([alliance, slug]) => [slug, alliance as Alliance]),
) as Record<string, Alliance>;

export function allianceToSlug(alliance: Alliance): string {
  return ALLIANCE_SLUGS[alliance];
}

/** Parses a ?alliance= value; returns null for missing/unknown input (meaning "all alliances"). */
export function allianceFromSlug(value: string | null): Alliance | null {
  return value !== null && value in SLUG_TO_ALLIANCE ? SLUG_TO_ALLIANCE[value] : null;
}

/** The preset "max taxes & fees" thresholds offered as filter pills, in raw USD. */
export const MAX_FEES_OPTIONS = [50, 100, 200] as const;

/** Parses a ?maxFees= value; returns null for missing/invalid input (meaning "no cap"). */
export function maxFeesFromParam(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Builds the shareable results URL for a given sort/filter state, preserving
 * every other existing query param (origin/destination/date/cabin/programs)
 * and omitting sort/dir/nonstop/alliance/maxFees when they're at their
 * default — so a plain search only ever picks up these params once the
 * visitor actually changes the view.
 */
export function buildResultsSortUrl(
  pathname: string,
  currentSearch: string,
  view: {
    sortKey: ResultsSortKey;
    sortDir: SortDir;
    nonstopOnly: boolean;
    alliance: Alliance | null;
    maxTaxesFees: number | null;
  },
): string {
  const params = new URLSearchParams(currentSearch);
  const isDefaultSort = view.sortKey === DEFAULT_RESULTS_SORT_KEY && view.sortDir === DEFAULT_RESULTS_SORT_DIR;
  if (isDefaultSort) {
    params.delete("sort");
    params.delete("dir");
  } else {
    params.set("sort", view.sortKey);
    params.set("dir", view.sortDir);
  }
  if (view.nonstopOnly) {
    params.set("nonstop", "1");
  } else {
    params.delete("nonstop");
  }
  if (view.alliance) {
    params.set("alliance", allianceToSlug(view.alliance));
  } else {
    params.delete("alliance");
  }
  if (view.maxTaxesFees) {
    params.set("maxFees", String(view.maxTaxesFees));
  } else {
    params.delete("maxFees");
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
