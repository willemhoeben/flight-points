import { ImageResponse } from "next/og";
import { DEALS, findDeal, type DealCategory } from "@/data/deals";
import { SITE_NAME } from "@/lib/site";
import { BRAND_MARK_HOTEL, BRAND_MARK_PLANE, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const alt = `${SITE_NAME} deal`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return DEALS.map((d) => ({ slug: d.slug }));
}

const CATEGORY_LABEL: Record<DealCategory, string> = {
  "transfer-bonus": "Transfer bonus",
  "sweet-spot": "Sweet spot",
  sale: "Sale",
};
const CATEGORY_COLOR: Record<DealCategory, string> = {
  "transfer-bonus": "#059669",
  "sweet-spot": "#7c3aed",
  sale: "#d97706",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = findDeal(slug);
  const title = deal?.title ?? SITE_NAME;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#0071e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={34} height={34} viewBox={BRAND_MARK_VIEWBOX} fill="#ffffff">
              <path d={BRAND_MARK_HOTEL} fillRule="evenodd" />
              <path d={BRAND_MARK_PLANE} />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#1d1d1f" }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {deal && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 20px",
                borderRadius: 999,
                background: `${CATEGORY_COLOR[deal.category]}1a`,
                color: CATEGORY_COLOR[deal.category],
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {CATEGORY_LABEL[deal.category]}
              {deal.bonusPercent ? ` · +${deal.bonusPercent}%` : ""}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              color: "#1d1d1f",
              letterSpacing: -1,
              lineHeight: 1.2,
              maxHeight: 260,
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#6e6e73" }}>Award search + points valuations</div>
      </div>
    ),
    { ...size },
  );
}
