/**
 * The badge colours, as a closed set.
 *
 * Lives here rather than in `components/ui.tsx` so the data layer can name
 * a programme's colour without importing a component, and rather than in
 * `data/programs.ts` because valuations and deals pick from the same set —
 * the same reason place names live outside the airport data.
 *
 * Every value has a measured ink-on-tint pair in `globals.css`, checked by
 * `test/palette-contrast.test.ts`. Before this was a type, the Badge fell
 * back to sky for an unknown accent, which turns a typo or a newly added
 * colour into a silently wrong badge instead of a compile error.
 */
export type Accent =
  | "sky"
  | "indigo"
  | "violet"
  | "fuchsia"
  | "amber"
  | "rose"
  | "emerald"
  | "cyan";

export const ACCENTS: Accent[] = [
  "sky",
  "indigo",
  "violet",
  "fuchsia",
  "amber",
  "rose",
  "emerald",
  "cyan",
];
