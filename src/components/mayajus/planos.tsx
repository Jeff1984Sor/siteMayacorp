"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus } from "lucide-react";
import { MAYAJUS_ACCENT as A, linkCadastro } from "@/content/mayajus";
import { PLANO_DESTAQUE, PLANOS, PRECO_USUARIO_ADICIONAL, type Ciclo, type Plano } from "@/content/mayajus-planos";
import { economiaAnualPlano, formatarBRL, mensalEquivalente } from "@/lib/mayajus-preco";

export function contratarHref(plano: string, ciclo: Ciclo) {
  return linkCadastro(plano, ciclo);
}

export function CicloToggle({ ciclo, onChange, id }: { ciclo: Ciclo; onChange: (c: Ciclo) => void; id?: string }) {
  return (
    <div id={id} role="radiogroup" aria-label="Ciclo de cobrança" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
      {(["mensal", "anual"] as const).map((c) => {
        const ativo = ciclo === c;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(c)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                onChange(c === "mensal" ? "anual" : "mensal");
              }
            }}
            tabIndex={ativo ? 0 : -1}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${ativo ? "text-[#0A0F1E]" : "text-ink-muted hover:text-ink"}`}
          >
            {ativo && (
              <motion.span
                layoutId={`ciclo-pill-${id ?? "x"}`}
                className="absolute inset-0 rounded-full"
                style={{ background: `linear-gradient(135deg, ${A}, #F59E0B)` }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {c === "mensal" ? "Mensal" : "Anual"}
              {c === "anual" && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    ativo ? "bg-[#0A0F1E]/15 text-[#0A0F1E]" : "bg-emerald-400/15 text-emerald-300"
                  }`}
                >
                  2 meses grátis
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Item({ ok = true, children }: { ok?: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex gap-2.5 text-sm leading-snug ${ok ? "text-ink" : "text-ink-muted/70"}`}>
      {ok ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
      ) : (
        <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>
        {children}
        {!ok && <span className="sr-only"> (não incluso)</span>}
      </span>
    </li>
  );
}

function CardPlano({ plano, ciclo }: { plano: Plano; ciclo: Ciclo }) {
  const destaque = plano.id === PLANO_DESTAQUE;
  const preco = mensalEquivalente(plano, ciclo);
  const usuarios = plano.usuariosIncluidos === 1 ? "1 usuário" : `Até ${plano.usuariosIncluidos} usuários`;

  return (
    <article
      data-plano={plano.id}
      aria-labelledby={`plano-${plano.id}`}
      className={`relative flex h-full w-[84%] max-w-[340px] shrink-0 snap-center flex-col rounded-3xl border p-6 transition duration-300 sm:w-[60%] md:w-auto md:max-w-none ${
        destaque ? "bg-base-alt lg:-my-3 lg:py-9" : "glass border-white/10 hover:border-white/20"
      }`}
      style={destaque ? { borderColor: `${A}80`, boxShadow: `0 30px 80px -40px ${A}aa` } : undefined}
    >
      {plano.selo && (
        <span
          className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
          style={
            plano.selo === "Mais popular"
              ? { background: `linear-gradient(135deg, ${A}, #FDE68A)`, color: "#0A0F1E" }
              : { backgroundColor: "#0F172A", border: `1px solid ${A}80`, color: A }
          }
        >
          {plano.selo}
        </span>
      )}
      <h3 id={`plano-${plano.id}`} className="text-xl font-semibold">
        {plano.nome}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">{plano.resumo}</p>

      <div className="mt-6 min-h-[92px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ciclo}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="flex items-baseline gap-1">
              <span className="whitespace-nowrap font-display text-4xl font-bold tracking-tight lg:text-[2rem] xl:text-4xl">{formatarBRL(preco)}</span>
              <span className="text-sm text-ink-muted">/mês</span>
            </p>
            {ciclo === "anual" ? (
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                cobrado anualmente: {formatarBRL(plano.anual)}
                <br />
                <span className="font-semibold text-emerald-300">economia de {formatarBRL(economiaAnualPlano(plano))} no ano</span>
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-ink-muted">sem fidelidade · cancele quando quiser</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ul className="mt-6 flex-1 space-y-3 border-t border-white/[0.08] pt-6">
        <Item>{usuarios}</Item>
        <Item>
          {plano.notasIncluidas === null ? (
            <>
              Notas fiscais <strong className="text-shimmer font-bold">Ilimitadas</strong>
            </>
          ) : (
            `${plano.notasIncluidas} notas fiscais/mês`
          )}
        </Item>
        {plano.notaExcedente !== null && (
          <Item>
            <span className="text-ink-muted">Nota excedente {formatarBRL(plano.notaExcedente)}</span>
          </Item>
        )}
        <Item>
          <span className="text-ink-muted">Usuário adicional {formatarBRL(PRECO_USUARIO_ADICIONAL)}/mês</span>
        </Item>
        <Item>Gestão de processos e financeiro</Item>
        <Item ok={plano.automacoes}>Automações padrão</Item>
        <Item ok={plano.integracaoContador}>Integração com contador</Item>
        <Item>Migração grátis no anual</Item>
      </ul>

      <a
        href={contratarHref(plano.id, ciclo)}
        className={`mt-8 w-full ${destaque ? "btn-gold" : "btn-secondary"}`}
        aria-label={`Contratar o plano ${plano.nome} ${ciclo}`}
      >
        Contratar <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </article>
  );
}

/** Tabela de planos. No mobile vira carrossel e abre no plano em destaque. */
export function Planos({ ciclo }: { ciclo: Ciclo }) {
  const trilho = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(PLANOS.findIndex((p) => p.id === PLANO_DESTAQUE));

  const centralizar = (i: number, suave: boolean) => {
    const el = trilho.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: suave ? "smooth" : "auto" });
  };

  useEffect(() => {
    centralizar(PLANOS.findIndex((p) => p.id === PLANO_DESTAQUE), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = trilho.current;
    if (!el) return;
    const centro = el.scrollLeft + el.clientWidth / 2;
    let melhor = 0;
    let dist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const card = c as HTMLElement;
      const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - centro);
      if (d < dist) {
        dist = d;
        melhor = i;
      }
    });
    setAtual(melhor);
  };

  return (
    <div>
      <div
        ref={trilho}
        onScroll={onScroll}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-5 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4"
      >
        {PLANOS.map((p) => (
          <CardPlano key={p.id} plano={p} ciclo={ciclo} />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2 md:hidden">
        {PLANOS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => centralizar(i, true)}
            aria-label={`Ver plano ${p.nome}`}
            aria-current={atual === i ? "true" : undefined}
            className="grid h-6 w-6 place-items-center"
          >
            <span
              className="block h-2 rounded-full transition-all duration-300"
              style={{ width: atual === i ? 22 : 8, backgroundColor: atual === i ? A : "rgba(148,163,184,.4)" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
