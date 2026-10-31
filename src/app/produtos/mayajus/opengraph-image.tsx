import { ImageResponse } from "next/og";
import { MAYAJUS_ACCENT as A, MAYAJUS_HERO } from "@/content/mayajus";
import { PLANOS } from "@/content/mayajus-planos";
import { OG_SIZE } from "@/lib/og";
import { formatarBRL, mensalEquivalente } from "@/lib/mayajus-preco";

export const alt = "MayaJus — o sistema jurídico que fatura o honorário e emite a nota sozinho";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const aPartirDe = formatarBRL(Math.min(...PLANOS.map((p) => mensalEquivalente(p, "anual"))));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: "#0A0F1E",
          backgroundImage: `radial-gradient(circle at 90% 0%, ${A}55, transparent 45%), radial-gradient(circle at 0% 100%, #6366F144, transparent 50%)`,
          color: "#F1F5F9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${A}, #F59E0B)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0A0F1E",
                fontSize: 36,
                fontWeight: 800,
              }}
            >
              §
            </div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
              Maya<span style={{ color: A }}>Jus</span>
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${A}, #FDE68A)`,
                color: "#0A0F1E",
                fontSize: 18,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Lançamento do ano
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 800, lineHeight: 1.1 }}>{MAYAJUS_HERO.titulo}</div>
          <div style={{ display: "flex", fontSize: 26, color: "#94A3B8" }}>
            Processos, prazos, financeiro e NFS-e · a partir de {aPartirDe}/mês
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 330,
              padding: 28,
              borderRadius: 24,
              background: "#0F172A",
              border: `2px solid ${A}88`,
              boxShadow: `0 30px 80px ${A}33`,
            }}
          >
            <div style={{ display: "flex", fontSize: 18, color: "#94A3B8" }}>Contrato de honorários</div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800, marginTop: 6 }}>R$ 3.500,00</div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                padding: "10px 18px",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${A}, #FDE68A)`,
                color: "#0A0F1E",
                fontSize: 24,
                fontWeight: 800,
                alignItems: "center",
                alignSelf: "flex-start",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A0F1E" strokeWidth="3.2" style={{ marginRight: 10 }}>
                <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              NFS-e emitida
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: 18, color: "#94A3B8" }}>
              <span>Nº da nota</span>
              <span style={{ color: A, fontWeight: 700 }}>2026/000184</span>
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
