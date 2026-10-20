"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle, MessageCircle, Receipt } from "lucide-react";

const barras = [38, 52, 44, 66, 58, 74, 86];

/** Mockup ilustrativo de dashboard, feito só com código (sem imagens de terceiros). */
export function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl" role="img" aria-label="Ilustração de um painel de software com gráficos e automações">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-primary-violet/20 to-accent/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
        aria-hidden
      >
        <div className="flex items-center gap-1.5 border-b border-white/[0.08] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 h-4 w-40 rounded bg-white/5" />
        </div>

        <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[120px_1fr]">
          <div className="space-y-2 border-r border-white/[0.06] p-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-6 rounded-md ${i === 0 ? "bg-primary/30" : "bg-white/[0.04]"}`} />
            ))}
          </div>

          <div className="space-y-4 p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { c: "from-primary/40", w: "w-10" },
                { c: "from-accent/40", w: "w-8" },
                { c: "from-success/40", w: "w-12" },
              ].map((k, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  <div className="h-2 w-10 rounded bg-white/10" />
                  <div className={`mt-2 h-4 ${k.w} rounded bg-gradient-to-r ${k.c} to-transparent`} />
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <svg viewBox="0 0 300 110" className="h-28 w-full">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6366F1" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="linha" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#6366F1" />
                    <stop offset="0.6" stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <path d="M0 90 C40 80 60 60 100 62 S160 40 200 38 S260 18 300 12 L300 110 L0 110 Z" fill="url(#area)" />
                <motion.path
                  d="M0 90 C40 80 60 60 100 62 S160 40 200 38 S260 18 300 12"
                  fill="none"
                  stroke="url(#linha)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }}
                />
              </svg>
            </div>

            <div className="flex h-20 items-end gap-2">
              {barras.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-primary/50 to-primary-violet/70"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -left-2 top-1/3 sm:-left-10"
        aria-hidden
      >
        <div className="glass flex animate-float items-center gap-2.5 rounded-xl bg-base/80 px-3 py-2.5 shadow-xl">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-success/15 text-success">
            <MessageCircle className="h-4 w-4" />
          </span>
          <span className="text-xs">
            <span className="block font-semibold text-ink">Agendamento confirmado</span>
            <span className="text-ink-muted">via WhatsApp · agora</span>
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -right-2 -top-4 sm:-right-8"
        aria-hidden
      >
        <div className="glass flex animate-float-slow items-center gap-2.5 rounded-xl bg-base/80 px-3 py-2.5 shadow-xl">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary">
            <Bot className="h-4 w-4" />
          </span>
          <span className="text-xs">
            <span className="block font-semibold text-ink">Agente de IA</span>
            <span className="text-ink-muted">post criado e revisado</span>
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute -bottom-6 right-6"
        aria-hidden
      >
        <div className="glass flex animate-float items-center gap-2.5 rounded-xl bg-base/80 px-3 py-2.5 shadow-xl [animation-delay:1.5s]">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
            <Receipt className="h-4 w-4" />
          </span>
          <span className="text-xs">
            <span className="flex items-center gap-1 font-semibold text-ink">
              Lote de notas emitido <CheckCircle className="h-3.5 w-3.5 text-success" />
            </span>
            <span className="text-ink-muted">automação fiscal</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
