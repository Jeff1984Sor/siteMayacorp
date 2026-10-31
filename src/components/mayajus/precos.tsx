"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, DatabaseZap, Workflow } from "lucide-react";
import { Calculadora } from "@/components/mayajus/calculadora";
import { CicloToggle, Planos } from "@/components/mayajus/planos";
import { Reveal } from "@/components/reveal";
import { MAYAJUS_ACCENT as A } from "@/content/mayajus";
import { MIGRACAO_MENSAL, type Ciclo } from "@/content/mayajus-planos";
import { formatarBRL } from "@/lib/mayajus-preco";

/** Planos + blocos de migração/automação + calculadora, compartilhando o ciclo escolhido. */
export function PrecosMayajus() {
  const [ciclo, setCiclo] = useState<Ciclo>("anual");

  return (
    <>
      <section id="planos" aria-labelledby="planos-titulo" className="relative py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow" style={{ color: A }}>
              Planos
            </p>
            <h2 id="planos-titulo" className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
              Um plano para cada tamanho de escritório
            </h2>
            <p className="mt-4 text-lg text-ink-muted">Todos com emissão de NFS-e. Troque de plano quando quiser.</p>
            <div className="mt-8 flex justify-center">
              <CicloToggle id="ciclo-planos" ciclo={ciclo} onChange={setCiclo} />
            </div>
          </Reveal>

          <div className="mt-12">
            <Planos ciclo={ciclo} />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="glass flex h-full flex-col rounded-2xl p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: `${A}1f`, color: A }}>
                  <DatabaseZap className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Migração no plano mensal</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                  <li>
                    Até 200 processos: <strong className="text-emerald-300">grátis</strong>
                  </li>
                  <li>
                    De 200 a 1.000 processos: <strong className="text-ink">{formatarBRL(MIGRACAO_MENSAL["200a1000"] ?? 0)}</strong>
                  </li>
                  <li>Acima disso: sob orçamento</li>
                </ul>
                <p className="mt-3 text-sm" style={{ color: A }}>
                  No plano anual, a migração é grátis em qualquer tamanho.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <div className="glass flex h-full flex-col rounded-2xl p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: `${A}1f`, color: A }}>
                  <Workflow className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Automações sob medida</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  Precisa de um fluxo só do seu escritório? Fazemos automações sob medida, com setup e mensalidade sob orçamento.
                </p>
                <Link href="/?interesse=mayajus#contato" className="btn-secondary mt-5 self-start">
                  Pedir orçamento <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="calculadora" aria-labelledby="calc-titulo" className="border-y border-white/[0.06] bg-base-alt py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow" style={{ color: A }}>
              Calculadora
            </p>
            <h2 id="calc-titulo" className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              Qual plano é o meu?
            </h2>
            <p className="mt-4 text-lg text-ink-muted">Mova os controles e veja o plano mais barato para o tamanho do seu escritório.</p>
            <div className="mt-8 flex justify-center">
              <CicloToggle id="ciclo-calc" ciclo={ciclo} onChange={setCiclo} />
            </div>
          </Reveal>
          <div className="mt-12">
            <Calculadora ciclo={ciclo} />
          </div>
        </div>
      </section>
    </>
  );
}
