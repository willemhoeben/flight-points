# Flight Points

An award flight search and points-valuation demo, inspired by [seats.aero](https://seats.aero/)
and [flightpoints.com](https://flightpoints.com/). Not affiliated with either site or any
airline or loyalty program.

## What's here

- **`/`** — the landing page, with an airliner crossing the middle of the
  viewport on load: a planform (seen-from-below) silhouette with swept,
  tapered wings, a tailplane, two engine nacelles, and a pair of contrails
  that widen and fade behind it. Pure CSS animation, no JS — linear movement
  (a real aircraft doesn't accelerate into frame) with a small scale change
  for perspective and a sub-degree bank for a gentle climb, transform-only so
  it composites on the GPU. The layer is viewport-fixed, `aria-hidden`, and
  `pointer-events-none`, so it flies over the content without reaching the
  accessibility tree or swallowing a click, and it respects
  `prefers-reduced-motion` the same way every other animated element does.
  It lives on the landing page only: a plane sliding across a results table
  you're reading is noise, not atmosphere. (The artifact is one document
  rather than a set of routes, so it scopes the layer to its Home tab
  explicitly and replays the flight on each return, which is what
  remounting the component does here.)
- **`/search`** — search award availability by route, date, and cabin across 16
  loyalty programs (grouped by alliance — Star Alliance/Oneworld/SkyTeam/
  Unaligned — in the program filter), with a 14-day calendar view highlighting
  the cheapest day to fly and a sortable results table (Duration/Seats/Miles).
  The table's sort is reflected in the URL (`?sort=durationMinutes&dir=desc`,
  omitted at the default miles-ascending order) alongside the existing
  route/date/cabin/program params, so a sorted search is exactly as
  bookmarkable and shareable as an unsorted one — same `router.replace`,
  no-reload approach as `/valuations`. A "Nonstop only" filter pill, an
  Alliance filter (All/Star Alliance/Oneworld/SkyTeam/Unaligned), and a Max
  taxes & fees filter (All/Under $50/Under $100/Under $200) sit above
  the results table (`?nonstop=1&alliance=star-alliance&maxFees=100`,
  composing with sort in the same URL) and narrow the list together, with
  an empty state that's specific to "no nonstop options" when that's the
  only filter active and a generic "no results match these filters" once
  alliance or fees is involved too. Alliance and fees each open with their
  own "All" pill, so each group carries a visible label ("Alliance", "Max
  fees") and a matching `aria-label` — a bare "All" on its own line says
  nothing about what it resets once the row wraps on a phone. The fee
  thresholds are fixed 50/100/200 USD internally but their pill labels
  render in whatever currency you've selected (so switching to EUR shows
  "Under €46", not "Under $50") — same currency-conversion path the taxes
  & fees column itself already uses, with the cents dropped via
  `formatCurrency`'s `round` option, since a coarse threshold shouldn't
  imply two decimal places of precision. The 16-program picker is a
  collapsed `<details>` that summarises its own state ("All 16 programs",
  or "2 of 16 programs" when narrowed, in which case it opens on arrival):
  every box is ticked by default and most people never narrow it, so
  leaving it expanded pushed the calendar and the results themselves below
  the fold. It's a native element, so the form stays JS-free and the
  collapsed checkboxes still submit. Below `md` the results render as
  cards rather than a table: the table needs 720px, which the content
  column only reaches at `md`, so narrower screens used to see Program,
  Routing, and part of Duration while the miles cost and the taxes &
  fees sat off the right edge behind a sideways scroll with nothing to
  hint at it — you could run a search on your phone and never see a
  price. Each card puts the program, its alliance, and the best-price
  badge on the left, the miles cost large on the right, then routing /
  duration / taxes / seats as a labelled two-column grid, then whether
  it's bookable online. Two cards per row from `sm` up. Sorting comes
  with them: a "Sort by" pill row stands in for the sortable table
  headers and drives the same `?sort=&dir=` params, so a sorted search
  is as shareable from a phone as from a desktop. Remembers your last search in
  localStorage and returns to it on a bare `/search` visit. Every query
  param is validated against a known set (airport codes, cabins, an ISO
  date) before use — an invalid or garbled one falls back to a sensible
  default instead of breaking the page. A "Save this search" star button
  next to the results header bookmarks the current route/date/cabin/program
  combination to localStorage — a "Saved searches" chip row appears above
  the search form with quick-launch links back to each one, plus a remove
  button per chip. Saving the same route/date/cabin again (even with a
  different program selection) refreshes that entry in place rather than
  creating a near-duplicate, and the list is capped at 8, oldest dropped
  first. This is the explicit, user-curated counterpart to the passive
  "remember my last search" behavior above — same relationship as saved
  deals vs. recently-viewed deals.
- **`/valuations`** — a sortable, filterable (bank/airline/hotel) table of
  estimated cents-per-point values for major currencies, plus a two-way
  calculator: points → cash value, or a target cash amount → points needed.
  Its mode, points program, and entered amounts persist to localStorage —
  the one input-heavy control on the site that used to reset on every
  visit — so picking up where you left off doesn't mean retyping a balance.
  The filter and sort are reflected in the URL (`?type=hotel&sort=name&dir=asc`,
  omitted when at their defaults) and applied by `router.replace` — no page
  reload, but the resulting link is bookmarkable and shareable, same as
  `/search` and `/deals`. A "Copy share link" button sits next to the filter
  pills for exactly that. Below `md` the valuations render as cards for the
  same reason the search results do — the table is wider than its column
  there, and the cents-per-point value, the trend, and the notes were the
  parts that fell off the right edge. The calculator only moves beside the
  table at `xl`: it used to at `lg`, which left the table column 592px,
  narrower than the table's own 640px minimum, so a 1024px laptop got the
  same sideways scroll a phone did.
- **`/compare`** — pick two or more point currencies (bank/airline/hotel,
  grouped the same way as `/search`'s program picker) and a shared points
  balance to see which is worth more, ranked by cash value with the top
  pick badged "Best value". Selection and balance are reflected in the URL
  (`?currencies=chase-ur&currencies=hyatt&balance=100000`, balance omitted
  at its 60,000-point default) so a comparison is exactly as bookmarkable
  and shareable as a sorted `/valuations` table — same `router.replace`
  approach, same silent-drop handling for a stale/unknown currency id in a
  share link.
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
`manifest.ts` makes the site installable, with a dynamic `icons/[size]`
route generating the 192×192 and 512×512 icons Chrome's own installability
check actually requires — the 32×32 favicon alone met the letter of the
manifest spec but not that bar, and would have rendered blurry on an
Android home screen. `error.tsx` and `not-found.tsx` give runtime errors and bad
routes a branded page instead of Next's defaults. `loading.tsx` files on
`/search`, `/deals`, `/deals/[slug]`, and `/valuations` (all server-rendered
per request, since they read the locale cookie) give each a skeleton screen
— an `aria-live` region with a localized "Loading…" label for screen-reader
users, not just a silent pulse animation — instead of a blank page while the
server responds. A skip-to-content link,
keyboard-accessible sort/filter controls, a `RouteFocusManager` that moves
focus to the new page's content on every client-side navigation (Next.js
doesn't do this itself — without it, keyboard and screen-reader users keep
whatever focus they had on the page they just left), an `aria-live` region on
the search results and valuations tables announcing a translated "Sorted by
Duration, descending" on every sort change (`aria-sort` on the header cell
tells assistive tech the *current* state, but not that it just changed — the
live region covers the gap), and a global
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
verified live in a browser rather than trusted on sight. Its own first-visit
default mirrors the repo's Accept-Language fallback using `navigator.languages`
instead (Dutch, not English, is its hardcoded last-resort default — an
intentional difference from the repo, not a bug), and its starting currency
follows that same detected language before anything's saved, same as the repo.
Its points calculator remembers its mode, points program, and entered
amounts the same way too, using the same localStorage pattern as its
remembered-last-search feature. Its own share-link and remembered-search
fields are validated the same way as the repo's search params — a
malformed date falls back to a real date instead of throwing and
breaking the page's script, and an unrecognized origin/destination/cabin
falls back to a default instead of rendering a raw, unrecognized code. Its deal articles
are Dutch-only editorial content (the mirror image of this repo's
English-only articles), so non-Dutch readers see a translated notice
instead of a translated article body. It also mirrors the alliance-grouped
program checkboxes on the search tab, the save-deal feature (a star toggle,
a read-only grid badge, and the "★ Saved" filter pill), the recently-viewed
deals row, and the System/Light/Dark theme toggle — persisted to the
browser's localStorage the same way, with the same pre-paint blocking script to
avoid a flash of the wrong theme on load. Its top-tab bar (Home/Search/
Valuations/Deals) has its own `role="tablist"`, an architecture the repo's
real routes don't need — its accessible name is translated, same as its
language/currency/theme selectors. It has the same print stylesheet
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
listeners already. Its results and valuations tables mirror the sort-order
`aria-live` announcement too, translated the same way as everything else in
its single-file dictionary. Its results table also has the same "Nonstop
only" filter pill, the same Alliance filter (All/Star Alliance/
Oneworld/SkyTeam/Unaligned), and the same Max taxes & fees filter
(All/Under $50/Under $100/Under $200, labels re-rendered in the
selected currency) as the repo, composing together with an
empty state that's specific to "no nonstop options" or generic once
alliance or fees is involved — not URL-synced like the repo's version
since the artifact keeps its own view state in memory rather than a query
string, but otherwise the same filter logic and translated into all seven
languages. The alliance and fee groups carry the same visible labels and
`aria-label`s, and the fee pills drop their cents the same way. Its program
picker collapses into the same self-summarising `<details>` — with one
addition the repo doesn't need: the repo's checkboxes are server-rendered
and only change on submit, while the artifact's are live, so it recomputes
the summary count on every `change` event. Both its tables swap to the same
cards below 768px, with the same "Sort by" pill row driving the same sort
state, and its own two-column valuations layout moved from 900px to 1100px
for the same reason the repo's moved to `xl` — at 900 the table column was
left under the table's 680px minimum. Its print stylesheet forces the table
back into view, so printing at a narrow paper width still gets the table
rather than the cards. It gets the same airliner
crossing the middle of the viewport as the repo's landing page, from the
same viewport-fixed `pointer-events-none` layer, so clicks still land on
the tabs and buttons underneath it. It also has
the same Saved Searches feature: a star button
next to the results header, a chip row above the search form for
quick-launching or removing a saved search, and the same
route+date+cabin dedup so re-saving refreshes an entry instead of
duplicating it. A chip click updates the form and results in place
(the artifact's usual single-page-app pattern) rather than a real
navigation, and localStorage entries are validated the same way as its
share-link and remembered-search params before use. It also has a 5th
"Compare" tab mirroring the repo's `/compare` page: the same
type-grouped currency picker, a shared points-balance input, and
ranked comparison cards with a "Best value" badge on the top pick —
kept as in-memory tab state rather than URL-synced, same distinction
as the nonstop filter.

## Languages and currencies

The navbar has two independent selectors:

- **Language** — English, Nederlands, Deutsch, Français, Español, Italiano, 日本語. Cookie-based
  (`src/lib/i18n/`), not route-prefixed (no `/en/`, `/nl/`): a `locale` cookie
  set by the switcher is read once per request in the root layout and handed
  down to every page. Before that cookie exists — a visitor's very first
  request — the server reads the browser's own `Accept-Language` header
  instead of defaulting straight to English, so someone whose browser is set
  to Dutch or Japanese sees their language immediately rather than having to
  find and use the switcher first. This translates UI chrome — navigation, forms, table
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
  across tabs. Its own accessible label is translated too, same as the
  language and theme selectors next to it (the artifact already had this
  right — the repo's copy had quietly stayed English-only). Before anything's
  saved, the starting currency also follows the detected language — EUR for
  the five eurozone UI languages, JPY for Japanese, USD otherwise — the same
  "infer, then let an explicit choice win" idea as the language default
  below, and known from the very first server-rendered byte since locale is
  already resolved by then, so there's no flash of the wrong currency.

A third selector, **Theme** (System/Light/Dark, `src/lib/theme-context.tsx`),
overrides the OS-level `prefers-color-scheme` default. A blocking inline
script in the root layout applies the stored choice before first paint, so
there's no flash of the wrong theme on load; while set to "System" it keeps
following live OS-level changes. The resolved theme also drives a
`<meta name="theme-color">` tag, so the mobile browser's own address/status
bar matches the page background instead of staying a fixed color regardless
of theme — mirrored in the artifact too, including live-following an OS
preference change while its own theme selector is set to "System".

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
engines do. The trail's own `aria-label` (naming it as the "breadcrumb"
landmark, distinct from the main nav) is translated too — mirrored in the
artifact.

Every page sets a self-referencing canonical URL, a page-specific description,
and Open Graph/Twitter Card previews (`summary_large_image`, matching the
generated share images above) instead of inheriting the homepage's. Every
page also declares `og:locale` for the visitor's current language and
`og:locale:alternate` for the other six — legitimate here even without
per-locale URLs (see "Languages and currencies" above for why this site is
cookie-based, not route-based): all seven language versions genuinely live
at the same URL, which is exactly what those two tags are for.
