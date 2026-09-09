/** Replaces `{key}` placeholders in a dictionary template string with values. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Picks the singular or plural dictionary string for a count and interpolates it. */
export function pluralize(
  count: number,
  one: string,
  other: string,
): string {
  return interpolate(count === 1 ? one : other, { count });
}
