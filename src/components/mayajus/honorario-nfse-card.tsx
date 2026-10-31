"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, CheckCircle2, Loader, Receipt, Wallet } from "lucide-react";
import { MAYAJUS_ACCENT as A } from "@/content/mayajus";

type Fase = "recebido" | "emitindo" | "emitida";
const DURACAO: Record<Fase, number> = { recebido: 1900, emitindo: 1300, emitida: 3800 };
const PROXIMA: Record<Fase, Fase> = { recebido: "emitindo", emitindo: "emitida", emitida: "recebido" };

/** Honorário "Recebido" que vira "NFS-e emitida ✓", com o número da nota aparecendo. Em loop enquanto visível. */
export function HonorarioNfseCard({ compacto = false }: { compacto?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { margin: "-40px" });
  const reduzir = useReducedMotion();
  const [fase, setFase] = useState<Fase>("recebido");
  const [nota, setNota] = useState(184);

  useEffect(() => {
    if (reduzir) {
      setFase("emitida");
      return;
    }
    if (!visivel) return;
    const t = setTimeout(() => {
      if (fase === "emitida") setNota((n) => n + 1);
      setFase(PROXIMA[fase]);
    }, DURACAO[fase]);
    return () => clearTimeout(t);
  }, [fase, visivel, reduzir]);

  const numero = `2026/${String(nota).padStart(6, "0")}`;
  const emitida = fase === "emitida";

  return (
    <div
      ref={ref}
      className={`glass relative overflow-hidden rounded-2xl ${compacto ? "p-4" : "p-5"} shadow-2xl shadow-black/40 transition-colors duration-500`}
      style={emitida ? { borderColor: `${A}55` } : undefined}
      aria-label="Exemplo: honorário recebido que vira nota fiscal emitida"
      role="img"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: emitida ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ background: `radial-gradient(120% 80% at 100% 0%, ${A}26, transparent 60%)` }}
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-500"
            style={{ backgroundColor: emitida ? `${A}22` : "rgba(16,185,129,.14)", color: emitida ? A : "#34D399" }}
          >
            {emitida ? <Receipt className="h-5 w-5" aria-hidden /> : <Wallet className="h-5 w-5" aria-hidden />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs text-ink-muted">Contrato de honorários #0042</p>
            <p className="font-display text-lg font-semibold">R$ 3.500,00</p>
          </div>
        </div>

        <div className={`${compacto ? "mt-3" : "mt-4"} h-9`}>
          <AnimatePresence mode="wait" initial={false}>
            {fase === "recebido" && (
              <motion.span
                key="recebido"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-sm font-semibold text-emerald-300"
              >
                <Check className="h-4 w-4" aria-hidden /> Recebido
              </motion.span>
            )}
            {fase === "emitindo" && (
              <motion.span
                key="emitindo"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{ backgroundColor: `${A}1a`, color: A }}
              >
                <Loader className="h-4 w-4 animate-spin" aria-hidden /> Emitindo NFS-e…
              </motion.span>
            )}
            {emitida && (
              <motion.span
                key="emitida"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-[#0A0F1E]"
                style={{ background: `linear-gradient(135deg, ${A}, #FDE68A)` }}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden /> NFS-e emitida ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className={`${compacto ? "mt-2" : "mt-3"} flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3 text-xs`}>
          <span className="text-ink-muted">Nº da nota</span>
          <span className="font-mono font-semibold" style={{ color: emitida ? A : undefined }}>
            {emitida ? (
              <span key={numero} aria-hidden>
                {[...numero].map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.035 }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ) : (
              <span className="text-ink-muted/60">————/——————</span>
            )}
          </span>
        </div>
        {!compacto && (
          <p className="mt-2 text-[11px] text-ink-muted">
            {emitida ? "PDF e XML enviados ao cliente e ao contador." : "Aguardando emissão automática."}
          </p>
        )}
      </div>
    </div>
  );
}
