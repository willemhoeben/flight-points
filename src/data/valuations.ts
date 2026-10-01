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
  { id: "singapore-kf", name: "Singapore KrisFlyer", issuer: "Singapore Airlines", type: "airline", centsPerPoint: 1.4, trend: "flat", notes: "Its own Suites and business class can only be booked through KrisFlyer." },
  { id: "ana-mc", name: "ANA Mileage Club", issuer: "ANA", type: "airline", centsPerPoint: 1.4, trend: "flat", notes: "Round-trip business class to Japan is among the sharpest pricing anywhere." },
  { id: "alaska-mp", name: "Alaska Mileage Plan", issuer: "Alaska Airlines", type: "airline", centsPerPoint: 1.4, trend: "down", notes: "Strong partner pricing, with a free stopover on a one-way." },
  { id: "qatar-avios", name: "Qatar Privilege Club Avios", issuer: "Qatar Airways", type: "airline", centsPerPoint: 1.4, trend: "up", notes: "Booking Qsuite often costs less here than through other Avios programmes." },
  { id: "flyingblue", name: "Air France-KLM Flying Blue", issuer: "Air France / KLM", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Monthly Promo Rewards can push this well above the base rate." },
  { id: "asia-miles", name: "Cathay Asia Miles", issuer: "Cathay Pacific", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Awards can be held up to a year ahead and changed later." },
  { id: "qantas-ff", name: "Qantas Frequent Flyer", issuer: "Qantas", type: "airline", centsPerPoint: 1.3, trend: "down", notes: "Good availability within Australia, heavy surcharges on long-haul." },
  { id: "virgin-fc", name: "Virgin Atlantic Flying Club", issuer: "Virgin Atlantic", type: "airline", centsPerPoint: 1.3, trend: "down", notes: "Known for sharp partner pricing, though the surcharges keep climbing." },
  { id: "united-mp", name: "United MileagePlus", issuer: "United Airlines", type: "airline", centsPerPoint: 1.3, trend: "down", notes: "Excellent availability on United metal, weak partner redemptions." },
  { id: "southwest", name: "Southwest Rapid Rewards", issuer: "Southwest", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Revenue-based, so value is close to constant across fares." },
  { id: "jal-mileage", name: "JAL Mileage Bank", issuer: "Japan Airlines", type: "airline", centsPerPoint: 1.5, trend: "flat", notes: "Partner awards are cheap and the chart is published, so you can plan against it." },
  { id: "skypass", name: "Korean Air SKYPASS", issuer: "Korean Air", type: "airline", centsPerPoint: 1.6, trend: "down", notes: "One of the last programs with a free stopover on a round trip." },
  { id: "iberia-avios", name: "Iberia Plus Avios", issuer: "Iberia", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Off-peak dates to Madrid cost noticeably less than the British Airways chart." },
  { id: "miles-smiles", name: "Turkish Miles&Smiles", issuer: "Turkish Airlines", type: "airline", centsPerPoint: 1.3, trend: "down", notes: "Transatlantic business class stays cheap, but award space is hard to find." },
  { id: "finnair-plus", name: "Finnair Plus", issuer: "Finnair", type: "airline", centsPerPoint: 1.2, trend: "flat", notes: "Short Nordic hops and the Helsinki-Asia routes are where the value sits." },
  { id: "eurobonus", name: "SAS EuroBonus", issuer: "SAS", type: "airline", centsPerPoint: 1.2, trend: "up", notes: "Now inside SkyTeam, so the partner chart looks very different than it used to." },
  { id: "infinity-mileagelands", name: "EVA Infinity MileageLands", issuer: "EVA Air", type: "airline", centsPerPoint: 1.2, trend: "flat", notes: "Taipei is the hub, and business class onward into Asia prices well." },
  { id: "connectmiles", name: "Copa ConnectMiles", issuer: "Copa Airlines", type: "airline", centsPerPoint: 1.2, trend: "flat", notes: "Strong across Latin America, weak almost everywhere else." },
  { id: "etihad-guest", name: "Etihad Guest", issuer: "Etihad Airways", type: "airline", centsPerPoint: 1.1, trend: "down", notes: "Partner awards can be sharp; its own flights carry heavy surcharges." },
  { id: "dynasty", name: "China Airlines Dynasty Flyer", issuer: "China Airlines", type: "airline", centsPerPoint: 1.1, trend: "flat", notes: "Useful mainly for Taipei and onward within Asia." },
  { id: "club-premier", name: "Aeroméxico Club Premier", issuer: "Aeroméxico", type: "airline", centsPerPoint: 1.1, trend: "flat", notes: "A rare way into SkyTeam partners from the Americas, with buyable points." },
  { id: "latam-pass", name: "LATAM Pass", issuer: "LATAM Airlines", type: "airline", centsPerPoint: 1.1, trend: "down", notes: "The way to book South America; almost nothing outside the region." },
  { id: "miles-go", name: "TAP Miles&Go", issuer: "TAP Air Portugal", type: "airline", centsPerPoint: 1.1, trend: "flat", notes: "Lisbon opens up as a cheap gateway between Europe and Brazil." },
  { id: "skymiles", name: "Delta SkyMiles", issuer: "Delta Air Lines", type: "airline", centsPerPoint: 1.2, trend: "down", notes: "Fully dynamic pricing; value swings by route and season." },
  { id: "miles-more", name: "Lufthansa Miles & More", issuer: "Lufthansa", type: "airline", centsPerPoint: 1.2, trend: "flat", notes: "Wide availability on Lufthansa itself, with steep fuel surcharges." },
  { id: "skywards", name: "Emirates Skywards", issuer: "Emirates", type: "airline", centsPerPoint: 1.2, trend: "down", notes: "First class on the A380 is the reason to save these points." },
  { id: "marriott", name: "Marriott Bonvoy", issuer: "Marriott", type: "hotel", centsPerPoint: 0.8, trend: "flat", notes: "Points needed per night are high; value depends on peak/off-peak." },
  { id: "hilton", name: "Hilton Honors", issuer: "Hilton", type: "hotel", centsPerPoint: 0.5, trend: "flat", notes: "Low per-point value offset by very large earning rates." },
  { id: "sheba-miles", name: "Ethiopian ShebaMiles", issuer: "Ethiopian Airlines", type: "airline", centsPerPoint: 1.0, trend: "flat", notes: "The only realistic way to pay for intra-Africa flying with points." },
  { id: "miles-bonus", name: "Aegean Miles+Bonus", issuer: "Aegean Airlines", type: "airline", centsPerPoint: 1.6, trend: "down", notes: "Star Alliance business to Europe for well under what partners charge." },
  { id: "royal-orchid", name: "Thai Royal Orchid Plus", issuer: "Thai Airways", type: "airline", centsPerPoint: 1.2, trend: "flat", notes: "Cheap short hops around Southeast Asia; long-haul is priced ordinarily." },
  { id: "enrich", name: "Malaysia Enrich", issuer: "Malaysia Airlines", type: "airline", centsPerPoint: 1.1, trend: "flat", notes: "Oneworld partner awards out of Kuala Lumpur, with modest surcharges." },
  { id: "safar-flyer", name: "Royal Air Maroc Safar Flyer", issuer: "Royal Air Maroc", type: "airline", centsPerPoint: 1.0, trend: "flat", notes: "Newest Oneworld member; useful for West Africa, thin everywhere else." },
  { id: "lotusmiles", name: "Vietnam Airlines Lotusmiles", issuer: "Vietnam Airlines", type: "airline", centsPerPoint: 1.1, trend: "up", notes: "Good value on its own metal, almost none on SkyTeam partners." },
  { id: "alfursan", name: "Saudia Alfursan", issuer: "Saudia", type: "airline", centsPerPoint: 1.0, trend: "flat", notes: "Worth holding only for Jeddah and Riyadh departures you were taking anyway." },
  { id: "hawaiianmiles", name: "Hawaiian HawaiianMiles", issuer: "Hawaiian Airlines", type: "airline", centsPerPoint: 1.2, trend: "up", notes: "Inter-island awards stay cheap; mainland pricing moves with the cash fare." },
  { id: "trueblue", name: "JetBlue TrueBlue", issuer: "JetBlue", type: "airline", centsPerPoint: 1.3, trend: "flat", notes: "Fixed to the cash fare, so it never surprises you in either direction." },
  { id: "saga-club", name: "Icelandair Saga Club", issuer: "Icelandair", type: "airline", centsPerPoint: 1.1, trend: "flat", notes: "A free Reykjavik stopover is the point; the award chart is unremarkable." },
];

export function findValuation(id: string): PointCurrency | undefined {
  return VALUATIONS.find((v) => v.id === id);
}
