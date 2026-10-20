import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { SOB_MEDIDA } from "@/content/site";

export function SobMedida() {
  return (
    <section id="sob-medida" aria-labelledby="sob-medida-titulo" className="relative overflow-hidden bg-base-alt py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-primary-violet/20 blur-[120px]" />
        <div className="absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container-site relative">
        <SectionHeader
          id="sob-medida-titulo"
          eyebrow="Sob medida"
          titulo={
            <>
              CRMs e ERPs personalizados, <span className="text-gradient">do jeito que sua operação funciona.</span>
            </>
          }
          texto="Quando o software pronto não encaixa, a gente constrói o sistema em volta do seu processo — não o contrário."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOB_MEDIDA.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.titulo} delay={(i % 3) * 0.08} className="h-full">
                <SpotlightCard className="h-full p-6">
                  <span className="bg-gradient-primary grid h-11 w-11 place-items-center rounded-xl text-white shadow-lg shadow-primary/30">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{s.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.texto}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <Link href="/#contato" className="btn-primary text-base">
            Conte sua ideia — a gente transforma em sistema. <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
