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
];

export function findProgram(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}
