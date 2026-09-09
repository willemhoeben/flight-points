# Flight Points

An award flight search and points-valuation demo, inspired by [seats.aero](https://seats.aero/)
and [flightpoints.com](https://flightpoints.com/). Not affiliated with either site or any
airline or loyalty program.

## What's here

- **`/search`** — search award availability by route, date, and cabin across 16
  loyalty programs, with a 14-day calendar view highlighting the cheapest day to fly.
- **`/valuations`** — a table of estimated cents-per-point values for major bank,
  airline, and hotel currencies, plus an interactive calculator.
- **`/deals`** — sample transfer-bonus and award-chart sweet-spot writeups.

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
bun run test     # bun:test — date/format helpers + the mock availability engine
```

Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

`/robots.txt` and `/sitemap.xml` are generated from `src/app/robots.ts` /
`src/app/sitemap.ts` and point at `NEXT_PUBLIC_SITE_URL` if set, otherwise
Vercel's own `VERCEL_URL` at deploy time, otherwise `localhost:3000`. Set
`NEXT_PUBLIC_SITE_URL` once you're on a custom domain.
