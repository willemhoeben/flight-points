/** Converts a points/miles balance to its estimated cash value in USD. */
export function pointsToUsd(points: number, centsPerPoint: number): number {
  return (points * centsPerPoint) / 100;
}

/** Inverse of pointsToUsd: how many points a target USD amount is worth. */
export function usdToPoints(amountUsd: number, centsPerPoint: number): number {
  if (centsPerPoint <= 0) return 0;
  return (amountUsd * 100) / centsPerPoint;
}
