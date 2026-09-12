import Link from "next/link";
import { CurrencySelector } from "@/components/CurrencySelector";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Navbar({ dict }: { dict: Dictionary["nav"] }) {
  const LINKS = [
    { href: "/search", label: dict.search },
    { href: "/valuations", label: dict.valuations },
    { href: "/deals", label: dict.deals },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:h-11 sm:flex-nowrap sm:py-0 sm:px-6 max-w-6xl">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-brand text-[10px] font-extrabold tracking-tighter text-brand-foreground"
          >
            FP
          </span>
          {dict.brand}
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
          <Link href="/search" className="whitespace-nowrap text-xs font-medium text-brand hover:underline">
            {dict.searchCta}
          </Link>
        </div>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 py-1.5 text-xs font-medium text-muted sm:hidden">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
