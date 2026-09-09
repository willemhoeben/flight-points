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
];

export function findDeal(slug: string): Deal | undefined {
  return DEALS.find((d) => d.slug === slug);
}
