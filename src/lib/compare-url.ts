/** Default shared points balance the comparison ranks currencies at. */
export const DEFAULT_COMPARE_BALANCE = 60000;

export function isValidBalance(value: string | null): value is string {
  if (!value) return false;
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

export function parseBalance(value: string | null): number {
  return isValidBalance(value) ? Number(value) : DEFAULT_COMPARE_BALANCE;
}

/** Adds or removes an id from a list, preserving the existing order. Never mutates the input. */
export function toggleCompareId(current: string[], id: string): string[] {
  return current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
}

/**
 * Builds the shareable comparison URL, omitting the balance param at its
 * default and dropping an empty currency selection entirely — so the plain
 * "/compare" landing state never carries a query string, matching every
 * other filter/sort URL on the site.
 */
export function buildCompareUrl(pathname: string, state: { currencyIds: string[]; balance: number }): string {
  const params = new URLSearchParams();
  for (const id of state.currencyIds) params.append("currencies", id);
  if (state.balance !== DEFAULT_COMPARE_BALANCE) params.set("balance", String(state.balance));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
