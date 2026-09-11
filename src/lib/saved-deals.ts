/** Toggles a slug in a list of saved deal slugs. Never mutates the input. */
export function toggleSavedSlug(current: string[], slug: string): string[] {
  return current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
}
