/**
 * Which airline programs each bank currency transfers into, and at what
 * ratio. Illustrative sample figures in the style of published transfer
 * charts, like everything else here — always check the bank's own page
 * before you move points, because a ratio can change overnight and a
 * transfer cannot be reversed.
 *
 * Only 1:1 partners are listed. A 3:1 or 5:2 partner is a different kind of
 * decision (you are usually better off not making it), and showing it at
 * the same weight as a 1:1 would flatter it.
 */
export const TRANSFERS: Record<string, Record<string, number>> = {
  "chase-ur": {
    united: 1, britishairways: 1, airfrance: 1, aircanada: 1, virginatlantic: 1,
    singapore: 1, emirates: 1, iberia: 1, southwest: 1,
  },
  "amex-mr": {
    ana: 1, airfrance: 1, britishairways: 1, aircanada: 1, delta: 1,
    virginatlantic: 1, cathay: 1, qantas: 1, singapore: 1, emirates: 1,
    avianca: 1, iberia: 1, etihad: 1, aeromexico: 1, hawaiian: 1, jetblue: 1,
  },
  bilt: {
    aircanada: 1, airfrance: 1, britishairways: 1, cathay: 1, emirates: 1,
    virginatlantic: 1, united: 1, turkish: 1, alaska: 1, avianca: 1, iberia: 1,
    hawaiian: 1,
  },
  "capital-one": {
    airfrance: 1, aircanada: 1, britishairways: 1, cathay: 1, singapore: 1,
    qantas: 1, emirates: 1, virginatlantic: 1, avianca: 1, etihad: 1,
    tap: 1, finnair: 1, eva: 1, aeromexico: 1, malaysia: 1, vietnam: 1,
  },
  "citi-typ": {
    singapore: 1, airfrance: 1, cathay: 1, qatar: 1, emirates: 1,
    virginatlantic: 1, qantas: 1, avianca: 1, turkish: 1, eva: 1,
    etihad: 1, aeromexico: 1, thai: 1, malaysia: 1, jetblue: 1,
  },
};

/** The bank currencies that transfer anywhere, in the order they are listed. */
export const TRANSFER_SOURCES = Object.keys(TRANSFERS);

/** Every program `currencyId` can reach by transfer. */
export function transferTargets(currencyId: string): string[] {
  return Object.keys(TRANSFERS[currencyId] ?? {});
}
