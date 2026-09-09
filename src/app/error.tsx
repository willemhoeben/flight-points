"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-sm font-semibold text-stamp">Something went wrong</span>
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">This flight got diverted.</h1>
      <p className="mt-3 text-base text-muted">
        An unexpected error occurred while loading this page. You can try again, or head
        back to the homepage.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-strong"
        >
          Try again
        </button>
        <Link href="/" className="px-6 py-3 text-sm font-medium text-brand hover:underline">
          Back to home ›
        </Link>
      </div>
    </div>
  );
}
