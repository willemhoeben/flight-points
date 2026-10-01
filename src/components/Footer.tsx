import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { BrandWordmark } from "@/components/BrandWordmark";

const FOOTER_LINK = "flex min-h-11 items-center hover:text-foreground sm:min-h-0";

export function Footer({ dict }: { dict: Dictionary["footer"] & { nav: Dictionary["nav"] } }) {
  return (
    <footer className="border-t border-border print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 text-[12.5px] sm:grid-cols-3">
          <div>
            <div className="font-semibold text-foreground"><BrandWordmark name={dict.nav.brand} /></div>
            <p className="mt-2 max-w-xs text-muted">{dict.tagline}</p>
          </div>
          <div>
            <div className="font-semibold text-foreground">{dict.productHeading}</div>
            {/* Eight links in one column were 14px-tall text at a 20px
                pitch, which is a row of mis-taps waiting to happen on a
                phone. Two columns of 44px rows reach the floor a fingertip
                needs for 176px of footer instead of the 352px one column
                would have cost. Back to one column from sm up, where a
                cursor makes the height moot. */}
            <ul className="mt-2 grid grid-cols-2 text-muted sm:grid-cols-1 sm:space-y-1.5">
              {[
                { href: "/search", label: dict.nav.search },
                { href: "/explore", label: dict.nav.explore },
                { href: "/network", label: dict.nav.network },
                { href: "/valuations", label: dict.nav.valuations },
                { href: "/wallet", label: dict.nav.wallet },
                { href: "/compare", label: dict.nav.compare },
                { href: "/deals", label: dict.nav.deals },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={FOOTER_LINK}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                {/* A plain anchor, not Link: the feed is a route handler, and
                    a client-side navigation to it has nothing to render. */}
                <a href="/deals/feed.xml" className={FOOTER_LINK}>
                  {dict.rssFeed}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-foreground">{dict.aboutHeading}</div>
            <p className="mt-2 max-w-xs text-muted">{dict.aboutText}</p>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-[11.5px] text-muted">
          © {new Date().getFullYear()} {dict.nav.brand}. {dict.copyright}
        </div>
      </div>
    </footer>
  );
}
