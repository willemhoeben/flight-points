import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

// Chrome's own PWA installability check requires at least a 192x192 icon
// in the manifest — icon.tsx's 32x32 favicon is too small to satisfy it
// and would render blurry on an Android home screen if reused there.
const ICON_SIZES: Record<string, { fontSize: number; letterSpacing: number; borderRadius: number }> = {
  "192": { fontSize: 88, letterSpacing: -5, borderRadius: 42 },
  "512": { fontSize: 235, letterSpacing: -13, borderRadius: 112 },
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
        <div
          style={{
            display: "flex",
            fontSize: config.fontSize,
            fontWeight: 800,
            letterSpacing: config.letterSpacing,
            color: "#ffffff",
          }}
        >
          FP
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
