import { AIRPORTS, type Airport } from "@/data/airports";

export type Region =
  | "North America"
  | "Latin America"
  | "Europe"
  | "Middle East"
  | "Africa"
  | "Asia"
  | "Oceania";

export const REGION_ORDER: Region[] = [
  "North America",
  "Latin America",
  "Europe",
  "Middle East",
  "Africa",
  "Asia",
  "Oceania",
];

const REGION_BY_COUNTRY: Record<string, Region> = {
  "United States": "North America", Canada: "North America", Mexico: "North America",
  Panama: "Latin America", Brazil: "Latin America", Argentina: "Latin America",
  Chile: "Latin America", Colombia: "Latin America", Peru: "Latin America",
  Netherlands: "Europe", "United Kingdom": "Europe", France: "Europe", Germany: "Europe",
  Spain: "Europe", Italy: "Europe", Switzerland: "Europe", Austria: "Europe",
  Belgium: "Europe", Denmark: "Europe", Sweden: "Europe", Norway: "Europe",
  Finland: "Europe", Ireland: "Europe", Portugal: "Europe", Greece: "Europe",
  Poland: "Europe", Turkey: "Europe",
  "United Arab Emirates": "Middle East", Qatar: "Middle East", Israel: "Middle East",
  "South Africa": "Africa", Egypt: "Africa", Kenya: "Africa", Morocco: "Africa",
  Singapore: "Asia", Japan: "Asia", "South Korea": "Asia", "Hong Kong": "Asia",
  Thailand: "Asia", China: "Asia", Taiwan: "Asia", Malaysia: "Asia",
  Indonesia: "Asia", India: "Asia", Philippines: "Asia",
  Australia: "Oceania", "New Zealand": "Oceania",
};

export function regionOf(airport: Airport): Region {
  return REGION_BY_COUNTRY[airport.country] ?? "Europe";
}

export type NetworkShape = {
  /** The airline's own hubs, in the order a picker should offer them. */
  hubs: string[];
  /** Parts of the world the airline serves at all. */
  regions: Region[];
  /** The longest sector it actually operates, in kilometres. */
  maxKm: number;
};

const ALL: Region[] = [...REGION_ORDER];

/**
 * Where each program's own airline flies.
 *
 * A route is in the network when one end is a hub and the other sits in a
 * region the airline serves, within the range of the longest sector it
 * operates. Without the range every global program reached all 73 airports
 * and nine of them drew the same chart; with it, a LATAM network looks
 * nothing like a Finnair one, which is the entire point of showing it.
 */
export const NETWORKS: Record<string, NetworkShape> = {
  united: { hubs: ["EWR", "ORD", "IAH", "SFO", "DEN"], regions: ALL, maxKm: 15500 },
  aircanada: { hubs: ["YYZ", "YVR", "YUL"], regions: ALL, maxKm: 13500 },
  lufthansa: { hubs: ["FRA", "MUC", "ZRH", "VIE", "BRU"], regions: ALL, maxKm: 13000 },
  singapore: { hubs: ["SIN"], regions: ["Asia", "Oceania", "Europe", "North America", "Middle East", "Africa"], maxKm: 15500 },
  ana: { hubs: ["HND", "NRT"], regions: ["Asia", "Europe", "North America", "Oceania"], maxKm: 12000 },
  avianca: { hubs: ["BOG", "LIM"], regions: ["Latin America", "North America", "Europe"], maxKm: 10000 },
  turkish: { hubs: ["IST"], regions: ALL, maxKm: 13000 },
  sas: { hubs: ["CPH", "ARN", "OSL"], regions: ["Europe", "North America", "Asia"], maxKm: 9500 },
  tap: { hubs: ["LIS"], regions: ["Europe", "Latin America", "North America", "Africa"], maxKm: 10500 },
  eva: { hubs: ["TPE"], regions: ["Asia", "North America", "Europe", "Oceania"], maxKm: 12000 },
  copa: { hubs: ["PTY"], regions: ["Latin America", "North America"], maxKm: 7000 },
  american: { hubs: ["DFW", "MIA", "ORD", "JFK"], regions: ALL, maxKm: 13500 },
  britishairways: { hubs: ["LHR"], regions: ALL, maxKm: 14000 },
  cathay: { hubs: ["HKG"], regions: ["Asia", "Europe", "North America", "Oceania", "Middle East"], maxKm: 13500 },
  qatar: { hubs: ["DOH"], regions: ALL, maxKm: 14500 },
  qantas: { hubs: ["SYD", "MEL", "PER"], regions: ["Oceania", "Asia", "North America", "Europe"], maxKm: 15000 },
  iberia: { hubs: ["MAD", "BCN"], regions: ["Europe", "Latin America", "North America", "Africa"], maxKm: 11000 },
  finnair: { hubs: ["HEL"], regions: ["Europe", "Asia", "North America"], maxKm: 10000 },
  jal: { hubs: ["HND", "NRT", "KIX"], regions: ["Asia", "Europe", "North America", "Oceania"], maxKm: 12000 },
  delta: { hubs: ["ATL", "JFK", "LAX", "SEA"], regions: ALL, maxKm: 13500 },
  airfrance: { hubs: ["CDG", "AMS"], regions: ALL, maxKm: 13000 },
  koreanair: { hubs: ["ICN"], regions: ["Asia", "North America", "Europe", "Oceania"], maxKm: 12000 },
  chinaairlines: { hubs: ["TPE"], regions: ["Asia", "North America", "Europe", "Oceania"], maxKm: 12000 },
  aeromexico: { hubs: ["MEX"], regions: ["North America", "Latin America", "Europe", "Asia"], maxKm: 12000 },
  virginatlantic: { hubs: ["LHR"], regions: ["Europe", "North America", "Africa", "Asia", "Latin America"], maxKm: 12000 },
  alaska: { hubs: ["SEA", "LAX", "SFO"], regions: ["North America", "Latin America"], maxKm: 5000 },
  emirates: { hubs: ["DXB"], regions: ALL, maxKm: 14500 },
  etihad: { hubs: ["AUH"], regions: ALL, maxKm: 14000 },
  latam: { hubs: ["SCL", "GRU", "LIM", "BOG"], regions: ["Latin America", "North America", "Europe", "Oceania"], maxKm: 13500 },
  southwest: { hubs: ["DFW", "DEN", "ATL", "LAX"], regions: ["North America"], maxKm: 4500 },
};

export function hubsFor(programId: string): string[] {
  return NETWORKS[programId]?.hubs ?? [];
}

/** Every airport that is a hub for at least one program. */
export function allHubs(): string[] {
  const seen = new Set<string>();
  for (const net of Object.values(NETWORKS)) for (const h of net.hubs) seen.add(h);
  return AIRPORTS.filter((a) => seen.has(a.code)).map((a) => a.code);
}
