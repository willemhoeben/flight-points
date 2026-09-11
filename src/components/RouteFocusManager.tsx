"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders nothing — moves focus to the main content landmark on every
 * client-side route change. Next.js App Router doesn't manage focus on
 * navigation itself (unlike a real full-page load, where the browser
 * resets focus to <body> at the top of a new document); without this,
 * keyboard and screen-reader users keep whatever focus they had on the
 * previous page, or lose it to <body> entirely, instead of landing
 * somewhere that reflects the page they just navigated to.
 */
export function RouteFocusManager() {
  const pathname = usePathname();
  // Seeded with the current pathname (not a plain boolean flag) so this
  // stays correct under React Strict Mode's dev-only double effect
  // invocation: both invocations compare against the same unchanged
  // pathname and skip, rather than a "first render" flag that the second
  // invocation would already see as flipped.
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    document.getElementById("main-content")?.focus();
  }, [pathname]);

  return null;
}
