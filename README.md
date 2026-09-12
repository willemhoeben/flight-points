# Flight Points

An award flight search and points-valuation demo, inspired by [seats.aero](https://seats.aero/)
and [flightpoints.com](https://flightpoints.com/). Not affiliated with either site or any
airline or loyalty program.

## What's here

- **`/search`** — search award availability by route, date, and cabin across 16
  loyalty programs (grouped by alliance — Star Alliance/Oneworld/SkyTeam/
  Unaligned — in the program filter), with a 14-day calendar view highlighting
  the cheapest day to fly and a sortable results table (Duration/Seats/Miles).
  Remembers your last search in localStorage and returns to it on a bare
  `/search` visit.
- **`/valuations`** — a sortable, filterable (bank/airline/hotel) table of
  estimated cents-per-point values for major currencies, plus a two-way
  calculator: points → cash value, or a target cash amount → points needed.
  The filter and sort are reflected in the URL (`?type=hotel&sort=name&dir=asc`,
  omitted when at their defaults) and applied by `router.replace` — no page
  reload, but the resulting link is bookmarkable and shareable, same as
  `/search` and `/deals`. A "Copy share link" button sits next to the filter
  pills for exactly that.
- **`/deals`** — 8 sample transfer-bonus and award-chart sweet-spot writeups, filterable
  by category (`?category=transfer-bonus|sweet-spot|sale`) and sortable by
  newest or soonest-expiring (`?sort=newest|expiring`) — the two compose,
  e.g. `?category=transfer-bonus&sort=expiring`. Save any deal for later from
  its detail page; saved deals get a star badge back on the grid. Persisted
  to localStorage, synced across tabs, no account needed. A "★ Saved" pill
  next to the sort options filters the grid down to just your saved deals.
  Opening any deal also auto-tracks it in a "Recently viewed" row above the
  filters — a passive complement to explicit saving, capped at the last 5,
  most-recent first. All deals are also published as an RSS 2.0 feed at
  `/deals/feed.xml` (linked from the footer and auto-discoverable by feed
  readers via a `<link rel="alternate">` tag), newest first.

Visual design is inspired by apple.com: the system font stack (no web font
for headings/body), a white/black + `#0071e3` blue palette, borderless gray
rounded panels, and a dense, compact layout (a 44px navbar, tightened section
and card spacing throughout) rather than a lot of open whitespace. The brand
mark is an "FP" monogram badge. `src/app/icon.tsx`, `apple-icon.tsx`, and
`opengraph-image.tsx` generate the favicon, iOS home-screen icon, and social
share image from the same brand mark; each deal also gets its own share
image (`deals/[slug]/opengraph-image.tsx`) showing that deal's title,
category, and bonus%, instead of falling back to the generic site-wide one.
`manifest.ts` makes the site installable. `error.tsx` and `not-found.tsx` give runtime errors and bad
routes a branded page instead of Next's defaults. `loading.tsx` files on
`/search`, `/deals`, `/deals/[slug]`, and `/valuations` (all server-rendered
per request, since they read the locale cookie) give each a skeleton screen
— an `aria-live` region with a localized "Loading…" label for screen-reader
users, not just a silent pulse animation — instead of a blank page while the
server responds. A skip-to-content link,
keyboard-accessible sort/filter controls, a `RouteFocusManager` that moves
focus to the new page's content on every client-side navigation (Next.js
doesn't do this itself — without it, keyboard and screen-reader users keep
whatever focus they had on the page they just left), and a global
`prefers-reduced-motion` override (hover/focus transitions collapse to
near-zero for anyone who's asked their OS for less motion), a `lang="en"`
on the deal title and body when the page itself is in another language (so a
Dutch or Japanese screen reader doesn't read the English article text aloud
in the wrong voice), and a consistent branded keyboard-focus ring on every
link and button (previously most fell back to each browser's own mismatched
default outline) round out the accessibility basics. A print stylesheet hides
the navbar, footer, and anything purely interactive (filter/sort pills, the
save-deal and copy-link buttons, the search form's submit button) and forces
the light color palette even when the page was viewed in dark mode, so
printing or "save as PDF" from a deal page or the valuations table produces a
clean, ink-friendly page instead of a screenshot of the live UI.

A matching standalone HTML version (same data, same interactions, ported to
vanilla JS) exists as a Claude Artifact for quick browser testing without
running the dev server — ask in the originating conversation for the link.
It has its own currency selector and the same seven-language switcher as
this repo (Dutch/English/German/French/Spanish/Italian/Japanese) — hand-translated
directly into the artifact's single file, with no compiler or type checker
to catch a missed key across the larger dictionary, so each addition got
verified live in a browser rather than trusted on sight. Its deal articles
are Dutch-only editorial content (the mirror image of this repo's
English-only articles), so non-Dutch readers see a translated notice
instead of a translated article body. It also mirrors the alliance-grouped
program checkboxes on the search tab, the save-deal feature (a star toggle,
a read-only grid badge, and the "★ Saved" filter pill), the recently-viewed
deals row, and the System/Light/Dark theme toggle — persisted to the
browser's localStorage the same way, with the same pre-paint blocking script to
avoid a flash of the wrong theme on load. It has the same print stylesheet
too (chrome and interactive-only controls hidden, light palette forced,
tables expanded to full width) — including a fix for a real overlap bug that
only showed up there first: at print widths ≥900px, the expanded table and
the fixed-width points calculator sit in a two-column grid that can't
actually fit both, so the table overflowed and got visually covered by the
calculator card. Both this repo and the artifact now force a single-column
layout when printing. The artifact's deal panel also mirrors the visible
breadcrumb trail (Home / Deals / the deal), with its own click handlers since
that panel's markup is injected after the page's one-time event delegation
runs — the same reason its save-deal button and back link needed manual
listeners already.

## Languages and currencies

The navbar has two independent selectors:

- **Language** — English, Nederlands, Deutsch, Français, Español, Italiano, 日本語. Cookie-based
  (`src/lib/i18n/`), not route-prefixed (no `/en/`, `/nl/`): a `locale` cookie
  set by the switcher is read once per request in the root layout and handed
  down to every page. This translates UI chrome — navigation, forms, table
  headers, page copy, error/404 pages. It deliberately does **not** translate
  deal article bodies, valuation notes, or proper nouns (airport names,
  program names) — that's editorial content translation, a different task
  from app engineering, and out of scope here. Cookie-based locale switching
  means pages that read it (`/`, `/deals`, `/deals/[slug]`, `/search`,
  `/valuations`) render dynamically rather than as static HTML — a deliberate
  trade against the much larger scope of full route-based i18n with per-locale
  static generation.
- **Currency** — USD/EUR/GBP/JPY/CAD/AUD/CHF/SEK/SGD/HKD (`src/lib/currency.ts`), applied to
  the results table's taxes & fees column and the points calculator. Static,
  illustrative exchange rates, consistent with the rest of the site's
  mock-data approach — not a live feed. Persisted to localStorage and synced
  across tabs.

A third selector, **Theme** (System/Light/Dark, `src/lib/theme-context.tsx`),
overrides the OS-level `prefers-color-scheme` default. A blocking inline
script in the root layout applies the stored choice before first paint, so
there's no flash of the wrong theme on load; while set to "System" it keeps
following live OS-level changes.

All three selections persist independently: language via cookie, currency
and theme via localStorage.

## Data: this runs entirely on mock data

There is no live award-availability feed or pricing API wired up. All search
results and valuations are generated deterministically from `src/data/*.ts` —
the same route, date, cabin, and program filter always return the same
numbers, so the UI is stable to click through, bookmark, and share, but the
numbers are not real.

To make this a real working search engine, the piece to build is a data
source behind `src/data/availability.ts`'s `searchAvailability` /
`searchCalendar` functions. Two realistic paths:

1. **A paid data API** — e.g. [seats.aero's own developer API](https://developers.seats.aero/)
   or [Point.me](https://www.point.me/), which already aggregate real award
   availability. Swap the mock generator for a fetch call.
2. **Scraping airline sites directly** — this is what seats.aero does
   internally. It's a large, ongoing engineering effort (dozens of programs,
   constant maintenance as airlines change their sites) and is against the
   Terms of Service of most airlines, so it needs a deliberate decision
   before building, not a default.

The points valuations (`src/data/valuations.ts`) are illustrative example
figures in the style of published points-guide valuations, not a live feed.

## Development

```bash
bun install
bun run dev      # start the dev server on http://localhost:3000
bun run build    # production build
bun run lint     # eslint
bun run test     # bun:test — date/format/currency/prng/sort helpers, data integrity, the mock availability engine
```

Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

`/robots.txt` and `/sitemap.xml` are generated from `src/app/robots.ts` /
`src/app/sitemap.ts` and point at `NEXT_PUBLIC_SITE_URL` if set, otherwise
Vercel's own `VERCEL_URL` at deploy time, otherwise `localhost:3000`. Set
`NEXT_PUBLIC_SITE_URL` once you're on a custom domain.

JSON-LD structured data is on every page: `WebSite`/`Organization` from the
root layout, plus `Article` (headline, description, publish/expiry dates,
author/publisher) and `BreadcrumbList` (Home → Deals → the deal itself, with
every crumb in the page's own locale) on each `/deals/[slug]` page. The
`BreadcrumbList` isn't just structured data crawlers see — a matching visible
breadcrumb trail (`src/components/Breadcrumbs.tsx`) renders the same three
crumbs above every deal, with `aria-current="page"` on the current one, so
sighted and screen-reader users get the same "where am I" context search
engines do.

Every page sets a self-referencing canonical URL, a page-specific description,
and Open Graph/Twitter Card previews (`summary_large_image`, matching the
generated share images above) instead of inheriting the homepage's. Every
page also declares `og:locale` for the visitor's current language and
`og:locale:alternate` for the other six — legitimate here even without
per-locale URLs (see "Languages and currencies" above for why this site is
cookie-based, not route-based): all seven language versions genuinely live
at the same URL, which is exactly what those two tags are for.
