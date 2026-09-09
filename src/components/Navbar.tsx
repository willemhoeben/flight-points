import Link from "next/link";

const LINKS = [
  { href: "/search", label: "Award search" },
  { href: "/valuations", label: "Valuations" },
  { href: "/deals", label: "Deals" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
              <path
                d="M2 16.5l7-2.2V6.4a1.6 1.6 0 013.2 0v7.6l7 2.5v1.8l-7-1.4v3.5l2 1.3v1.3l-3.6-.9-3.6.9v-1.3l2-1.3v-3.5l-7 1.4v-1.9z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-base">Flight Points</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/search"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Search awards
        </Link>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-border px-4 py-2 text-sm font-medium text-muted sm:hidden">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
