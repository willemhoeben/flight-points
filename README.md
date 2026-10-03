# Nightsky

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
- **`/search`** — search award availability by route, date, and cabin across 40
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
  imply two decimal places of precision. The 40-program picker is a
  collapsed `<details>` that summarises its own state ("All 40 programs",
  or "2 of 40 programs" when narrowed, in which case it opens on arrival):
  every box is ticked by default and most people never narrow it, so
  leaving it expanded pushed the calendar and the results themselves below
  the fold. It's a native element, so the form stays JS-free and the
  collapsed checkboxes still submit. Below `lg` the results render as
  cards rather than a table: the table needs 860px since the value column
  landed, which the content column only reaches at `lg`, so narrower
  screens used to see Program,
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

  A **Return** field sits next to the departure, and leaving it empty is
  what makes a trip one way — the control and the answer are the same thing,
  so there is no one-way/return mode to set first. Fill it in and the page
  prices the whole trip: 98,000 miles and $172 for New York to London and
  back on 29 October / 5 November, named by program, with a line saying so
  when that means two awards out of two balances. Each leg is priced
  independently rather than forced onto one program, because nothing stops
  you booking two one-way awards from two programs and points travellers do
  it constantly; insisting on a single program would quote a price above the
  one that is actually bookable.

  The two legs share one results table with a switch above it rather than
  stacking two tables. Two tables would mean two filter rows, two sorts and
  two empty states for one trip; this way every control keeps meaning exactly
  one thing. The cheapest-day calendar follows the switch too, so a cell
  moves the date of whichever leg you are looking at and leaves the other
  where it is, and the return leg's calendar opens no earlier than the
  departure — a day before the outbound is not a trip. A return date that
  lands before the departure, or that cannot be read at all, falls back to
  the one-way search and says which of the two happened; guessing a year or
  swapping the dates would book a trip nobody asked for. Saved searches keep
  the return date, so a one-way and a round trip on the same outbound are two
  entries rather than one overwriting the other.

  Under the results, **the gateways next door**, priced on the same day.
  Award space is released per airport rather than per city, so a New Yorker
  who only ever searches JFK never sees what Newark and LaGuardia let go that
  morning. Washington to Tokyo says National is 1,000 miles cheaper than
  Dulles and Narita 500 cheaper than Haneda, each a link into that search
  with the date, cabin, party and programs carried over. Each line names the
  airport it would send you to and how far that is from the one you searched,
  because on an origin swap both routes read "New York to London" and that
  says nothing about where you would actually be driving. Routes with nothing
  released stay on the list rather than disappearing from it: "Newark has
  nothing" is an answer, and a list that quietly drops what it checked cannot
  be trusted to have checked it. The threshold is 120km, deliberately tighter
  than the 250km floor that decides two airports are too close to fly between
  — at 250km that rule also pairs Vienna with Budapest and Seattle with
  Vancouver, which are not a second way out of the same city.

  A **Passengers** control (1–4) sits beside the cabin. Award space is sold
  per seat, so it filters rather than decorates: a JFK–LHR search that shows
  22 options for one traveller shows 15 for two and 4 for four, because a row
  with one seat left is not an option for a couple. The cheapest-day calendar
  takes the same floor — it is the one place that quotes a price for a day you
  have not opened yet, so without it the calendar would advertise a cheaper
  Tuesday the search then shows as empty. Prices stay per person, which is how
  award search reads everywhere and what keeps cents per point comparable
  between a search for one and a search for four, with a line under the result
  count saying so once you ask for more than one seat. The affordability
  verdict and the Within-reach filter use the party total instead, because
  "can I book this" means booking every seat: 80,000 Aeroplan covers one
  51,500-mile seat and falls 23,000 short of two. Saved searches still key on
  route, date, and cabin — the seat count is view state, like the sort and the
  filters beside it.

  Above the results a **points-or-cash verdict** says which way to pay, in
  one sentence, with the estimated cash fare beside it. Every row carries
  what each point actually buys on that redemption, and the column sorts
  like the others, so you can rank by value instead of by price. The badge
  beside each figure rates that row against the best option on screen rather
  than against the currency's lifetime average: every row prices the same
  seat, so an absolute scale put all twelve rows of a long-haul search in one
  band and said nothing about which to book. The absolute figure still has a
  vote — a redemption below what those points are normally worth can never
  come out on top, however well it compares to its neighbours.

