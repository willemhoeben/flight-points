import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { WalletPanel } from "@/components/WalletPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.wallet.title,
    description: dict.wallet.description,
    alternates: { canonical: "/wallet" },
    openGraph: {
      title: dict.wallet.title,
      description: dict.wallet.description,
      url: "/wallet",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: { card: "summary_large_image", title: dict.wallet.title, description: dict.wallet.description },
  };
}

export default async function WalletPage() {
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.wallet.eyebrow}
        title={dict.wallet.title}
        description={dict.wallet.description}
      />
      {/* The balances live in this browser, so the whole panel is client-side;
          the page around it stays server-rendered for the metadata and the
          heading. */}
      <WalletPanel />
    </div>
  );
}
