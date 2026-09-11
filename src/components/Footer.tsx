import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ dict }: { dict: Dictionary["footer"] & { nav: Dictionary["nav"] } }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 text-[12.5px] sm:grid-cols-3">
          <div>
            <div className="font-semibold text-foreground">{dict.nav.brand}</div>
            <p className="mt-2 max-w-xs text-muted">{dict.tagline}</p>
          </div>
          <div>
            <div className="font-semibold text-foreground">{dict.productHeading}</div>
            <ul className="mt-2 space-y-1.5 text-muted">
              <li><Link href="/search" className="hover:text-foreground">{dict.nav.search}</Link></li>
              <li><Link href="/valuations" className="hover:text-foreground">{dict.nav.valuations}</Link></li>
              <li><Link href="/deals" className="hover:text-foreground">{dict.nav.deals}</Link></li>
              <li>
                <a href="/deals/feed.xml" className="hover:text-foreground">
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
