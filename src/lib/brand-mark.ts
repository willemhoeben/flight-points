/**
 * The Nightsky logo is the name itself, set in the UI font with a four-point
 * star standing in for the dot on the "i". Two pieces of geometry serve it.
 *
 * Both live here as bare path data rather than inside a component, because
 * they have to render in two different worlds: React DOM for the navbar and
 * footer, and Satori (`next/og`) for the favicon, the apple-touch icon, the
 * two manifest icons, and both Open Graph images. Seven renderers, one
 * source of truth.
 */
export const BRAND_MARK_VIEWBOX = "0 0 32 32";

/**
 * The star that replaces the tittle of the "i". Its four points aim at the
 * middle of each edge rather than into a corner, so it keeps its full inset
 * under any corner radius — including the one iOS crops onto a home-screen
 * icon.
 */
export const BRAND_MARK_STAR =
  "M16.00 2.00 L18.97 13.03 L30.00 16.00 L18.97 18.97 " +
  "L16.00 30.00 L13.03 18.97 L2.00 16.00 L13.03 13.03 Z";

/**
 * The initial, for the square slots a wordmark can't fill: the favicon, the
 * iOS icon, and the two manifest icons.
 *
 * It's drawn rather than typed because Satori ships a single font weight and
 * silently ignores `fontWeight`, so a text "N" renders thin and apologetic
 * at exactly the sizes that need it to be confident. Drawing it also keeps
 * the letter identical across all four, independent of what font happens to
 * resolve. Stems are 5 units against a 4.26-unit diagonal, the slight taper
 * a type designer would cut.
 */
export const BRAND_MARK_N =
  "M6.00 5.00 L11.00 5.00 L21.00 19.50 L21.00 5.00 L26.00 5.00 " +
  "L26.00 27.00 L21.00 27.00 L11.00 12.50 L11.00 27.00 L6.00 27.00 Z";