- **`/explore`** — the question most people actually start with, which the
  search page cannot answer: not "what does New York to London cost" but
  "where can I go with what I have". Pick a departure airport, a cabin, and
  how many points you want to spend, and it scans every destination across
  the 14-day window and keeps the cheapest award it finds for each, cheapest
  first, with the day it found and what each point buys there. Sort by best
  value instead and you get a different trip entirely: from New York the
  cheapest is Washington at 22,500, the best value is Tokyo at 6.5 cents per
  point. Each card links into `/search` pre-filled with that route and that
  date, so "where can I go" flows into "show me the seats" without retyping
  anything. It's a plain GET form like the search page, so every set of
  destinations is server-rendered and shareable as a URL
  (`?origin=AMS&cabin=first&budget=200000&sort=value`).

  It knows how many of you are going, like the search does. The scan keeps
  the cheapest award with enough seats rather than the cheapest award, which
  moves the best day as well as the price: Amsterdam to London is cheapest on
  1 November for one traveller and on the 10th for three. The card's
  affordability verdict costs the party, and the link it opens carries the
  party through, so following it never widens the result back out to seats
  the card never promised.

  There is deliberately no graded value badge on these cards. Rated against
  the best destination on screen it painted every short-haul red; rated
  against each currency's own baseline it painted nineteen of twenty-four
  green. Either scale carried no information, because every card here prices
  a different seat rather than the same one — which is exactly the condition
  the results table's badge relies on. So the page shows the cents-per-point
  figure, lets the sort rank them, and marks the single best-value
  destination. One marker cannot be miscalibrated.

  Once a balance exists on `/wallet`, each card also carries the verdict the
  search results carry — you can cover this, reachable via a named transfer,
  this many miles short, or no route at all. Seventy-one destinations with a
  points figure on each used to leave you checking every number against a
  balance in your head, on the one page whose whole question is what your
  points can reach.

- **`/network`** — where a single airline can actually take you. Pick a
  loyalty program and one of its hubs and you get every destination that
  airline reaches, drawn on an azimuthal equidistant projection centred on
  that hub. That projection is the point of the page: it is the one where a
  straight line out of the middle really is the great circle the aircraft
  flies, so the angle of each spoke is the true initial bearing and the
  rings are true distances rather than decoration. Beside the chart the same
  destinations are grouped by region, nearest first, each one a link into a
  search for that route. Plain GET form (`?program=lufthansa&hub=FRA`), so
  one airline's map is a shareable URL.

  Three things the first version got wrong and this one doesn't. The plot
  scales to the longest route rather than to the next round ring above it,
  because rounding 15,335 km up to a 20,000 km ring left a quarter of the
  radius permanently empty. Every program carries its own longest-sector
  limit, because without one the nine global programs all drew the same
  chart — "flies everywhere" filtered nothing out. And airport codes are
  placed by reserving the rectangle each one will occupy, so a code is
  drawn only where it fits: the transatlantic bearings out of a US hub
  stack twenty destinations within a few degrees of one another, and a
  looser test left them overlapping into a blob. Measured across nine
  programs: zero overlapping labels, and every network fills its circle.

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
  same sideways scroll a phone did. Each currency's note is translated into
  all seven languages (`src/lib/i18n/valuation-notes.ts`) — the notes are
  data rather than UI copy, so nothing in the dictionaries reached them and
  the table used to switch language mid-row: a currency's name, type, value,
  and trend in your language, the sentence beside them in English. English
  stays in `src/data/valuations.ts` as the source for the original wording,
  so the translation map's key type excludes it. `test/valuation-notes.test.ts`
  pins the key sets against the real currency list in both directions, so a
  new currency can't ship one English line into six translated tables and a
  removed one can't leave orphaned strings behind.

  The deal articles are translated too (`src/lib/i18n/deal-text.ts`) — title,
  summary and every paragraph, in all six non-English languages. They used to
  be English-only with a line above them saying so, translated into six
  languages: the notice was localized and the article underneath it was not.
  `test/deal-text.test.ts` pins the key sets in both directions and fails a
  body that is the English left untouched, so a new deal cannot ship one
  English article into six translated ones.

