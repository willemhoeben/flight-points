/**
 * The Content-Security-Policy, built per request around a fresh nonce.
 *
 * A nonce normally costs static rendering, which is why it usually loses the
 * argument on a content site. It costs nothing here: every page reads the
 * locale cookie, so every page already renders per request. `next build`
 * emits exactly one prerendered HTML file (`_global-error`), and that one
 * never carries a nonce because it never reaches middleware.
 *
 * The alternative was `script-src 'self' 'unsafe-inline'`, which permits
 * precisely the injection a CSP is for. It would still block a third-party
 * script origin, so it is not nothing, but it reads as a script policy while
 * leaving the main door open.
 *
 * `'strict-dynamic'` is what makes the nonce workable rather than a
 * whack-a-mole over every script tag Next emits. It says: trust a script the
 * nonce vouches for, and trust the scripts that script goes on to create.
 * Next's bootstrap injects the route chunks itself, so the chunks need no
 * nonce of their own. `'self'` stays in the list only for browsers that do
 * not understand `'strict-dynamic'` and would otherwise fall back to
 * refusing everything; a browser that does understand it ignores `'self'`.
 */
export function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Styles do not get the same treatment. Tailwind and React both inject
    // style tags, and a style nonce does not cover the `style=` attributes
    // React writes for animations — that needs 'unsafe-hashes', which is a
    // worse trade than accepting inline styles. A style injection can
    // deface and can read layout; it cannot run code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // No analytics, no embeds, no third-party anything — so a script that
    // did somehow run would have nowhere to send what it found.
    "connect-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** 128 bits, which is the floor the CSP spec asks for. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * The request header the nonce travels on. Next reads the nonce out of the
 * CSP request header for its own script tags; this one exists so the layout
 * can put it on the pre-paint theme script, which Next knows nothing about.
 */
export const NONCE_HEADER = "x-nonce";
