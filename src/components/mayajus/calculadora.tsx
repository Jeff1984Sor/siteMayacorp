"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lightbulb, Receipt, Users } from "lucide-react";
import { contratarHref } from "@/components/mayajus/planos";
import { MAYAJUS_ACCENT as A } from "@/content/mayajus";
import type { Ciclo } from "@/content/mayajus-planos";
import { formatarBRL, recomendarPlano } from "@/lib/mayajus-preco";

function Slider({
  label,
  icon: Icon,
  valor,
  min,
  max,
  step,
  onChange,
  formatar,
}: {
  label: string;
  icon: typeof Users;
  valor: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatar: (v: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4" style={{ color: A }} aria-hidden /> {label}
        </label>
        <output htmlFor={id} className="font-display text-2xl font-semibold tabular-nums">
          {formatar(valor)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={formatar(valor)}
        className="range-gold mt-3 w-full cursor-pointer"
      />
      <div className="mt-1 flex justify-between text-[11px] text-ink-muted">
        <span>{formatar(min)}</span>
        <span>{formatar(max)}</span>
      </div>
    </div>
  );
}

export function Calculadora({ ciclo }: { ciclo: Ciclo }) {
  const [usuarios, setUsuarios] = useState(3);
  const [notas, setNotas] = useState(60);

  const r = useMemo(() => recomendarPlano({ usuarios, notas, ciclo }), [usuarios, notas, ciclo]);
  const maior = Math.max(...r.custos.map((x) => x.total));
  const rec = r.recomendado;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="space-y-8">
          <Slider
            label="Usuários no escritório"
            icon={Users}
            valor={usuarios}
            min={1}
            max={60}
            step={1}
            onChange={setUsuarios}
            formatar={(v) => String(v)}
          />
          <Slider
            label="Notas fiscais por mês"
            icon={Receipt}
            valor={notas}
            min={0}
            max={2000}
            step={10}
            onChange={setNotas}
            formatar={(v) => v.toLocaleString("pt-BR")}
          />
        </div>

        <div className="mt-8 space-y-2.5" aria-label="Custo mensal de cada plano para esse uso">
          {r.custos.map((x) => {
            const eRec = x.plano.id === rec.plano.id;
            return (
              <div key={x.plano.id} className="grid grid-cols-[84px_1fr_auto] items-center gap-3 text-sm">
                <span className={eRec ? "font-semibold text-ink" : "text-ink-muted"}>{x.plano.nome}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className="block h-full rounded-full"
                    animate={{ width: `${Math.max(6, (x.total / maior) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    style={{ background: eRec ? `linear-gradient(90deg, ${A}, #FDE68A)` : "rgba(148,163,184,.35)" }}
                  />
                </span>
                <span className={`tabular-nums ${eRec ? "font-semibold" : "text-ink-muted"}`} style={eRec ? { color: A } : undefined}>
                  {formatarBRL(x.total)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border bg-base-alt p-6 sm:p-8"
        style={{ borderColor: `${A}66` }}
        aria-live="polite"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-[80px]" style={{ background: A }} aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">O seu plano é</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={rec.plano.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
            <p className="mt-2 font-display text-4xl font-bold" style={{ color: A }}>
              {rec.plano.nome}
            </p>
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-semibold tabular-nums">{formatarBRL(rec.total)}</span>
          <span className="text-sm text-ink-muted">/mês{ciclo === "anual" ? ", no anual" : ""}</span>
        </p>

        <dl className="mt-6 space-y-2 border-t border-white/[0.08] pt-5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">Plano {rec.plano.nome}</dt>
            <dd className="tabular-nums">{formatarBRL(rec.base)}</dd>
          </div>
          {rec.usuariosAdicionais > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">{rec.usuariosAdicionais} usuário(s) adicional(is)</dt>
              <dd className="tabular-nums">{formatarBRL(rec.valorUsuarios)}</dd>
            </div>
          )}
          {rec.notasExcedentes > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">{rec.notasExcedentes.toLocaleString("pt-BR")} notas excedentes</dt>
              <dd className="tabular-nums">{formatarBRL(rec.valorNotas)}</dd>
            </div>
          )}
          {rec.plano.notasIncluidas === null && (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Notas fiscais</dt>
              <dd className="text-shimmer font-semibold">Ilimitadas</dd>
            </div>
          )}
        </dl>

        <AnimatePresence initial={false}>
          {r.virada && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <span className="mt-5 flex gap-2.5 rounded-xl p-3 text-sm" style={{ backgroundColor: `${A}14`, color: "#FDE68A" }}>
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  Com esse tamanho, o plano <strong>{rec.plano.nome}</strong> sai mais em conta: {formatarBRL(r.virada.diferenca)}/mês a menos que o{" "}
                  {r.virada.comparadoCom.nome} com adicionais.
                </span>
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        <Link href={contratarHref(rec.plano.id, ciclo, rec.usuariosAdicionais)} className="btn-gold mt-7 w-full">
          Contratar o {rec.plano.nome} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <p className="mt-3 text-center text-xs text-ink-muted">Notas excedentes são cobradas pelo uso, mês a mês.</p>
      </div>
    </div>
  );
}
