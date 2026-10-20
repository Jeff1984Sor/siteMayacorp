import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export function renderOg({ titulo, subtitulo, accent = "#22D3EE" }: { titulo: string; subtitulo: string; accent?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0F1E",
          backgroundImage: `radial-gradient(circle at 85% 10%, ${accent}55, transparent 45%), radial-gradient(circle at 10% 100%, #6366F155, transparent 50%)`,
          color: "#F1F5F9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, display: "flex" }}>
            Maya<span style={{ color: "#A78BFA" }}>Corp</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>{titulo}</div>
          <div style={{ fontSize: 30, marginTop: 24, color: "#94A3B8", maxWidth: 1000, lineHeight: 1.35 }}>{subtitulo}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: accent }}>mayacorp.com.br</div>
      </div>
    ),
    OG_SIZE,
  );
}
