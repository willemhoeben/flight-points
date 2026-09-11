/** Default max number of recently-viewed slugs to remember. */
export const MAX_RECENTLY_VIEWED = 5;

/**
 * Moves a slug to the front of the list (deduping any existing occurrence),
 * capped at max. Never mutates the input.
 */
export function addRecentlyViewed(current: string[], slug: string, max: number = MAX_RECENTLY_VIEWED): string[] {
  return [slug, ...current.filter((s) => s !== slug)].slice(0, max);
}