- **`/wallet`** — the valuations page answers "what is one point worth";
  this one answers "what can the pile I am sitting on actually do". Type in
  what you hold across the forty-eight currencies and you get three
  figures: the cash value of the lot, how many currencies you hold, and how
  many of the forty airline programs you can genuinely put miles behind.
  Beside the form, one block per balance: the programs it spends on
  directly, and the programs it transfers into 1:1.

  Two decisions carry the page. The reach of a balance is the best SINGLE
  route, never the sum — no airline lets you pay one award out of two
  programs, so adding 30,000 held in MileagePlus to 40,000 transferable
  from Chase and calling it 70,000 would tell you an award is within reach
  when it is not. And a balance that reaches nothing at all, hotel points
  mostly, is named rather than dropped: it counts toward the total value,
  so leaving it out of the reach column without a word reads as a bug
  rather than an answer.

  Balances live in localStorage and nowhere else, which the page says
  directly above the inputs. Only 1:1 transfer partners are listed
  (`src/data/transfers.ts`); a 3:1 partner is a different kind of decision
  and showing it at the same weight would flatter it. Twenty-seven of the
  forty programs are reachable from one bank currency or another. The
  thirteen that are not — Miles & More, AAdvantage, SAS, Copa, JAL, Korean,
  China Airlines, LATAM, Ethiopian, Aegean, Royal Air Maroc, Saudia,
  Icelandair — stay unreachable, because they are. A chart that invented a
  transfer would send someone looking for a button that does not exist.

  Once a balance exists, it reaches the rest of the site. Every row on
  `/search` carries a verdict — you can cover this, reachable via a named
  transfer, this many miles short, or no route at all — and a "Within
  reach" filter pill collapses the table to what you could actually book
  (`?reach=1`, so a shared link lands on the same view, just an inert one
  for a visitor with no balances of their own). The verdict inherits the
  best-single-route rule, so two balances that each fall short never add up
  to "covered". On `/explore`, a "Use my balance" button fills the points
  budget from the largest single route rather than the sum, for the same
  reason. Everything here only appears when it has something to say: no
  pill you cannot use, no button that can only report its own
  uselessness — and, for anyone who has not found the wallet yet, one muted
  line on `/search` pointing at it, which disappears the moment a balance
  exists.

