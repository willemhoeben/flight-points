import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { CurrencySelector } from "@/components/CurrencySelector";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Navbar({ dict }: { dict: Dictionary["nav"] }) {
  const LINKS = [
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
      <div className="mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:h-11 sm:flex-nowrap sm:py-0 sm:px-6 max-w-6xl">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold tracking-tight">
          <BrandWordmark name={dict.brand} />
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-medium text-muted sm:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CurrencySelector />
          <ThemeToggle />
          <Link href="/search" className="whitespace-nowrap text-xs font-medium text-brand-text hover:underline">
            {dict.searchCta}
          </Link>
        </div>
      </div>
      {/* A three-column grid rather than one scrolling row. The row fit at no
          width in any language: the last link sat past the right edge with
          nothing to say it was there, and a nav you have to discover by
          swiping is a nav most people never finish reading. Three columns and
          not four because four truncates a label at 320px in English, Dutch,
          Spanish and Japanese; an extra row costs less than a clipped word. */}
      <nav className="grid grid-cols-3 gap-x-3 gap-y-1 border-t border-border px-4 py-2 text-xs font-medium text-muted sm:hidden">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="truncate transition-colors hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
