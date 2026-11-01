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
          <svg width="56" height="56" viewBox="0 0 100 100">
            <rect x="12" y="62" width="20" height="26" rx="4" fill="#e8eef5" opacity="0.6" />
            <rect x="40" y="48" width="20" height="40" rx="4" fill="#e8eef5" opacity="0.8" />
            <rect x="68" y="34" width="20" height="54" rx="4" fill="#e8eef5" />
            <path d="M22 54 Q36 30 50 40 Q64 18 78 24" fill="none" stroke="#f2b54b" strokeWidth="4" strokeDasharray="0.1 9" strokeLinecap="round" />
            <circle cx="78" cy="20" r="9" fill="#f2b54b" />
          </svg>
          GrowDaily
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: title.length > 40 ? 64 : 80, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{title}</div>
          {subtitle && <div style={{ display: "flex", fontSize: 34, color: "#a9b8cc", lineHeight: 1.3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#8a9bb2" }}>
          <div style={{ width: 64, height: 8, borderRadius: 4, background: color }} />
          AI governance · growdaily.ai
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } },
  );
}
