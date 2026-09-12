/**
 * The Flight Points mark: an airliner climbing away from a hotel block —
 * the two halves of what this site actually values, airline miles and
 * hotel points.
 *
 * Geometry lives here as bare path data rather than in a component because
 * it has to render in two different worlds: React DOM for the navbar, and
 * Satori (`next/og`) for the favicon, the apple-touch icon, the two
 * manifest icons, and both Open Graph images. Seven renderers, one source
 * of truth — the alternative is seven hand-copied path strings that drift.
 *
 * Both shapes are authored in a 32x32 box and never overlap (their closest
 * approach is ~3.7 units, 12% of the mark), so the mark needs no knockout
 * and reads on any background colour.
 */
export const BRAND_MARK_VIEWBOX = "0 0 32 32";

/** Hotel block with knocked-out windows and a door — needs fill-rule="evenodd". */
export const BRAND_MARK_HOTEL =
  "M13.40 16.00 L29.30 16.00 L29.30 29.30 L13.40 29.30 Z " +
  "M15.40 18.30 L18.20 18.30 L18.20 21.10 L15.40 21.10 Z " +
  "M19.95 18.30 L22.75 18.30 L22.75 21.10 L19.95 21.10 Z " +
  "M24.50 18.30 L27.30 18.30 L27.30 21.10 L24.50 21.10 Z " +
  "M15.40 22.80 L18.20 22.80 L18.20 25.60 L15.40 25.60 Z " +
  "M19.95 22.80 L22.75 22.80 L22.75 25.60 L19.95 25.60 Z " +
  "M24.50 22.80 L27.30 22.80 L27.30 25.60 L24.50 25.60 Z " +
  "M19.65 26.60 L23.05 26.60 L23.05 29.30 L19.65 29.30 Z";

/** Airliner planform, banked up and to the right. Solid — no fill rule needed. */
export const BRAND_MARK_PLANE =
  "M15.89 2.52 L13.86 2.30 L11.63 4.05 L6.34 2.45 L5.11 3.95 L9.25 5.90 " +
  "L6.14 8.34 L3.14 7.57 L2.40 8.58 L4.51 9.61 L3.57 11.05 L4.63 12.41 " +
  "L6.26 11.84 L6.74 14.14 L7.90 13.67 L7.88 10.57 L11.00 8.14 L11.89 12.63 " +
  "L13.65 11.80 L13.37 6.28 L15.61 4.54 Z";
