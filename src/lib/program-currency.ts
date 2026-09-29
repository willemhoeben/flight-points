import { VALUATIONS } from "@/data/valuations";

/**
 * Which point currency each searchable loyalty program spends.
 *
 * Search results are priced in a program's own miles, but "is this a good
 * redemption" can only be answered against what that currency is normally
 * worth — so every program in PROGRAMS needs an entry here, and the
 * data-integrity test fails the build if one is missing.
 */
export const PROGRAM_CURRENCY: Record<string, string> = {
  united: "united-mp",
  aircanada: "aeroplan",
  lufthansa: "miles-more",
  singapore: "singapore-kf",
  ana: "ana-mc",
  american: "aadvantage",
  britishairways: "ba-avios",
  cathay: "asia-miles",
  qatar: "qatar-avios",
  qantas: "qantas-ff",
  delta: "skymiles",
  airfrance: "flyingblue",
  virginatlantic: "virgin-fc",
  alaska: "alaska-mp",
  emirates: "skywards",
  avianca: "lifemiles",
  turkish: "miles-smiles",
  sas: "eurobonus",
  tap: "miles-go",
  eva: "infinity-mileagelands",
  copa: "connectmiles",
  iberia: "iberia-avios",
  finnair: "finnair-plus",
  jal: "jal-mileage",
  koreanair: "skypass",
  chinaairlines: "dynasty",
  aeromexico: "club-premier",
  etihad: "etihad-guest",
  latam: "latam-pass",
  southwest: "southwest",
};

/** What a point in this program is normally worth, in US cents. */
export function baselineCentsPerPoint(programId: string): number | null {
  const currencyId = PROGRAM_CURRENCY[programId];
  if (!currencyId) return null;
  return VALUATIONS.find((v) => v.id === currencyId)?.centsPerPoint ?? null;
}
