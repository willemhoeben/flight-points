/**
 * How many seats the visitor needs on one award.
 *
 * Award space is per-seat and scarce — a route can show four programs with
 * one seat left each and none of them is bookable for a couple. Four is the
 * ceiling because the sample data never releases more than four on a single
 * flight, so offering five would only ever return nothing.
 */
export const PASSENGER_OPTIONS = [1, 2, 3, 4] as const;

export type Passengers = (typeof PASSENGER_OPTIONS)[number];

export const DEFAULT_PASSENGERS: Passengers = 1;

/** Parses ?pax=; anything outside the offered range means one seat. */
export function parsePassengers(value: string | null | undefined): Passengers {
  const n = Number(value);
  return (PASSENGER_OPTIONS as readonly number[]).includes(n) ? (n as Passengers) : DEFAULT_PASSENGERS;
}
