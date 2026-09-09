import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-sm font-semibold uppercase tracking-wide text-brand">404</span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        This route didn&apos;t clear customs.
      </h1>
      <p className="mt-3 text-base text-muted">
        The page you&apos;re looking for doesn&apos;t exist. It may have been moved, or
        the link might be off by a letter.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/search"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
        >
          Search awards
        </Link>
      </div>
    </div>
  );
}
