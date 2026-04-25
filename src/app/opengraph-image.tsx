import { ImageResponse } from "next/og";
import {
  SITE_NAME,
  SITE_URL,
  AUTHOR_JOB_TITLE,
  AUTHOR_AFFILIATION,
  AUTHOR_KNOWS_ABOUT,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_ALT,
} from "@/lib/constants";

export const dynamic = "force-static";
export const alt = OG_IMAGE_ALT;
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const accent = "#2698ba";
  const background = "#0b0f14";
  const textPrimary = "#f5f5f5";
  const textSecondary = "#c0c8d2";
  const textMuted = "#7a8591";

  const interests = AUTHOR_KNOWS_ABOUT.slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${background} 0%, #111821 55%, #0b0f14 100%)`,
          display: "flex",
          flexDirection: "column",
          padding: 72,
          fontFamily: "sans-serif",
          color: textPrimary,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: accent,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: textMuted,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: accent,
              display: "flex",
            }}
          />
          <span style={{ display: "flex" }}>
            {SITE_URL.replace(/^https?:\/\//, "")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              color: textPrimary,
              display: "flex",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 30,
              color: accent,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {AUTHOR_JOB_TITLE}
          </div>
          <div
            style={{
              fontSize: 24,
              color: textSecondary,
              marginTop: 4,
              display: "flex",
            }}
          >
            {AUTHOR_AFFILIATION}
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {interests.map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 20px",
                borderRadius: 9999,
                border: `1px solid ${accent}`,
                color: accent,
                fontSize: 20,
                fontWeight: 500,
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
