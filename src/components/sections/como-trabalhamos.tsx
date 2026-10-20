import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { TimelineLine } from "@/components/timeline-line";
import { ETAPAS } from "@/content/site";

export function ComoTrabalhamos() {
  return (
    <section id="como-trabalhamos" aria-labelledby="como-titulo" className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeader
          id="como-titulo"
          eyebrow="Como trabalhamos"
          titulo={
            <>
              Do diagnóstico ao <span className="text-gradient">sistema no ar</span>
            </>
          }
          texto="Um processo claro, com entregas visíveis em cada etapa."
        />

        <ol className="relative mx-auto mt-16 max-w-3xl">
          <TimelineLine />
          {ETAPAS.map((e, i) => {
            const Icon = e.icon;
            return (
              <li key={e.titulo} className="relative pb-10 pl-16 last:pb-0 sm:pl-20">
                <span className="bg-gradient-primary absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg shadow-primary/30 sm:left-2">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <Reveal delay={0.05 * i}>
                  <div className="glass rounded-2xl p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Etapa {i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold">{e.titulo}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{e.texto}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-success/30 bg-success/[0.07] p-6 text-center sm:p-8">
            <ShieldCheck className="mx-auto h-8 w-8 text-success" aria-hidden />
            <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">Prazo definido no orçamento — e cumprido.</p>
            <p className="mt-2 text-sm text-ink-muted">Escopo, valor e prazo por escrito antes de começar.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
