import type { NextConfig } from "next";

/**
 * Response headers that are the same on every request.
 *
 * The Content-Security-Policy is not here. It carries a per-request nonce, so
 * it is built in `src/middleware.ts` from `src/lib/csp.ts`. These four need no
 * nonce, and keeping them here means they also cover the paths middleware
 * skips.
 *
 * The site has no accounts, no database and no outbound requests, so most of
 * the usual hardening has nothing to protect. These are the ones that still
 * earn their place on a page that renders editorial copy and reads query
 * parameters.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Belt and braces with the CSP's frame-ancestors, for anything that
  // predates CSP.
  { key: "X-Frame-Options", value: "DENY" },
  // The page asks for none of these, so nothing embedded in it should be
  // able to either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Advertising the framework and its version only helps someone matching
  // the site against a CVE list.
  poweredByHeader: false,
  /**
   * Explicit, because measuring said otherwise. `next start` was answering
   * /explore with 410KB of uncompressed HTML — a hundred-odd destination
   * rows, each one sent twice (once as markup, once as the payload React
   * hydrates from). The `Vary: Accept-Encoding` header was there; the
   * encoding was not.
   *
   * A CDN in front of this would compress anyway, and most deployments have
   * one. That is a reason to leave it on here, not a reason to leave it off:
   * the site should not depend on something outside the repo for its single
   * largest saving.
   */
  compress: true,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
