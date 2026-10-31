import Link from "next/link";
import { ArrowRight, Check, Info, Sparkles } from "lucide-react";
import { HonorarioNfseCard } from "@/components/mayajus/honorario-nfse-card";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { PRODUTOS, type Produto } from "@/content/produtos";

function Selo({ p }: { p: Produto }) {
  if (!p.badge) return null;
  return p.badgeDestaque ? (
    <span
      className="rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{ borderColor: `${p.accent}66`, backgroundColor: `${p.accent}1a`, color: p.accent, boxShadow: `0 0 18px ${p.accent}33` }}
    >
      {p.badge}
    </span>
  ) : (
    <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
      {p.badge}
    </span>
  );
}

export function Lancamento({ texto, accent }: { texto: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0A0F1E]"
      style={{ background: `linear-gradient(135deg, ${accent}, #FDE68A)` }}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      {texto}
    </span>
  );
}

function CardDestaque({ p }: { p: Produto & { destaque: NonNullable<Produto["destaque"]> } }) {
  const Icon = p.icon;
  return (
    <SpotlightCard accent={p.accent} className="relative h-full overflow-hidden p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-[90px]"
        style={{ background: p.accent }}
        aria-hidden
      />
      <div className="grid h-full gap-8 sm:grid-cols-[1.15fr_1fr] sm:items-center">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="mr-1 grid h-12 w-12 place-items-center rounded-xl"
              style={{ backgroundColor: `${p.accent}1f`, color: p.accent }}
            >
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            {p.lancamento && <Lancamento texto={p.lancamento} accent={p.accent} />}
            <Selo p={p} />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">
            <Link href={`/produtos/${p.slug}`} className="hover:underline hover:underline-offset-4">
              {p.nome}
            </Link>
          </h3>
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
          <p className="mt-5 text-sm text-ink-muted">
            <span className="font-display text-lg font-semibold text-ink">{p.destaque.preco}</span> {p.destaque.precoNota}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href={p.destaque.contratarHref} className="btn-gold">
              Contratar agora <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href={p.destaque.planosHref} className="btn-secondary" aria-label={`Ver planos do ${p.nome}`}>
              Ver planos
            </Link>
            <Link
              href={`/produtos/${p.slug}`}
              className="group inline-flex items-center justify-center gap-1.5 px-2 py-3 text-sm font-semibold text-ink"
              aria-label={`Saiba mais sobre ${p.nome}`}
            >
              Saiba mais
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="hidden sm:block">
          <HonorarioNfseCard compacto />
        </div>
      </div>
    </SpotlightCard>
  );
}

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
            if (p.destaque) {
              return (
                <Reveal key={p.slug} className="h-full md:col-span-2">
                  <CardDestaque p={{ ...p, destaque: p.destaque }} />
                </Reveal>
              );
            }
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
                    <Selo p={p} />
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
