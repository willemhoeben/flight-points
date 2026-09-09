export type SortDir = "asc" | "desc";

/**
 * Sorts a copy of `items` by a numeric or string field, honoring
 * direction. Never mutates the input array.
 */
export function sortBy<T, K extends keyof T>(items: T[], key: K, dir: SortDir): T[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    const diff = typeof va === "string" && typeof vb === "string" ? va.localeCompare(vb) : Number(va) - Number(vb);
    return dir === "asc" ? diff : -diff;
  });
  return copy;
}

/** Toggles direction when re-selecting the same key, otherwise picks a sensible default direction. */
export function nextSort<K>(
  currentKey: K,
  currentDir: SortDir,
  nextKey: K,
  defaultDirFor: (key: K) => SortDir,
): { key: K; dir: SortDir } {
  if (currentKey === nextKey) {
    return { key: nextKey, dir: currentDir === "asc" ? "desc" : "asc" };
  }
  return { key: nextKey, dir: defaultDirFor(nextKey) };
}
