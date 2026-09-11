import { ImageResponse } from "next/og";

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
        <div style={{ display: "flex", fontSize: 15, fontWeight: 800, letterSpacing: -1, color: "#ffffff" }}>FP</div>
      </div>
    ),
    { ...size },
  );
}
