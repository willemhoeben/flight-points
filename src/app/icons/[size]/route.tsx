import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { BRAND_MARK_HOTEL, BRAND_MARK_PLANE, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

// Chrome's own PWA installability check requires at least a 192x192 icon
// in the manifest — icon.tsx's 32x32 favicon is too small to satisfy it
// and would render blurry on an Android home screen if reused there.
const ICON_SIZES: Record<string, { mark: number; borderRadius: number }> = {
  "192": { mark: 140, borderRadius: 42 },
  "512": { mark: 374, borderRadius: 112 },
};

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size: sizeParam } = await params;
  const config = ICON_SIZES[sizeParam];
  if (!config) return new NextResponse("Not found", { status: 404 });

  const size = Number(sizeParam);
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
          borderRadius: config.borderRadius,
        }}
      >
        <svg width={config.mark} height={config.mark} viewBox={BRAND_MARK_VIEWBOX} fill="#ffffff">
          <path d={BRAND_MARK_HOTEL} fillRule="evenodd" />
          <path d={BRAND_MARK_PLANE} />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
