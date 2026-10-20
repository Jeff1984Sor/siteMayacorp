import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { PRODUTOS } from "@/content/produtos";

export function Produtos() {
  return (
    <section id="produtos" aria-labelledby="produtos-titulo" className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeader
          id="produtos-titulo"
          eyebrow="Produtos"
          titulo={
            <>
              SaaS prontos, com <span className="text-gradient">IA no centro</span>
            </>
          }
          texto="Produtos próprios, em nuvem, criados para resolver problemas reais do dia a dia."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUTOS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.slug} delay={(i % 3) * 0.08} className="h-full">
                <SpotlightCard accent={p.accent} className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-xl"
                      style={{ backgroundColor: `${p.accent}1f`, color: p.accent }}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    {p.badge && (
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{p.nome}</h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: p.accent }}>
                    {p.tagline}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {p.aviso && (
                    <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink-muted">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      {p.aviso}
                    </p>
                  )}
                  <Link
                    href={`/produtos/${p.slug}`}
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
                    aria-label={`Saiba mais sobre ${p.nome}`}
                  >
                    Saiba mais
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </Link>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
