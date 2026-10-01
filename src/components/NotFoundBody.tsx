import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The not-found page, shared by every boundary that renders one.
 *
 * It lives in a component because `notFound()` renders the nearest
 * `not-found.tsx`, which means a route that calls it needs its own boundary
 * — and a second copy of this markup is how the two drift apart.
 */
export function NotFoundBody({ dict }: { dict: Dictionary }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-sm font-semibold text-brand-text">{dict.notFound.eyebrow}</span>
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">{dict.notFound.title}</h1>
      <p className="mt-3 text-base text-muted">{dict.notFound.description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          {dict.notFound.backHome}
        </Link>
        <Link href="/search" className="px-6 py-3 text-sm font-medium text-brand-text hover:underline">
          {dict.notFound.searchAwards}
        </Link>
      </div>
    </div>
  );
}
