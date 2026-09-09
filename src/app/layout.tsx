import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const DESCRIPTION =
  "Search award flight availability across loyalty programs and see what your points are actually worth.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — award search & points valuations`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — award search & points valuations`,
    description: DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — award search & points valuations`,
    description: DESCRIPTION,
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <a
          href="#main-content"
          className="sr-only rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
