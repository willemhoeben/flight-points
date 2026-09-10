import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.notFound.title };
}

export default async function NotFound() {
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-sm font-semibold text-brand">{dict.notFound.eyebrow}</span>
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">{dict.notFound.title}</h1>
      <p className="mt-3 text-base text-muted">{dict.notFound.description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          {dict.notFound.backHome}
        </Link>
        <Link href="/search" className="px-6 py-3 text-sm font-medium text-brand hover:underline">
          {dict.notFound.searchAwards}
        </Link>
      </div>
    </div>
  );
}
