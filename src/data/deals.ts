export type DealCategory = "transfer-bonus" | "sweet-spot" | "sale";

export type Deal = {
  slug: string;
  title: string;
  summary: string;
  category: DealCategory;
  /**
   * Display name of the program this deal is about. A plain label rather
   * than a PROGRAMS lookup key — deals can reference hotel programs (e.g.
   * Hyatt) that aren't part of the flight-search PROGRAMS list.
   */
  program: string;
  bonusPercent?: number;
  expires?: string;
  publishedAt: string;
  body: string[];
};

// Example editorial content in the style of a points-and-miles deals blog.
// Static/mock — not pulled from a live promotions feed.
export const DEALS: Deal[] = [
  {
    slug: "amex-mr-to-ana-30-bonus",
    title: "Amex Membership Rewards → ANA: 30% transfer bonus",
    summary: "A rare bump on one of the best business-class sweet spots to Asia.",
    category: "transfer-bonus",
    program: "ANA Mileage Club",
    bonusPercent: 30,
    expires: "2026-10-15",
    publishedAt: "2026-09-01",
    body: [
      "American Express is offering a 30% bonus when you transfer Membership Rewards points to ANA Mileage Club, through October 15.",
      "ANA's distance-based chart still prices US–Japan business class well below most competing programs, and this bonus pushes the effective transfer ratio past 1.3 points per Amex point.",
      "The catch: ANA's own award search only shows partner space a few weeks out for most routes, so this is best used for last-minute trips or paired with a calendar view once space opens up.",
    ],
  },
  {
    slug: "hyatt-category-1-4-sweet-spot",
    title: "The World of Hyatt category 1-4 sweet spot, explained",
    summary: "Why sub-15,000-point free nights are still the best redemption in hotel points.",
    category: "sweet-spot",
    program: "World of Hyatt",
    publishedAt: "2026-08-22",
    body: [
      "World of Hyatt's award chart tops out at 8 categories, and categories 1 through 4 (as low as 3,500 points a night at some properties) consistently cash out above 2 cents per point.",
      "Unlike most hotel programs, Hyatt has not moved to dynamic pricing, so the chart is predictable and easy to plan around months in advance.",
      "Pair a Chase Ultimate Rewards transfer with a category 1-4 property and a $150 hotel stay can cost well under 10,000 points.",
    ],
  },
  {
    slug: "citi-turkish-airlines-25-bonus",
    title: "Citi ThankYou Points → Turkish Airlines: 25% bonus",
    summary: "Turkish Airlines' Star Alliance chart is one of the cheapest ways into business class.",
    category: "transfer-bonus",
    program: "Avianca LifeMiles",
    bonusPercent: 25,
    expires: "2026-09-30",
    publishedAt: "2026-09-03",
    body: [
      "Citi is running a 25% transfer bonus to several airline partners this month, and Turkish-style partner charts remain some of the least expensive ways to book Star Alliance business class.",
      "Because these charts price by distance rather than by carrier, a US–Europe business class seat can come in well under what the operating airline's own program would charge for the same flight.",
      "As always with third-party partner charts: award space, not price, is the constraint. Check a calendar view across a wide date range rather than a single day.",
    ],
  },
  {
    slug: "capital-one-portal-vs-transfer",
    title: "When the Capital One travel portal beats a transfer",
    summary: "Cash-back-style redemption sometimes wins over routing through an airline chart.",
    category: "sweet-spot",
    program: "United MileagePlus",
    publishedAt: "2026-08-10",
    body: [
      "Capital One miles redeem at a flat 1 cent per point against any travel purchase, which puts a floor under their value that transferable-only currencies don't have.",
      "On routes where partner award space is scarce or where a cash fare is unusually cheap, redeeming at the flat rate can beat hunting for a transfer-partner award seat.",
      "The rule of thumb: if the best award you can find prices out under 1 cent per point of value, take the cash-back-style redemption instead.",
    ],
  },
  {
    slug: "flying-blue-promo-rewards",
    title: "Flying Blue Promo Rewards: check the calendar before you transfer",
    summary: "Monthly discounted awards can cut the miles needed by up to 50%.",
    category: "sale",
    program: "Air France-KLM Flying Blue",
    expires: "2026-09-30",
    publishedAt: "2026-09-05",
    body: [
      "Air France-KLM's Flying Blue publishes a rotating list of discounted 'Promo Rewards' routes every month, sometimes cutting the miles price by half versus the standard chart.",
      "Because the list changes monthly and by cabin, it's worth checking the calendar view for your route before transferring points in from a bank program.",
      "Business class Promo Rewards routes are the best value on the list; economy discounts are usually smaller in absolute terms.",
    ],
  },
  {
    slug: "avios-short-haul-distance-chart",
    title: "Avios distance-based pricing rewards short nonstop hops",
    summary: "Sub-650-mile flights can price under 10,000 Avios one-way.",
    category: "sweet-spot",
    program: "British Airways Avios",
    publishedAt: "2026-07-28",
    body: [
      "British Airways prices Avios redemptions by distance rather than by cabin-and-route zone, which means very short nonstop flights are disproportionately cheap.",
      "A one-way economy redemption under 650 miles can price at well under 10,000 Avios plus modest carrier charges, often cheaper than a cash fare on the same route.",
      "This works best on point-to-point hops rather than connecting itineraries, since each additional segment adds its own distance-based charge.",
    ],
  },
  {
    slug: "amex-mr-to-marriott-bonus",
    title: "Amex Membership Rewards → Marriott Bonvoy: 20% transfer bonus",
    summary: "Marriott's high point requirements make transfer bonuses matter more than usual.",
    category: "transfer-bonus",
    program: "Marriott Bonvoy",
    bonusPercent: 20,
    expires: "2026-09-25",
    publishedAt: "2026-09-06",
    body: [
      "American Express is running a 20% bonus on Membership Rewards transfers to Marriott Bonvoy through September 25, the first bump on this pairing in several months.",
      "Marriott's category-based chart requires far more points per night than competing hotel programs, so a redemption only clears 1 cent per point at the higher categories — the transfer bonus is what pushes many stays into decent value territory.",
      "Best used for a specific booked stay rather than speculative points hoarding: check the cash rate first, and only transfer if the bonus-adjusted points price beats it.",
    ],
  },
  {
    slug: "alaska-mileage-plan-oneworld-sweet-spot",
    title: "Alaska Mileage Plan's Oneworld sweet spot is still open",
    summary: "One of the last mileage charts that hasn't gone dynamic on partner awards.",
    category: "sweet-spot",
    program: "Alaska Mileage Plan",
    publishedAt: "2026-08-30",
    body: [
      "Alaska Mileage Plan left the Oneworld alliance's partner benefits in place even after most US programs moved to dynamic pricing, and its published partner chart still holds for Cathay Pacific, Qatar Airways, and Japan Airlines award space.",
      "A business-class redemption to North Asia can price several thousand miles below what the operating carrier's own program would charge for the identical seat.",
      "The chart rewards booking early: partner award space is released far in advance and dries up close to departure, so this is not a last-minute strategy.",
    ],
  },
  {
    slug: "ethiopian-shebamiles-intra-africa",
    title: "ShebaMiles is the only sane way to pay for intra-Africa flying",
    summary: "Addis Ababa reaches more of the continent than anywhere else, and nobody else prices it in points.",
    category: "sweet-spot",
    program: "Ethiopian ShebaMiles",
    publishedAt: "2026-09-09",
    body: [
      "Flying between two African cities usually means cash, and expensive cash: thin competition on most of these routes keeps one-way fares higher than a transatlantic ticket bought the same week.",
      "Ethiopian flies more of the continent than any other airline, nearly all of it through Addis Ababa, and ShebaMiles prices those sectors on a short regional band rather than scaling them to what the cash fare happens to be. Lagos, Nairobi, Accra and Johannesburg all land in the same low band from Addis.",
      "The catch is getting the miles in the first place. No bank transfers into ShebaMiles at 1:1, so this is a program you earn into by flying or by crediting Star Alliance partners to it, which makes it worth setting up before the trip you want rather than during it.",
    ],
  },
  {
    slug: "hawaiian-inter-island-awards",
    title: "Inter-island awards are the last fixed price in Hawaii",
    summary: "Honolulu to the neighbour islands still costs the same number of points whatever the cash fare does.",
    category: "sweet-spot",
    program: "Hawaiian HawaiianMiles",
    publishedAt: "2026-09-11",
    body: [
      "Hawaiian prices its mainland routes off the cash fare now, which means a summer Saturday to Honolulu costs what a summer Saturday costs. The inter-island hops did not follow.",
      "Honolulu to Kahului, Kona or Lihue sits at a flat award price regardless of date, and in the weeks when cash fares between the islands spike, that flat price is the whole point. A family of four moving islands mid-trip is where it pays for itself.",
      "HawaiianMiles transfer in 1:1 from Amex Membership Rewards and from Bilt, so the balance is easy to top up. Book the island hop on points and put the cash toward the part of the trip that is not fixed.",
    ],
  },
  {
    slug: "citi-typ-to-thai-20-bonus",
    title: "Citi ThankYou → Thai: 20% transfer bonus",
    summary: "Short Southeast Asian hops are already cheap on Royal Orchid Plus; this makes them cheaper.",
    category: "transfer-bonus",
    program: "Thai Royal Orchid Plus",
    bonusPercent: 20,
    expires: "2026-10-31",
    publishedAt: "2026-09-13",
    body: [
      "Citi is adding 20% when you move ThankYou points to Thai Royal Orchid Plus, through the end of October.",
      "Royal Orchid Plus is unremarkable on long-haul and genuinely good on everything inside Southeast Asia: Bangkok to Singapore, Kuala Lumpur, Hanoi or Ho Chi Minh City prices on a short regional band, and 20% on top takes the effective rate past 1.2 miles per ThankYou point.",
      "Treat it as a way to pay for the connecting legs of a trip you are already taking rather than as the trip itself. Transfers are not reversible, so move only what a specific booking needs.",
    ],
  },
  {
    slug: "icelandair-saga-stopover",
    title: "The free Reykjavik stopover is still the reason to hold Saga points",
    summary: "The award chart is ordinary. Stopping in Iceland for a week on the way is not.",
    category: "sweet-spot",
    program: "Icelandair Saga Club",
    publishedAt: "2026-09-15",
    body: [
      "Icelandair's award pricing between Europe and North America is unremarkable, and on its own it would not be worth a paragraph.",
      "What makes it worth holding is the stopover. Keflavik sits roughly halfway, and Icelandair lets you stop there for up to a week on a transatlantic award at no extra points cost, which turns one redemption into two trips. Nobody else on that ocean offers the same thing for free.",
      "Saga Club takes no 1:1 bank transfer, so the points come from flying or from the co-branded card. Worth planning around if Iceland was ever going to be on the list anyway, not worth chasing if it was not.",
    ],
  },
];

export function findDeal(slug: string): Deal | undefined {
  return DEALS.find((d) => d.slug === slug);
}