- **`/compare`** — pick two or more point currencies (bank/airline/hotel,
  grouped the same way as `/search`'s program picker) and a shared points
  balance to see which is worth more, ranked by cash value with the top
  pick badged "Best value". Selection and balance are reflected in the URL
  (`?currencies=chase-ur&currencies=hyatt&balance=100000`, balance omitted
  at its 60,000-point default) so a comparison is exactly as bookmarkable
  and shareable as a sorted `/valuations` table — same `router.replace`
  approach, same silent-drop handling for a stale/unknown currency id in a
  share link.
  It opens on the two bank currencies at the top of the table rather than on
  an empty shell with "select at least 2 currencies above" in it — the first
  thing anyone saw used to be work to do rather than what the tool does. A
  link carrying a selection still wins, and the default only stands until
  you touch the picker: unticking everything gives the prompt back rather
  than reinstating the two, which is what keying off the URL alone would
  have done, since the URL drops the parameter when nothing is selected.

- **`/deals`** — 12 sample transfer-bonus and award-chart sweet-spot writeups, filterable
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
logo is the name itself, set in the UI font with a four-point star standing
in for the dot on the "i" (`src/components/BrandWordmark.tsx`). The star
*replaces* the tittle rather than sitting on top of it, so the visible text
uses a dotless i (U+0131) — overlaying the star on a normal "i" leaves the
dot poking out from behind it at every size, which reads as a bug rather
than a logo. That trade is paid inside the component, not by the reader:
the visual half is `aria-hidden` and `select-none`, and a visually-hidden
sibling carries the real spelling, so the link's accessible name is
"Nightsky" and selecting the logo copies "Nightsky". A brand string with
no "i" falls back to plain text.

Square slots can't hold a wordmark, so the favicon, the iOS icon, and the
two manifest icons carry the initial instead. Both shapes live in
`src/lib/brand-mark.ts` as bare path data rather than inside a component,
because they have to render in two different worlds: React DOM for the
navbar and footer, and Satori for every generated image. Seven renderers,
one source of truth. The "N" is drawn rather than typed because Satori
ships a single font weight and silently ignores `fontWeight`, which
rendered the letter thin at exactly the sizes that need it to be
confident; Satori also places the star by absolute offset rather than by
centring, so that offset was measured off a real render rather than
guessed. `src/app/icon.tsx`, `apple-icon.tsx`, and
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
falls back to a default instead of rendering a raw, unrecognized code. Its deal
articles are translated the same way this repo's are, from the same copy.
It also mirrors the alliance-grouped
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
rather than the cards. Its topbar and footer carry the same wordmark,
dotless i and all, with the path copied from `lib/brand-mark.ts` — the one
place the single-source-of-truth rule can't reach, since the artifact is a
single file with no imports. It carries the same seven-language valuation notes
too, with the polarity flipped: Dutch is its base wording and lives in its
own data array, so its translation map holds the other six including
English, where the repo's holds the other six including Dutch. It gets the same airliner
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

## The look

The site is an instrument for reading routes, so its signature state is the
dark one. A near-black navy ground, amber for anything you act on, cyan for
the routes themselves. Light mode is the same instrument printed on paper
rather than a mechanical inversion: the amber darkens to stay legible on
white and the route cyan goes to a deep teal ink.

Archivo for everything read as language, IBM Plex Mono for everything read
as a measurement — codes, distances, miles, dates, cents per point. A route
is a place and a number, and the two should not look alike. Archivo is
variable on the width axis, which keeps a long German label on one line
where a fixed-width face would wrap it.

Every corner is a right angle. Tailwind's whole radius scale is zeroed in
the theme, so `rounded-xl` left on a component is a no-op rather than
something to hunt down file by file. Most blocks are hairline-ruled columns
rather than filled cards: a border, a fill and a shadow each mark a thing
as a separate object to pick up, and three ways into the site or four point
values are one set you read across, not four objects.

### A phone header that costs 6% of the screen, not 19%

Seven links laid out in the bar wanted three rows on a phone, and at three
rows each link was 16px tall — a thumb aiming at one hits the one above it,
which is the target-size failure WCAG 2.2 names. Padding them to a hittable
28px took the sticky header to 161px: a fifth of a 390×844 screen, held there
on every page and every scroll.

So the links go behind one button. The header is 49px at 320, 360, 390 and
430 across all seven languages, and the links get 44px rows inside the panel
— roomier than the bar ever allowed them to be. The panel overlays the page
rather than pushing it, so opening it does not slide the content out from
under the thumb that opened it, and it closes on Escape, on a tap outside,
and on navigation (a client-side route change would otherwise leave it
hanging open over the new page). Language and currency move in with it; the
theme toggle stays in the bar because it is the one people flip often.
Above 640px nothing changes — the links sit in the bar as before.

Measured after: zero axe violations with the panel open, zero target-size
findings across all nine pages at 390px.

### Contrast is measured, not eyeballed

Every colour pair in `src/app/globals.css` was computed rather than judged
by eye, and `test/palette-contrast.test.ts` recomputes them on every run so
a palette change cannot quietly drop one below the line:

| What | Requirement | Daylight | Night |
|---|---|---|---|
| Body, muted and accent text, on all three surfaces | AA 4.5 | 5.15–6.39 | 6.09–12.78 |
| Badge ink on its own tint, eight accents | AA 4.5 | 4.99–7.43 | 6.77–9.15 |
| Keyboard focus ring, on all three surfaces | WCAG 2.2, 3.0 | 5.24–6.39 | 9.78–11.26 |
| Button text on the brand fill | AA 4.5 | 8.15 | 11.00 |

Two of those came from real defects. The badges used to be Tailwind palette
steps over a 10%-alpha tint, so the background behind the text was whatever
surface the badge landed on — a table row on desktop, a card on a phone —
and three of them fell under AA on the phone layout when the palette
changed. A solid tint has exactly one background, so a ratio measured once
stays true wherever the badge goes. And the focus ring was the brand amber,
which is 1.87 against the daylight muted surface. axe does not check
focus-indicator contrast, so nothing caught it; the ring has its own token
now.

Printing is part of the palette, not an afterthought. A page picked up in
dark mode prints the full daylight palette on paper white, and
`test/print-palette.test.ts` fails the build if the print block misses a
single token the night palette overrides — a half-reverted palette puts
near-black badge tints on a white sheet.

### The front door shows what the site is

Every page here except the landing page showed it: a plot of routes at true
bearing and distance, a fourteen-day price calendar, a table of cents per
point. The landing page was a centred headline over six paragraphs of text
and could have been any product.

The hero is left-ranged now, with the plot beside it — real data, not an
illustration: the widest network in the set, drawn from its hub. Which one
that is comes out of the data (`widestNetwork()` in `src/lib/network.ts`)
rather than being written down, so adding airports or a programme re-picks
it instead of leaving the front door on a network that used to be the
widest. Today that is United from Denver, 104 destinations, computed once
per process rather than per request.

The compact mode drops the destination codes, the ring distances and the
compass letters. None of them is legible at 440px, and a circle of
unreadable three-letter codes reads as noise rather than as a drawing; the
shape is the argument there and `/network` carries the detail. The plot
itself is `src/components/NetworkPlot.tsx` now rather than 220 lines inside
the network page, which is what made it reusable at all.

Ranging the type left also gives the page a spine — a centred column has
nothing for the sections under it to hang off, which was part of why the
rest of the page read as a stack of unrelated slabs. Two more things that
were wrong there: the four headline figures were set in the text face,
while every other measurement on the site and the valuations figures six
inches below them were monospaced, so the same kind of number looked like
two different kinds of thing on one page; and every seam carried 48px of
padding on both sides, putting ~96px of nothing between each section and
the next. Figures are in the data face now, and the page is 94px shorter.

The ring labels on the plot also stopped colliding. They were spaced by a
ratio — drop any ring closer than 97% of the outer edge — but the rings are
round numbers and the edge is wherever the longest route happens to end, so
on United from Newark the 15,000 km ring lands ten kilometres inside a
15,474 km edge and both labels printed on top of each other. They are placed
outward-in now and measured against each other, the same way the destination
codes already were. Zero overlaps across eight hubs.

### Every control is big enough to hit

The phone header got the 44px treatment when it was built. Nothing else had.
Measuring every interactive element on nine pages at 390px found 426 under
the line: the sort and filter pills at 28px, the forty programme checkbox
labels at 20px, the six search fields at 39–42px, the theme, language and
currency selects at 24px, the hundred-plus network destination rows at 30px,
and the footer links at 14px text on a 20px pitch, which is a row of
mis-taps waiting to happen.

The pills turned out to be the same two class strings copied into eight
files, which is exactly how seven of them stayed small while one got fixed.
They are one `Pill` now (`src/components/ui.tsx`), and its `semantics` prop
decides whether it announces as *current* (one of a group, like a sort
column) or *pressed* (independently on or off, like a nonstop filter) —
getting that wrong is not cosmetic, it tells a screen-reader user that a
sort column is "pressed". The three chromeless selects shared a third copied
string; that is `BARE_SELECT`. The floor lives in those two constants, so
the next pill inherits it.

It applies at phone widths only. A cursor hits 28px perfectly well and the
compact row is the intended look once there is a pointer, so the height goes
up where the hand is, not everywhere. Two places took a layout decision
instead of padding: the footer's eight links go to two columns on a phone
(44px rows in one column would have cost 352px of footer; two columns cost
176px), and the card and section links trade margin for the height the floor
adds, so the optical spacing is unchanged.

Measured after: zero elements under 44px, counting the offscreen skip link,
the forty checkboxes behind 44px labels, and one inline link in prose as the
exemptions they are. No horizontal overflow and no clipped footer link
across all seven languages at 390, 768 and 1280.

### The nav says which page you are on

All seven links rendered identically on all nine pages. Cover the content
and the navigation could not tell you where you were, and a screen reader was
told nothing at all, because no link carried `aria-current`. The phone panel
had done this since it was built; the bar never did.

The current item now gets a rule under it *and* the full-strength text
colour, two signals rather than one, because colour alone is no signal to a
reader with a colour vision deficiency. It marks the **section**, so a deal
article marks Deals: exact-match would leave the nav blank on all twelve
deal pages, which is where the question is hardest, since a deal is usually
arrived at from a link rather than from the nav.

### One stylesheet rule was beating every utility

Three rules sat at the top level of `globals.css`: `*` setting
`border-color`, `body` setting background and font, and `h1, h2, h3` setting
weight and letter-spacing. Unlayered CSS outranks everything inside a
Tailwind layer, so each of them silently overrode the utilities on the
elements it matched. Nothing errored and nothing looked obviously broken,
which is why it lasted.

| Utility | Was | Is |
|---|---|---|
| `border-border-strong` (14 elements on the home page alone) | `#ccd5e6` | `#a9b6cf` |
| `border-brand` on the nav marker | `#ccd5e6` | `#e0a020` |
| `hover:border-brand` on the copy and save buttons | no change | grey → gold |
| `focus:border-focus` on every form field | no change | transparent → `#8a5200` |
| `tracking-[0.1em]` on the uppercase mono labels | −0.165px | +1.1px |
| `tracking-tight` on the home headline | −0.72px | −1.2px |

The uppercase labels are the visible one: the design asks for the widest
tracking on the site in exactly the place that was getting the narrowest.
They are inside `@layer base` now, so the defaults still apply to anything
that asks for nothing and a utility wins. `test/border-cascade.test.ts`
fails if a bare universal or element rule is ever added outside a layer.

### /valuations shows the spread, not just the ranking

Forty-eight currencies, from Chase Ultimate Rewards at 2.05¢ a point down to
0.50¢, set as a column of plain numbers. Sorted, so the top row was findable.
But the page never showed that the best currency is worth four times the
worst, or where the cliff between bank points and airline miles falls, and
that is the shape of the answer people come here for.

Each row now carries a length under its figure.

The scale is the **whole dataset**, never the filtered view. That is the only
part of this with a wrong answer available: scaled to what the filters left
on screen, choosing Hotel would run World of Hyatt to full width and claim it
is the best thing here when it is mid-table overall. Scaled to the set, Hyatt
reads 82.9% under the Hotel filter, the same length it has with no filter at
all. A bar has to mean the same thing under every filter or it is decoration
that moves. All 48 lengths were checked against cents ÷ 2.05 and against
their own rendered geometry; both agree to within a pixel.

Zero-based, because cents per point is a ratio quantity — half the bar has to
be half the value. Square ends, because this design zeroes Tailwind's radius
scale on purpose and a lone rounded tip reads as a mistake rather than as
polish. `aria-hidden`, because the figure it encodes sits beside it in words.
The track is a background, so print and forced-colors mode both get an
explicit fallback rather than an empty gap where a bar should be.

The column widths are the part worth writing down, because the first attempt
optimised the wrong number. Pinning the value column wide enough for a longer
bar meant capping the notes column to pay for it, which was justified by
counting currency names that wrapped onto a second line. That metric is
worthless here: every row on this page is as tall as its note, and notes run
four to six lines, so a wrapped name costs nothing. Measured properly — rows
that got taller because of a wrapped name — the answer is 0, in every locale,
under every geometry tried.

What the widths did cost was height:

| Geometry | Table height, Dutch | Table height, French |
|---|---|---|
| No bar at all | 3619px | 3911px |
| Bar, columns left alone | 3619px | 3911px |
| Bar, value column 100px + notes capped at 250px | 3911px | 4415px |

The bar is free if the columns are left alone and costs half a screen of
scrolling if they are not. A figure whose whole argument is "read the spread
at a glance" should not lengthen the page it is explaining, so the columns
are untouched and the bar is 58px instead of 68px. Ample for 48 values
spanning four to one.

### /search puts the answer first

You searched, and what came back was the form you had just filled in. On a
1280×800 laptop the first result sat 288px below the fold; on a phone it was
546px down. Four things stood between the question and the answer, and none
of them was the answer:

| Above the first result | Was | Is |
|---|---|---|
| Page heading and lede | 148px, "Find award availability" | the route itself |
| The search form | 292px of selects and date pickers | a 44px **Edit search** button |
| The 14-day cheapest-day calendar | 236px, before the results | below them |
| The result filters (phone) | 292px of wrapping pills | a 44px fold |
| **First result** | **y=1088 laptop, y=1390 phone** | **y=488, y=718** |

Each of those is the same judgement applied four times. **The form has done
its job the moment a search exists**, so it folds; and because any arrival at
a result counts — the form, a shared link, a saved search, a calendar cell —
the test is whether the URL carries a search, not whether you used the form.
A bare `/search` still opens with the fields, because nobody has searched
there and the form is the page.

**The heading of a results page is the search.** A generic sentence set at
44px over somebody's JFK → LHR results, while the route it produced sat at
14px below it, meant the biggest type on the page said the least. The route
takes the `h1` now, with the terms and the result count under it and the save
and share buttons beside it — one statement, where a screen reader and a
search engine both look for it. That also settles what the folded form should
say: with the heading stating the search in full, a summary line under it
would be the third copy of one sentence, so the control is a verb.

**The calendar answers a different question.** "Could I do better on another
day" is what you ask after seeing what this day costs. It sits below the
table now, next to the nearby-airport gateways, which answer the same kind of
follow-up.

Both folds are native `<details>`, so the page needs no JavaScript to operate
them, and fields inside a closed one still submit. The filter fold opens by
itself whenever a filter is on and carries the count — "Filter results · 2
on" — so nothing you chose can hide behind a summary. Above `lg` the pills
render inline as before; that is two renderings rather than one wrapper that
changes behaviour by width, because a closed `<details>` cannot be forced
open with CSS in any way that holds across browsers.

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
All 38 currencies there are reachable from the search: every program in
`src/data/programs.ts` maps to one in `src/lib/program-currency.ts`, and a
test fails the build if a new program arrives without a valuation to judge
its redemptions against.

### The numbers are mock, but they are no longer arbitrary

Award prices, flight times and cash fares all follow the real distance
flown (`src/lib/distance.ts`). Before that they did not, and the results
were quietly nonsense: a business seat to Newark priced like a business
seat to Tokyo, Amsterdam to London took eight hours, and a 1,700 km hop
could arrive with two connections inside six hours. None of it showed
while you looked at one route at a time; all of it was obvious the moment
`/explore` put a list of destinations side by side.

The award multiplier is sublinear the way a published chart is — three
times the distance costs well under three times the miles — and lands
within a few thousand miles of the Aeroplan and KrisFlyer charts on both
the Atlantic and the Pacific. Cash fares are modelled as one-way fares,
which is what the search prices, and premium one-ways are punished far
harder than round-trips. That is the whole reason a long-haul business
award beats a business ticket and a short-haul economy award does not, and
it is what makes the points-or-cash verdict on `/search` come out
differently for Amsterdam to Frankfurt than for New York to Sydney.

Two airports in the same metro area are not a route anyone redeems for, so
JFK to EWR and HND to NRT return no award space at all rather than an
invented price. The same floor keeps a hub out of its own network map.

A program only prices a route its alliance actually reaches. Every program
used to appear on every route, which was fine while the list was thirty
mostly-global airlines and obviously wrong the moment regional ones joined
it: Southwest pricing Addis Ababa to London, Icelandair pricing Sydney to
Auckland. A program now prices a route when its own airline reaches both
ends, or when anyone in its alliance does — which is most of what makes a
mileage currency worth holding, since Aegean flies no further than the
Middle East and Aegean miles still book a Star Alliance seat across the
Pacific. An unaligned program sells only its own flying. Regions decide it
rather than the longest sector each airline operates: an award itinerary
connects, and gating the whole route on sector length put New York to
Sydney at zero programs.

The route data covers 107 airports across 61 countries and 40 loyalty
programs. Thirteen metros have more than one gateway — the three New York
fields, Heathrow and Gatwick, O'Hare and Midway, Dulles and National and
BWI, Haneda and Narita, Incheon and Gimpo, and the rest — which is what
makes the nearby-airport suggestions on `/search` worth reading. City and
country names are translated into all six non-English locales
(`src/lib/i18n/place-names.ts`), with a test that fails if an airport
arrives without them — a silent fall back to English on one city in a list
of a hundred is exactly the kind of gap nobody notices by eye.

## What the site sends, and what it refuses

The site has no accounts, no database and no outbound requests, so most of
the usual hardening has nothing to protect. These are the parts that still
earn their place on a page that renders editorial copy and reads query
parameters.

**A real script policy, not a decorative one.** `src/middleware.ts` mints a
128-bit nonce per request and puts the CSP on both the request and the
response: the response header is what the browser enforces, the request
header is where Next finds the nonce for the script tags it writes itself.
The pre-paint theme script is ours, so the layout stamps that one by hand,
and `'strict-dynamic'` covers the route chunks the bootstrap injects.

A nonce normally costs static rendering, which is why most content sites
settle for `script-src 'self' 'unsafe-inline'` and permit precisely the
injection a CSP is for. It costs nothing here: every page reads the locale
cookie, so `next build` already emits exactly one prerendered HTML file.
Styles keep `'unsafe-inline'` — a style nonce does not cover the `style=`
attributes React writes, which needs `'unsafe-hashes'`, and an injected
style can deface but cannot run code.

Verified rather than asserted: a parser-inserted inline script planted into
the response is refused with the policy on and runs with the policy
stripped, across all nine pages plus the 404 and a populated search, with
hydration confirmed live each time by driving the theme select and watching
the class and `localStorage` change. `test/csp.test.ts` pins the shape,
including the mistake this nearly shipped as — omitting `script-src` does
not leave scripts unconstrained, it inherits `default-src` and blocks every
inline script on the site.

**JSON-LD is escaped, because `JSON.stringify` does not escape `</script>`.**
A deal title of `</script><script>…` closes the tag and the browser runs what
follows. Verified by planting one and watching it execute before
`src/lib/json-ld.ts` existed, then confirming the same payload inert after.
Nothing on this site takes structured data from a visitor, so there is no
attacker path through it today; the reason to escape anyway is that the deal
articles are editorial copy in seven languages, and "our own content can't be
hostile" is the assumption that ships this class of bug.

**A deal URL that does not exist answers 404.** It used to answer 200. A
visitor running JavaScript saw the right not-found page, so nothing looked
wrong, but a crawler was told every invented URL under `/deals/` was a real
page and a visitor without JavaScript sat on a loading skeleton that never
resolved. The cause was a `loading.tsx` above the route: it wraps the subtree
in a Suspense boundary, and once that shell has flushed React cannot abort
it, so `notFound()` degrades to a client-side fallback. Both deals skeletons
are gone — these pages render from a compiled-in array with no I/O and answer
in about 30ms, so the skeleton was never on screen long enough to be seen.
`test/not-found-status.test.ts` fails if one is ever put back above a route
that calls `notFound()`.

**The HTML is compressed.** It was not. Measured over the wire against
`next start`:

| Page | Before | After | Saved |
|---|---|---|---|
| `/explore` | 410,010 | 33,781 | 92% |
| `/network` | 261,629 | 30,406 | 88% |
| `/search` | 227,521 | 29,762 | 87% |
| `/valuations` | 143,325 | 22,969 | 84% |
| `/deals` | 78,330 | 16,066 | 79% |
| `/` | 70,391 | 15,507 | 78% |

Explore is both the heaviest page and the one most likely to be opened on a
phone, since it is the one that answers "where can I go with the points I
have". A CDN in front of this would compress anyway, and most deployments
have one; that is a reason to keep `compress: true` in the repo, not a
reason to rely on something outside it for the single largest saving.

**Four fixed headers**, in `next.config.ts` so they also cover the paths
middleware skips: `X-Content-Type-Options: nosniff`, a referrer policy,
`X-Frame-Options: DENY` as belt and braces with the CSP's `frame-ancestors`,
and a `Permissions-Policy` turning off camera, microphone, geolocation,
payment and USB, none of which the page asks for. `poweredByHeader` is off:
advertising the framework and its version only helps someone matching the
site against a CVE list. The locale cookie is marked `Secure` on https and
not on plain http, so it still sets during local development.

## The name

The site was called "Flight Points" until it was renamed to Nightsky:
"nights" for hotel points, "sky" for airline miles, which is both halves
rather than just the flying one. `SITE_NAME` in `src/lib/site.ts` is the
single definition, so page titles, the RSS channel, the manifest, the
JSON-LD organisation, and both Open Graph images all follow from one line;
the navbar's brand string is the only separate copy, once per locale.

Two things kept the old name on purpose:

- **The `flight-points:` localStorage prefix.** Those keys are internal
  identifiers no visitor ever sees, and renaming them would silently
  discard every existing visitor's saved deals, saved searches, calculator
  inputs, theme, currency, and last search. The prefix is cosmetic; the
  data is not. There's a note in `site.ts` so nobody tidies them later.
- **The `flightpoints.com` mention in the disclaimer.** That's a different,
  real site this demo cites as inspiration. It reads less confusingly now
  than it did while this project shared its name.

The GitHub repository is still `flight-points` — renaming it would break
every existing clone's remote, and it costs nothing to leave alone.

## Development

```bash
bun install
bun run dev        # start the dev server on http://localhost:3000
bun run build      # production build
bun run check      # lint + typecheck + tests, which is what CI runs
bun run lint       # eslint
bun run typecheck  # tsc --noEmit
bun run test       # bun:test — date/format/currency/prng/sort helpers, data integrity, the mock availability engine
```

`bun run check` is the one to run before pushing. It takes a few seconds and
is the same sequence `.github/workflows/ci.yml` runs on every push and pull
request, in the order that fails fastest.

Several of those tests are invariant tripwires rather than unit tests, and
they only earn their keep if something runs them without being asked: the
palette contrast ratios, the print palette's token coverage, the stylesheet
layer cascade, the CSP's shape, and the rule that no `loading.tsx` may sit
above a route that calls `notFound()`. Each one exists because the thing it
guards broke once without anything going red.

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
