import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RouteFocusManager } from "@/components/RouteFocusManager";
import { CurrencyProvider } from "@/lib/currency-context";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { RecentlyViewedProvider } from "@/lib/recently-viewed-context";
import { SavedDealsProvider } from "@/lib/saved-deals-context";
import { SavedSearchesProvider } from "@/lib/saved-searches-context";
import { ThemeProvider } from "@/lib/theme-context";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import "./globals.css";

// Headings/body use the system font stack (defined in globals.css) so the
// page renders in each visitor's native UI font — no web font to load for
// them. IBM Plex Mono is loaded only for tabular figures in data tables.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  const title = `${SITE_NAME} — ${dict.home.badge}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description: dict.home.lede,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: dict.home.lede,
      url: "/",
      siteName: SITE_NAME,
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.home.lede,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, dict } = await getDictionary();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: dict.home.lede,
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang={locale} className={`${plexMono.variable} h-full antialiased`} suppressHydrationWarning>
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
        <meta name="theme-color" content="#ffffff" />
        {/* Blocking, runs before first paint to avoid a flash of the wrong
            theme. Storage key must match theme-context.tsx's STORAGE_KEY —
            this can't import it, it has to run before any JS bundle loads. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("flight-points:theme");var d=t==="dark"||((t===null||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a
          href="#main-content"
          className="sr-only rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 print:hidden"
        >
          {dict.nav.skipToContent}
        </a>
        <I18nProvider locale={locale} dict={dict}>
          <ThemeProvider>
            <CurrencyProvider>
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
            </CurrencyProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
