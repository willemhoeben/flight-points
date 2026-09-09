// Resolves to the real deployment URL automatically on Vercel (VERCEL_URL is
// set for every build there), falls back to localhost otherwise. Set
// NEXT_PUBLIC_SITE_URL to override with a custom domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const SITE_NAME = "Flight Points";
