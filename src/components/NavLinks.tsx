"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLink = { href: string; label: string };

/**
 * True for the page itself and for anything below it, so a deal article still
 * marks Deals as the section you are in. Exact-match only would leave the nav
 * blank on every one of the twelve deal pages — the page where "where am I?"
 * is hardest to answer, since a deal is usually arrived at from a link rather
 * than from the nav.
 */
export function isCurrentSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The desktop navigation.
 *
 * It exists as its own client component for one reason: the current page has
 * to be marked, and that needs the pathname. Before this, all seven links
 * rendered identically on all nine pages — cover the content and the nav
 * could not tell you which page you were on, and a screen reader was told
 * nothing at all. The phone panel already did this; the bar did not.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 text-xs font-medium text-muted sm:flex">
      {links.map((link) => {
        const current = isCurrentSection(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            // Colour alone would carry this for most people and for nobody
            // with a colour vision deficiency, so the current item also sits
            // over a rule the others do not have.
            className={
              current
                ? "border-b-2 border-brand pb-0.5 text-foreground"
                : "border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
