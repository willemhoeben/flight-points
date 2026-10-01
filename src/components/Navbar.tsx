import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { CurrencySelector } from "@/components/CurrencySelector";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { NavLinks, type NavLink } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Navbar({ dict }: { dict: Dictionary["nav"] }) {
  const LINKS: NavLink[] = [
    { href: "/search", label: dict.search },
    { href: "/explore", label: dict.explore },
    { href: "/network", label: dict.network },
    { href: "/valuations", label: dict.valuations },
    { href: "/wallet", label: dict.wallet },
    { href: "/compare", label: dict.compare },
    { href: "/deals", label: dict.deals },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-12 items-center justify-between gap-x-4 px-4 sm:h-11 sm:px-6 max-w-6xl">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 whitespace-nowrap text-[14px] font-semibold tracking-tight sm:min-h-0"
        >
          <BrandWordmark name={dict.brand} />
        </Link>

        <NavLinks links={LINKS} />

        <div className="flex items-center gap-3">
          {/* Language and currency move into the panel on a phone; the theme
              toggle stays out here because it is the one people flip often. */}
          <span className="hidden sm:block">
            <LanguageSwitcher />
          </span>
          <span className="hidden sm:block">
            <CurrencySelector />
          </span>
          <ThemeToggle />
          <Link href="/search" className="hidden whitespace-nowrap text-xs font-medium text-brand-text hover:underline sm:inline">
            {dict.searchCta}
          </Link>
          <MobileNav links={LINKS} />
        </div>
      </div>
    </header>
  );
}
