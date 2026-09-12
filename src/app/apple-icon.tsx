import { ImageResponse } from "next/og";
import { BRAND_MARK_HOTEL, BRAND_MARK_PLANE, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        {/* iOS rounds and crops the corners itself, so the mark is inset to
            keep the plane's nose and the hotel's base clear of the mask. */}
        <svg width={132} height={132} viewBox={BRAND_MARK_VIEWBOX} fill="#ffffff">
          <path d={BRAND_MARK_HOTEL} fillRule="evenodd" />
          <path d={BRAND_MARK_PLANE} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
