import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { DIFERENCIAIS } from "@/content/site";

export function Diferenciais() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="bg-base-alt py-24 sm:py-32">
      <div className="container-site">
        <SectionHeader
          id="sobre-titulo"
          eyebrow="Sobre a MayaCorp"
          titulo={
            <>
              Uma fábrica de software <span className="text-gradient">feita para entregar</span>
            </>
          }
          texto="A MayaCorp desenvolve SaaS próprios e sistemas sob medida, unindo mais de 15 anos de experiência em tecnologia e atendimento a uma operação moderna, apoiada por agentes de IA."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map((d, i) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.titulo} delay={(i % 3) * 0.08} className="h-full">
                <SpotlightCard accent="#22D3EE" className="h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{d.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.texto}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
