import Link from "next/link";
import { CurrencySelector } from "@/components/CurrencySelector";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Navbar({ dict }: { dict: Dictionary["nav"] }) {
  const LINKS = [
    { href: "/search", label: dict.search },
    { href: "/valuations", label: dict.valuations },
    { href: "/deals", label: dict.deals },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-2 sm:h-[52px] sm:flex-nowrap sm:py-0 sm:px-6 max-w-6xl">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold tracking-tight">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-brand-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M2 16.5l7-2.2V6.4a1.6 1.6 0 013.2 0v7.6l7 2.5v1.8l-7-1.4v3.5l2 1.3v1.3l-3.6-.9-3.6.9v-1.3l2-1.3v-3.5l-7 1.4v-1.9z"
                fill="currentColor"
              />
            </svg>
          </span>
          {dict.brand}
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-medium text-muted sm:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <CurrencySelector />
          <Link href="/search" className="whitespace-nowrap text-xs font-medium text-brand hover:underline">
            {dict.searchCta}
          </Link>
        </div>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 py-2 text-xs font-medium text-muted sm:hidden">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
