import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Info, X } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { ProductMockup } from "@/components/product-mockup";
import { Reveal } from "@/components/reveal";
import { SpotlightCard } from "@/components/spotlight-card";
import { PRODUTOS, getProduto } from "@/content/produtos";
import { MAILTO } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) return {};
  const title = `${p.nome} — ${p.tagline}`;
  return {
    title,
    description: p.descricao,
    alternates: { canonical: `/produtos/${p.slug}` },
    openGraph: { title, description: p.descricao, url: `/produtos/${p.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title, description: p.descricao },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduto(slug);
  if (!p) notFound();

  const Icon = p.icon;
  const ctaHref = `/?interesse=${p.slug}#contato`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="bg-dots mask-fade absolute inset-0" />
          <div
            className="absolute -top-32 left-1/2 h-[480px] w-[min(760px,140vw)] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
            style={{ background: `radial-gradient(circle, ${p.accent}, transparent 70%)` }}
          />
        </div>

        <div className="container-site">
          <Link href="/#produtos" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Todos os produtos
          </Link>

          <div className="mt-8 grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="flex flex-wrap items-center gap-3 animate-fade-up">
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl"
                  style={{ backgroundColor: `${p.accent}1f`, color: p.accent }}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                {p.badge && (
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {p.badge}
                  </span>
                )}
              </div>
              <h1 className="mt-6 animate-fade-up text-4xl font-bold leading-tight sm:text-5xl [animation-delay:80ms]">
                {p.nome}
              </h1>
              <p className="mt-3 animate-fade-up font-display text-xl font-semibold sm:text-2xl [animation-delay:120ms]" style={{ color: p.accent }}>
                {p.tagline}
              </p>
              <p className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-ink-muted [animation-delay:160ms]">
                {p.descricao}
              </p>
              {p.aviso && (
                <p className="mt-5 flex max-w-xl gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-ink-muted">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {p.aviso}
                </p>
              )}
              <div className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row [animation-delay:240ms]">
                <a href={ctaHref} className="btn-primary">
                  Quero o {p.nome} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="#funcionalidades" className="btn-secondary">
                  Ver funcionalidades
                </a>
              </div>
            </div>
            <ProductMockup tipo={p.mockup} accent={p.accent} />
          </div>
        </div>
      </section>

      {/* Problema */}
      <section aria-labelledby="problema-titulo" className="border-y border-white/[0.06] bg-base-alt py-20 sm:py-24">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">O problema</p>
            <h2 id="problema-titulo" className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              {p.problema.titulo}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{p.problema.texto}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-3">
              {p.problema.dores.map((d) => (
                <li key={d} className="glass flex items-center gap-3 rounded-xl p-4 text-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-400/10 text-rose-300">
                    <X className="h-4 w-4" aria-hidden />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" aria-labelledby="func-titulo" className="py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Funcionalidades</p>
            <h2 id="func-titulo" className="mt-5 text-3xl font-bold sm:text-4xl">
              O que o {p.nome} faz por você
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.funcionalidades.map((f, i) => {
              const FIcon = f.icon;
              return (
                <Reveal key={f.titulo} delay={(i % 3) * 0.08} className="h-full">
                  <SpotlightCard accent={p.accent} className="h-full p-6">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{ backgroundColor: `${p.accent}1f`, color: p.accent }}
                    >
                      <FIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{f.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.texto}</p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Para quem é + FAQ */}
      <section aria-labelledby="para-quem-titulo" className="bg-base-alt py-24 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Para quem é</p>
            <h2 id="para-quem-titulo" className="mt-5 text-3xl font-bold sm:text-4xl">
              Feito para
            </h2>
            <ul className="mt-8 space-y-3">
              {p.paraQuem.map((q) => (
                <li key={q} className="flex gap-3 text-base">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-success" aria-hidden />
                  {q}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-bold sm:text-3xl">Perguntas frequentes</h2>
            <div className="mt-6">
              <FaqAccordion itens={p.faq} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-titulo" className="py-24">
        <div className="container-site">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 p-8 text-center sm:p-14">
              <div
                className="absolute inset-0 -z-10 opacity-25"
                style={{ background: `linear-gradient(135deg, ${p.accent}, #6366F1 50%, #0A0F1E)` }}
                aria-hidden
              />
              <h2 id="cta-titulo" className="text-3xl font-bold sm:text-4xl">
                Vamos conversar sobre o {p.nome}?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-muted">
                Conte sobre a sua operação. A gente responde com os próximos passos.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={ctaHref} className="btn-primary">
                  Falar sobre o {p.nome} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href={`${MAILTO}?subject=${encodeURIComponent(`[Site] ${p.nome}`)}`} className="btn-secondary">
                  Enviar e-mail
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
