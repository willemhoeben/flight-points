import { VALUATIONS } from "@/data/valuations";

/**
 * The top of the scale: the most valuable currency in the whole set, not in
 * whatever the filters left on screen.
 *
 * That distinction is the whole point. Scaled to the filtered view, every
 * filter would redraw every bar — pick "Hotel" and the best hotel currency
 * would run full width, which says it is the best thing here when it is
 * mid-table overall. A bar has to mean the same thing under every filter or
 * it is decoration that moves.
 */
export const MAX_CENTS_PER_POINT = Math.max(...VALUATIONS.map((v) => v.centsPerPoint));

/**
 * How much a point is worth, as a length.
 *
 * Forty-eight figures from 2.05¢ down to 0.50¢ read as a column of numbers:
 * you can see which row is top because the table is sorted, but not that the
 * best currency is worth four times the worst, or where the cliff between
 * bank points and airline miles falls. A length shows both at a glance, and
 * this site is an instrument for reading figures rather than a list of them.
 *
 * Zero-based, because cents per point is a ratio quantity: half the bar is
 * half the value, which is only true from a zero baseline.
 *
 * Square ends. The usual spec for a bar is a rounded data-end, but this
 * design zeroes Tailwind's entire radius scale on purpose — "every corner is
 * a right angle" is the house style, and a lone rounded tip in a square
 * design reads as a mistake rather than as polish.
 *
 * `aria-hidden` because it carries no information the row does not already
 * state in words: the figure sits beside it, and the table is the table
 * view. A screen reader gets the number, not a description of a rectangle.
 */
export function ValueBar({ centsPerPoint }: { centsPerPoint: number }) {
  const pct = Math.max(0, Math.min(1, centsPerPoint / MAX_CENTS_PER_POINT)) * 100;
  return (
    <div aria-hidden="true" className="value-bar mt-1.5 h-[5px] w-full bg-border">
      <div
        className="value-bar-fill h-full bg-route"
        // Inline width because the value is continuous — there is no Tailwind
        // class for 63.4%, and rounding to the nearest step would quietly
        // change the figure the bar claims to show.
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
