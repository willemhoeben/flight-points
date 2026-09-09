export type CurrencyType = "bank" | "airline" | "hotel";

export type PointCurrency = {
  id: string;
  name: string;
  issuer: string;
  type: CurrencyType;
  /** Estimated redemption value, in US cents per point. Illustrative, not live. */
  centsPerPoint: number;
  /** Month-over-month change in cents per point, for the trend arrow. */
  trend: "up" | "down" | "flat";
  notes: string;
};

// Illustrative valuations in the style TPG / flightpoints.com-type sites publish.
// These are static example figures, not a live feed.
export const VALUATIONS: PointCurrency[] = [
  { id: "chase-ur", name: "Chase Ultimate Rewards", issuer: "Chase", type: "bank", centsPerPoint: 2.05, trend: "flat", notes: "Best used transferred to Hyatt or United, not the portal." },
  { id: "amex-mr", name: "Amex Membership Rewards", issuer: "American Express", type: "bank", centsPerPoint: 2.0, trend: "up", notes: "Widest airline transfer chart; ANA and Air France sweet spots." },
  { id: "bilt", name: "Bilt Rewards", issuer: "Bilt", type: "bank", centsPerPoint: 2.0, trend: "flat", notes: "No annual fee, transfers to most of the same partners as Amex." },
  { id: "capital-one", name: "Capital One Miles", issuer: "Capital One", type: "bank", centsPerPoint: 1.85, trend: "up", notes: "Growing transfer chart, direct 1:1 cash redemption floor." },
  { id: "citi-typ", name: "Citi ThankYou Points", issuer: "Citi", type: "bank", centsPerPoint: 1.8, trend: "flat", notes: "Turkish Airlines transfers unlock strong Star Alliance business fares." },
  { id: "aeroplan", name: "Air Canada Aeroplan", issuer: "Air Canada", type: "airline", centsPerPoint: 1.7, trend: "up", notes: "No fuel surcharges on most partner redemptions." },
  { id: "hyatt", name: "World of Hyatt", issuer: "Hyatt", type: "hotel", centsPerPoint: 1.7, trend: "up", notes: "Category 1-4 free-night sweet spots are the best value in hotel points." },
  { id: "ba-avios", name: "British Airways Avios", issuer: "British Airways", type: "airline", centsPerPoint: 1.5, trend: "flat", notes: "Distance-based chart rewards short nonstop hops." },
  { id: "lifemiles", name: "Avianca LifeMiles", issuer: "Avianca", type: "airline", centsPerPoint: 1.5, trend: "down", notes: "Frequent buy-miles promos change the math often." },
  { id: "aadvantage", name: "American AAdvantage", issuer: "American Airlines", type: "airline", centsPerPoint: 1.4, trend: "down", notes: "Dynamic pricing has eroded most historical sweet spots." },
  { id: "flyingblue", name: "Air France-KLM Flying Blue", issuer: "Air France / KLM", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Monthly Promo Rewards can push this well above the base rate." },
  { id: "united-mp", name: "United MileagePlus", issuer: "United Airlines", type: "airline", centsPerPoint: 1.3, trend: "down", notes: "Excellent availability on United metal, weak partner redemptions." },
  { id: "southwest", name: "Southwest Rapid Rewards", issuer: "Southwest", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Revenue-based, so value is close to constant across fares." },
  { id: "skymiles", name: "Delta SkyMiles", issuer: "Delta Air Lines", type: "airline", centsPerPoint: 1.2, trend: "down", notes: "Fully dynamic pricing; value swings by route and season." },
  { id: "marriott", name: "Marriott Bonvoy", issuer: "Marriott", type: "hotel", centsPerPoint: 0.8, trend: "flat", notes: "Points needed per night are high; value depends on peak/off-peak." },
  { id: "hilton", name: "Hilton Honors", issuer: "Hilton", type: "hotel", centsPerPoint: 0.5, trend: "flat", notes: "Low per-point value offset by very large earning rates." },
];

export function findValuation(id: string): PointCurrency | undefined {
  return VALUATIONS.find((v) => v.id === id);
}
