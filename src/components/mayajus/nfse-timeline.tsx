"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Landmark, Mail, ScrollText, Send, Wallet } from "lucide-react";
import { MAYAJUS_ACCENT as A, MAYAJUS_NFSE_PASSOS as PASSOS } from "@/content/mayajus";

const ICONES = [ScrollText, Wallet, Landmark, Send];
const INTERVALO = 2800;

function Campo({ k, v, mostrar, destaque }: { k: string; v: string; mostrar: boolean; destaque?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-white/[0.08] py-2 text-xs sm:text-sm">
      <span className="text-ink-muted">{k}</span>
      <AnimatePresence mode="wait" initial={false}>
        {mostrar ? (
          <motion.span
            key="v"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`text-right font-medium ${destaque ? "font-mono" : ""}`}
            style={destaque ? { color: A } : undefined}
          >
            {v}
          </motion.span>
        ) : (
          <motion.span key="vazio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-2 w-20 rounded bg-white/[0.06]" />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Linha do tempo "Contrato → Recebimento → NFS-e → Envio", com a nota sendo montada ao lado. */
export function NfseTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { margin: "-120px" });
  const reduzir = useReducedMotion();
  const [ativo, setAtivo] = useState(0);
  const [pausadoAte, setPausadoAte] = useState(0);

  useEffect(() => {
    if (!visivel || reduzir) return;
    const base = ativo === PASSOS.length - 1 ? INTERVALO * 1.6 : INTERVALO;
    // depois de um clique, espera o usuário ler antes de seguir sozinho
    const espera = Math.max(base, pausadoAte - Date.now());
    const t = setTimeout(() => setAtivo((a) => (a + 1) % PASSOS.length), espera);
    return () => clearTimeout(t);
  }, [ativo, visivel, reduzir, pausadoAte]);

  const escolher = (i: number) => {
    setAtivo(i);
    setPausadoAte(Date.now() + 12000);
  };

  const progresso = ativo / (PASSOS.length - 1);

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
      {/* Passos */}
      <div className="relative">
        <div className="absolute bottom-10 left-[40px] top-10 w-px bg-white/10 sm:left-[44px]" aria-hidden>
          <motion.div
            className="w-full origin-top"
            style={{ background: `linear-gradient(${A}, #FDE68A)`, height: "100%" }}
            animate={{ scaleY: progresso }}
            transition={{ duration: reduzir ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <ol className="relative space-y-3" aria-label="Como a nota fiscal é emitida">
        {PASSOS.map((p, i) => {
          const Icon = ICONES[i];
          const feito = i < ativo;
          const atual = i === ativo;
          return (
            <li key={p.titulo} className="relative">
              <button
                type="button"
                onClick={() => escolher(i)}
                aria-current={atual ? "step" : undefined}
                className={`flex w-full items-start gap-4 rounded-2xl border p-3 text-left transition duration-300 sm:p-4 ${
                  atual ? "bg-white/[0.05]" : "border-transparent hover:bg-white/[0.03]"
                }`}
                style={atual ? { borderColor: `${A}55`, boxShadow: `0 0 40px -18px ${A}` } : undefined}
              >
                <motion.span
                  className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border"
                  animate={{
                    backgroundColor: atual || feito ? `${A}${atual ? "26" : "14"}` : "rgba(15,23,42,1)",
                    borderColor: atual || feito ? `${A}80` : "rgba(255,255,255,0.1)",
                    color: atual || feito ? A : "#94A3B8",
                    scale: atual && !reduzir ? 1.06 : 1,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {feito ? <Check className="h-6 w-6" aria-hidden /> : <Icon className="h-6 w-6" aria-hidden />}
                  {atual && !reduzir && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl border"
                      style={{ borderColor: A }}
                      initial={{ opacity: 0.7, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.35 }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      aria-hidden
                    />
                  )}
                </motion.span>
                <span className="min-w-0 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: atual || feito ? A : "#94A3B8" }}>
                    Passo {i + 1}
                  </span>
                  <span className="mt-0.5 block font-display text-lg font-semibold text-ink sm:text-xl">{p.titulo}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{p.texto}</span>
                </span>
              </button>
            </li>
          );
        })}
        </ol>
      </div>

      {/* Nota sendo montada */}
      <div className="relative" aria-hidden>
        <div className="absolute -inset-6 -z-10 rounded-[2rem] opacity-40 blur-3xl" style={{ background: `radial-gradient(circle, ${A}44, transparent 70%)` }} />
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-base-alt/90 p-5 shadow-2xl shadow-black/50 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Nota Fiscal de Serviço eletrônica</p>
              <p className="mt-1 font-display text-xl font-semibold">NFS-e</p>
            </div>
            <span className="rounded-lg bg-white/[0.05] px-2 py-1 text-[11px] text-ink-muted">Prefeitura do seu município</span>
          </div>

          <div className="mt-4">
            <Campo k="Tomador" v="Cliente do contrato #0042" mostrar />
            <Campo k="Serviço" v="Honorários advocatícios" mostrar />
            <Campo k="Valor" v="R$ 3.500,00" mostrar={ativo >= 1} />
            <Campo k="Recebido em" v="05/11/2026" mostrar={ativo >= 1} />
            <Campo k="Número" v="2026/000184" mostrar={ativo >= 2} destaque />
            <Campo k="Enviada para" v="cliente + contador" mostrar={ativo >= 3} />
          </div>

          <div className="mt-5 flex h-11 items-center">
            <AnimatePresence mode="wait" initial={false}>
              {ativo < 2 ? (
                <motion.p key="aguardando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-ink-muted">
                  {ativo === 0 ? "Aguardando recebimento…" : "Gerando a nota na prefeitura…"}
                </motion.p>
              ) : ativo === 2 ? (
                <motion.span
                  key="emitida"
                  initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
                  animate={{ opacity: 1, scale: 1, rotate: -6 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="inline-flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 font-display text-sm font-bold uppercase tracking-widest"
                  style={{ borderColor: A, color: A }}
                >
                  <Check className="h-4 w-4" /> Emitida
                </motion.span>
              ) : (
                <motion.div key="enviada" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2">
                  {["cliente", "contador"].map((d, i) => (
                    <motion.span
                      key={d}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.2 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                    >
                      <Mail className="h-3.5 w-3.5" /> PDF + XML para o {d}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
