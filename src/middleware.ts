import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, createNonce, NONCE_HEADER } from "@/lib/csp";

/**
 * Mints a CSP nonce per request and puts the policy on both the request and
 * the response.
 *
 * Both, not one: the response header is what the browser enforces, and the
 * request header is how Next finds the nonce to stamp on the script tags it
 * writes itself. Set only the response header and the policy blocks Next's
 * own bootstrap.
 */
export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NONCE_HEADER, nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  /**
   * Everything but the build output. A policy on a chunk of JavaScript
   * governs nothing, and running middleware for each one would add a hop to
   * every asset on the page.
   */
  matcher: ["/((?!_next/static|_next/image).*)"],
};
