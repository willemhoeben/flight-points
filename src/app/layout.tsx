import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CurrencyProvider } from "@/lib/currency-context";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { SavedDealsProvider } from "@/lib/saved-deals-context";
import { ThemeProvider } from "@/lib/theme-context";
import { SITE_NAME, SITE_URL } from "@/lib/site";
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
  const { dict } = await getDictionary();
  const title = `${SITE_NAME} — ${dict.home.badge}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description: dict.home.lede,
    openGraph: {
      title,
      description: dict.home.lede,
      url: "/",
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
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
          className="sr-only rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          {dict.nav.skipToContent}
        </a>
        <I18nProvider locale={locale} dict={dict}>
          <ThemeProvider>
            <CurrencyProvider>
              <SavedDealsProvider>
                <Navbar dict={dict.nav} />
                <main id="main-content" className="flex flex-1 flex-col">
                  {children}
                </main>
                <Footer dict={{ ...dict.footer, nav: dict.nav }} />
              </SavedDealsProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
