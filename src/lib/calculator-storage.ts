export type CalcMode = "pointsToCash" | "cashToPoints";

export function isCalcMode(value: unknown): value is CalcMode {
  return value === "pointsToCash" || value === "cashToPoints";
}

export type StoredCalcState = {
  mode: CalcMode;
  currencyId: string;
  balance: string;
  targetAmount: string;
};

/**
 * Parses a previously-saved calculator state from localStorage, validating
 * every field so a corrupted or hand-edited value can't put the calculator
 * into a broken state — any invalid or missing field returns null and the
 * caller keeps its current defaults instead of applying a partial result.
 */
export function parseStoredCalcState(
  raw: string | null,
  isValidCurrencyId: (id: string) => boolean,
): StoredCalcState | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;
  if (!isCalcMode(obj.mode)) return null;
  if (typeof obj.currencyId !== "string" || !isValidCurrencyId(obj.currencyId)) return null;
  if (typeof obj.balance !== "string") return null;
  if (typeof obj.targetAmount !== "string") return null;
  return { mode: obj.mode, currencyId: obj.currencyId, balance: obj.balance, targetAmount: obj.targetAmount };
}

export const CALCULATOR_STORAGE_KEY = "flight-points:calculator";
const CHANGE_EVENT = "flight-points:calculator-change";

// useSyncExternalStore compares snapshots with Object.is, so parsing fresh
// JSON on every call (a new object each time) would look like a change on
// every render and trip React's "getSnapshot should be cached" loop
// detection. Caching by the raw string — reparsing only when it actually
// changes — keeps the reference stable otherwise; the fix React's own docs
// recommend for a computed/derived snapshot.
let cachedRaw: string | null = null;
let cachedSnapshot: StoredCalcState | null = null;

export function readStoredCalcState(
  defaults: StoredCalcState,
  isValidCurrencyId: (id: string) => boolean,
): StoredCalcState {
  let raw: string | null;
  try {
    raw = localStorage.getItem(CALCULATOR_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw && cachedSnapshot) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = parseStoredCalcState(raw, isValidCurrencyId) ?? defaults;
  return cachedSnapshot;
}

export function saveCalcState(next: StoredCalcState) {
  try {
    localStorage.setItem(CALCULATOR_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort persistence only
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToCalcState(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
