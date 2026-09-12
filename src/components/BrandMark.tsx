import { BRAND_MARK_HOTEL, BRAND_MARK_PLANE, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

/**
 * The mark on its own, inheriting colour from the surrounding text
 * (`currentColor`) so it works on the brand square in the navbar and on
 * a plain background alike. Decorative by default: every place it appears
 * sits next to the brand name in real text.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox={BRAND_MARK_VIEWBOX} className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={BRAND_MARK_HOTEL} fillRule="evenodd" />
      <path d={BRAND_MARK_PLANE} />
    </svg>
  );
}
