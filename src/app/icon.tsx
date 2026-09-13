import { ImageResponse } from "next/og";
import { BRAND_MARK_STAR, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0071e3",
          borderRadius: 7,
        }}
      >
        {/* No inset at favicon size: the mark's own 32x32 box already carries
            2 units of padding on each side, and a browser tab renders this
            at 16px, where any further shrinking costs real pixels. */}
        <svg width={32} height={32} viewBox={BRAND_MARK_VIEWBOX} fill="#ffffff">
          <path d={BRAND_MARK_STAR} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
