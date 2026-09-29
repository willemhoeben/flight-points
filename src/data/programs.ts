export type Alliance = "Star Alliance" | "Oneworld" | "SkyTeam" | "Unaligned";

export type Program = {
  id: string;
  name: string;
  airline: string;
  alliance: Alliance;
  /** Tailwind color token used for badges/chips */
  accent: "sky" | "violet" | "amber" | "rose" | "emerald" | "cyan" | "fuchsia";
};

export const PROGRAMS: Program[] = [
  { id: "united", name: "United MileagePlus", airline: "United Airlines", alliance: "Star Alliance", accent: "sky" },
  { id: "aircanada", name: "Air Canada Aeroplan", airline: "Air Canada", alliance: "Star Alliance", accent: "rose" },
  { id: "lufthansa", name: "Lufthansa Miles & More", airline: "Lufthansa", alliance: "Star Alliance", accent: "amber" },
  { id: "singapore", name: "Singapore KrisFlyer", airline: "Singapore Airlines", alliance: "Star Alliance", accent: "cyan" },
  { id: "ana", name: "ANA Mileage Club", airline: "All Nippon Airways", alliance: "Star Alliance", accent: "sky" },
  { id: "american", name: "American AAdvantage", airline: "American Airlines", alliance: "Oneworld", accent: "rose" },
  { id: "britishairways", name: "British Airways Avios", airline: "British Airways", alliance: "Oneworld", accent: "violet" },
  { id: "cathay", name: "Cathay Asia Miles", airline: "Cathay Pacific", alliance: "Oneworld", accent: "emerald" },
  { id: "qatar", name: "Qatar Privilege Club", airline: "Qatar Airways", alliance: "Oneworld", accent: "fuchsia" },
  { id: "qantas", name: "Qantas Frequent Flyer", airline: "Qantas", alliance: "Oneworld", accent: "rose" },
  { id: "delta", name: "Delta SkyMiles", airline: "Delta Air Lines", alliance: "SkyTeam", accent: "rose" },
  { id: "airfrance", name: "Air France-KLM Flying Blue", airline: "Air France / KLM", alliance: "SkyTeam", accent: "sky" },
  { id: "virginatlantic", name: "Virgin Atlantic Flying Club", airline: "Virgin Atlantic", alliance: "Unaligned", accent: "fuchsia" },
  { id: "alaska", name: "Alaska Mileage Plan", airline: "Alaska Airlines", alliance: "Unaligned", accent: "cyan" },
  { id: "emirates", name: "Emirates Skywards", airline: "Emirates", alliance: "Unaligned", accent: "amber" },
  { id: "avianca", name: "Avianca LifeMiles", airline: "Avianca", alliance: "Star Alliance", accent: "emerald" },
  { id: "turkish", name: "Turkish Miles&Smiles", airline: "Turkish Airlines", alliance: "Star Alliance", accent: "sky" },
  { id: "sas", name: "SAS EuroBonus", airline: "SAS", alliance: "Star Alliance", accent: "violet" },
  { id: "tap", name: "TAP Miles&Go", airline: "TAP Air Portugal", alliance: "Star Alliance", accent: "amber" },
  { id: "eva", name: "EVA Infinity MileageLands", airline: "EVA Air", alliance: "Star Alliance", accent: "rose" },
  { id: "copa", name: "Copa ConnectMiles", airline: "Copa Airlines", alliance: "Star Alliance", accent: "emerald" },
  { id: "iberia", name: "Iberia Plus", airline: "Iberia", alliance: "Oneworld", accent: "cyan" },
  { id: "finnair", name: "Finnair Plus", airline: "Finnair", alliance: "Oneworld", accent: "fuchsia" },
  { id: "jal", name: "JAL Mileage Bank", airline: "Japan Airlines", alliance: "Oneworld", accent: "sky" },
  { id: "koreanair", name: "Korean Air SKYPASS", airline: "Korean Air", alliance: "SkyTeam", accent: "violet" },
  { id: "chinaairlines", name: "China Airlines Dynasty Flyer", airline: "China Airlines", alliance: "SkyTeam", accent: "amber" },
  { id: "aeromexico", name: "Aeroméxico Club Premier", airline: "Aeroméxico", alliance: "SkyTeam", accent: "rose" },
  { id: "etihad", name: "Etihad Guest", airline: "Etihad Airways", alliance: "Unaligned", accent: "emerald" },
  { id: "latam", name: "LATAM Pass", airline: "LATAM Airlines", alliance: "Unaligned", accent: "cyan" },
  { id: "southwest", name: "Southwest Rapid Rewards", airline: "Southwest Airlines", alliance: "Unaligned", accent: "fuchsia" },
];

export function findProgram(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
