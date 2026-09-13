// Resolves to the real deployment URL automatically on Vercel (VERCEL_URL is
// set for every build there), falls back to localhost otherwise. Set
// NEXT_PUBLIC_SITE_URL to override with a custom domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const SITE_NAME = "Nightsky";

// Note for anyone tidying up after the rename: the localStorage keys are
// still prefixed "flight-points:" on purpose. They are internal identifiers
// no visitor ever sees, and renaming them would silently discard every
// existing visitor's saved deals, saved searches, calculator inputs, theme,
// currency, and last search. The prefix is cosmetic; the data is not.
