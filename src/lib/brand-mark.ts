/**
 * The Nightsky mark: a four-point star.
 *
 * The name carries the idea — "nights" for hotel points, "sky" for airline
 * miles — so the mark doesn't have to illustrate it. That's what lets it be
 * this simple, and being this simple is what lets it survive a 16px browser
 * tab, where the hotel-and-plane drawing it replaced turned to mush.
 *
 * Geometry lives here as bare path data rather than in a component because
 * it has to render in two different worlds: React DOM for the navbar, and
 * Satori (`next/og`) for the favicon, the apple-touch icon, the two manifest
 * icons, and both Open Graph images. Seven renderers, one source of truth.
 *
 * The four points aim at the middle of each edge, never into a corner, so
 * the mark keeps its full inset under any corner radius — including the one
 * iOS crops onto a home-screen icon.
 */
export const BRAND_MARK_VIEWBOX = "0 0 32 32";

export const BRAND_MARK_STAR =
  "M16.00 2.00 L18.97 13.03 L30.00 16.00 L18.97 18.97 " +
  "L16.00 30.00 L13.03 18.97 L2.00 16.00 L13.03 13.03 Z";
