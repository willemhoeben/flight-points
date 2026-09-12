import { AIRPORTS } from "@/data/airports";
import { CABINS, type Cabin } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";

export type SavedSearch = {
  id: string;
  origin: string;
  destination: string;
  date: string;
  cabin: Cabin;
  programs: string[];
  savedAt: string;
};

export type SavedSearchInput = { origin: string; destination: string; date: string; cabin: Cabin; programs: string[] };

/** Default max number of saved searches to remember. */
export const MAX_SAVED_SEARCHES = 8;

function isValidAirportCode(value: unknown): value is string {
  return typeof value === "string" && AIRPORTS.some((a) => a.code === value);
}

function isValidCabin(value: unknown): value is Cabin {
  return typeof value === "string" && CABINS.some((c) => c.id === value);
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function sanitizePrograms(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const known = new Set(PROGRAMS.map((p) => p.id));
  return value.filter((v): v is string => typeof v === "string" && known.has(v));
}

/**
 * A saved search is identified by its route + date + cabin — saving the
 * same combination again (even with a different program selection) updates
 * the existing entry in place instead of creating a near-duplicate.
 */
export function savedSearchId(params: { origin: string; destination: string; date: string; cabin: Cabin }): string {
  return `${params.origin}|${params.destination}|${params.date}|${params.cabin}`;
}

/**
 * Adds (or refreshes) a saved search at the front of the list, deduped by
 * savedSearchId and capped at max. Never mutates the input.
 */
export function addSavedSearch(
  current: SavedSearch[],
  entry: SavedSearchInput,
  max: number = MAX_SAVED_SEARCHES,
  now: () => string = () => new Date().toISOString(),
): SavedSearch[] {
  const id = savedSearchId(entry);
  const next: SavedSearch = { ...entry, id, savedAt: now() };
  return [next, ...current.filter((s) => s.id !== id)].slice(0, max);
}

/** Removes a saved search by id. Never mutates the input. */
export function removeSavedSearch(current: SavedSearch[], id: string): SavedSearch[] {
  return current.filter((s) => s.id !== id);
}

export function isSearchSaved(current: SavedSearch[], params: { origin: string; destination: string; date: string; cabin: Cabin }): boolean {
  return current.some((s) => s.id === savedSearchId(params));
}

/**
 * Validates one parsed localStorage entry against the same known-value
 * rules as the /search page's own query-param validation — a saved search
 * predates a data change (an airport removed, a cabin renamed) just as
 * easily as a hand-edited URL does, so it needs the same fallback-free
 * rejection rather than rendering a broken quick-launch link.
 */
export function isValidSavedSearch(value: unknown): value is SavedSearch {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    isValidAirportCode(v.origin) &&
    isValidAirportCode(v.destination) &&
    isValidDate(v.date) &&
    isValidCabin(v.cabin) &&
    Array.isArray(v.programs) &&
    v.programs.every((p) => typeof p === "string") &&
    typeof v.savedAt === "string"
  );
}

export function sanitizeSavedSearches(value: unknown): SavedSearch[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isValidSavedSearch).map((s) => ({ ...s, programs: sanitizePrograms(s.programs) }));
}
