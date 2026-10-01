import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RouteFocusManager } from "@/components/RouteFocusManager";
import { BalancesProvider } from "@/lib/balances-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { PROGRAMS } from "@/data/programs";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/format";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context";
import { SavedDealsProvider } from "@/lib/saved-deals-context";
import { SavedSearchesProvider } from "@/lib/saved-searches-context";
import { ThemeProvider } from "@/lib/theme-context";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import "./globals.css";

// Archivo for everything that is read as language, IBM Plex Mono for
// everything that is read as a measurement: codes, distances, miles, dates.
// The split is the whole typographic idea — a route is a number and a place,
// and the two should not look alike. Archivo is a grotesque with a
// variable width axis, which keeps a long German label on one line where a
// fixed-width face would wrap it.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  const title = `${SITE_NAME} — ${dict.home.badge}`;
  const lede = interpolate(dict.home.lede, { count: PROGRAMS.length });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description: lede,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: lede,
      url: "/",
      siteName: SITE_NAME,
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: lede,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, dict } = await getDictionary();

  const lede = interpolate(dict.home.lede, { count: PROGRAMS.length });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: lede,
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang={locale} className={`${archivo.variable} ${plexMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {/* Matches the mobile browser chrome (address/status bar) to the
            current page background, same idea as the manifest's separate
            (static, installed-app-only) background_color. applyThemeClass
            in theme-context.tsx keeps content in sync after hydration.
            Deliberately NOT also set by the blocking script below: mutating
            this SSR-rendered tag's content pre-hydration made React 19's
            hydration see a mismatch against the static JSX value and mount
            a second, orphaned copy that later updates kept hitting instead
            of this one — a wrong browser-chrome color for one frame is a
            smaller cost than a meta tag that silently stops updating. */}
        <meta name="theme-color" content="#eef1f7" />
        {/* Blocking, runs before first paint to avoid a flash of the wrong
            theme. Storage key must match theme-context.tsx's STORAGE_KEY —
            this can't import it, it has to run before any JS bundle loads. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("flight-points:theme");var d=t==="dark"||((t===null||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
        <a
          href="#main-content"
          className="sr-only bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 print:hidden"
        >
          {dict.nav.skipToContent}
        </a>
        <I18nProvider locale={locale} dict={dict}>
          <ThemeProvider>
            <CurrencyProvider>
              <BalancesProvider>
              <SavedDealsProvider>
                <SavedSearchesProvider>
                  <RecentlyViewedProvider>
                    <RouteFocusManager />
                    <Navbar dict={dict.nav} />
                    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
                      {children}
                    </main>
                    <Footer dict={{ ...dict.footer, nav: dict.nav }} />
                  </RecentlyViewedProvider>
                </SavedSearchesProvider>
              </SavedDealsProvider>
              </BalancesProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
