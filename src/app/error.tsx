"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDictionary } from "@/lib/i18n/i18n-context";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dict = useDictionary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-sm font-semibold text-stamp">{dict.errorPage.eyebrow}</span>
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">{dict.errorPage.title}</h1>
      <p className="mt-3 text-base text-muted">{dict.errorPage.description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-strong"
        >
          {dict.errorPage.tryAgain}
        </button>
        <Link href="/" className="px-6 py-3 text-sm font-medium text-brand hover:underline">
          {dict.errorPage.backHome}
        </Link>
      </div>
    </div>
  );
}
