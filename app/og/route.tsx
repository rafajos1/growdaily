import { ImageResponse } from "next/og";

export const runtime = "edge";

const clip = (s: string | null, max: number) => (s ?? "").slice(0, max);

/** Social preview images (1200×630) in GrowDaily's dark "Pace" style. */
export function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const title = clip(params.get("title"), 80) || "GrowDaily";
  const subtitle = clip(params.get("subtitle"), 140);
  const color = /^#[0-9a-f]{6}$/i.test(params.get("color") ?? "") ? params.get("color")! : "#f2b54b";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0d1520", padding: "72px 80px", color: "#e8eef5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 800 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#f2b54b", boxShadow: "0 0 0 8px rgba(242,181,75,0.18)" }} />
          GrowDaily
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: title.length > 40 ? 64 : 80, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          {subtitle && <div style={{ display: "flex", fontSize: 34, color: "#a9b8cc", lineHeight: 1.3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#8a9bb2" }}>
          <div style={{ width: 64, height: 8, borderRadius: 4, background: color }} />
          Free apps · No sign-up · growdaily.ai
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } },
  );
}
