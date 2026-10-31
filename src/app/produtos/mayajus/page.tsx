import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarX2, Check, Landmark, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { CtaFixo } from "@/components/mayajus/cta-fixo";
import { NfseTimeline } from "@/components/mayajus/nfse-timeline";
import { PainelMockup } from "@/components/mayajus/painel-mockup";
import { PrecosMayajus } from "@/components/mayajus/precos";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { SpotlightCard } from "@/components/spotlight-card";
import { MAYAJUS_ACCENT as A, MAYAJUS_HERO } from "@/content/mayajus";
import { PLANOS } from "@/content/mayajus-planos";
import { getProduto } from "@/content/produtos";
import { formatarBRL, mensalEquivalente } from "@/lib/mayajus-preco";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITULO = "MayaJus — Sistema jurídico com emissão automática de NFS-e";
const DESCRICAO =
  "Processos, prazos, clientes, financeiro e NFS-e no mesmo lugar. O honorário recebido vira nota emitida e enviada ao cliente e ao contador. Contrate online.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  keywords: ["sistema jurídico", "software para advogados", "gestão de escritório de advocacia", "emissão de NFS-e", "honorários", "MayaJus"],
  alternates: { canonical: "/produtos/mayajus" },
  openGraph: { title: TITULO, description: DESCRICAO, url: "/produtos/mayajus", type: "website" },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRICAO },
};

const DORES_ICONES = [CalendarX2, WalletCards, Landmark];

export default function MayaJusPage() {
  const p = getProduto("mayajus");
  if (!p) notFound();

  const aPartirDe = formatarBRL(Math.min(...PLANOS.map((pl) => mensalEquivalente(pl, "anual"))));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MayaJus",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Gestão jurídica",
    operatingSystem: "Web",
    url: `${SITE_URL}/produtos/mayajus`,
    description: DESCRICAO,
    inLanguage: "pt-BR",
    featureList: p.funcionalidades.map((f) => f.titulo),
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    offers: PLANOS.flatMap((pl) => [
      {
        "@type": "Offer",
        name: `${pl.nome} — mensal`,
        price: pl.mensal.toFixed(2),
        priceCurrency: "BRL",
        url: `${SITE_URL}/produtos/mayajus/contratar?plano=${pl.id}&ciclo=mensal`,
        availability: "https://schema.org/InStock",
        priceSpecification: { "@type": "UnitPriceSpecification", price: pl.mensal.toFixed(2), priceCurrency: "BRL", unitCode: "MON" },
      },
      {
        "@type": "Offer",
        name: `${pl.nome} — anual`,
        price: pl.anual.toFixed(2),
        priceCurrency: "BRL",
        url: `${SITE_URL}/produtos/mayajus/contratar?plano=${pl.id}&ciclo=anual`,
        availability: "https://schema.org/InStock",
        priceSpecification: { "@type": "UnitPriceSpecification", price: pl.anual.toFixed(2), priceCurrency: "BRL", unitCode: "ANN" },
      },
    ]),
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="bg-dots mask-fade absolute inset-0" />
          <div
            className="absolute -top-40 left-1/2 h-[520px] w-[min(820px,150vw)] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
            style={{ background: `radial-gradient(circle, ${A}, transparent 70%)` }}
          />
          <div className="absolute -bottom-40 -left-20 h-[380px] w-[380px] rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="container-site">
          <Link href="/#produtos" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Todos os produtos
          </Link>

          <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 animate-fade-up">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0A0F1E]"
                  style={{ background: `linear-gradient(135deg, ${A}, #FDE68A)` }}
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden /> {p.lancamento}
                </span>
                <span
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: `${A}66`, backgroundColor: `${A}14`, color: A }}
                >
                  {p.badge}
                </span>
              </div>
              <p className="mt-6 animate-fade-up font-display text-lg font-semibold [animation-delay:40ms]" style={{ color: A }}>
                MayaJus
              </p>
              <h1 className="mt-2 animate-fade-up text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.4rem] [animation-delay:80ms]">
                O sistema jurídico que fatura o honorário e <span className="text-gold-gradient">emite a nota sozinho.</span>
              </h1>
              <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-ink-muted [animation-delay:160ms]">
                {MAYAJUS_HERO.subtitulo}
              </p>
              <div className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row [animation-delay:240ms]">
                <a href="#planos" className="btn-secondary">
                  Ver planos
                </a>
                <Link href="/produtos/mayajus/contratar" className="btn-gold">
                  Contratar agora <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <ul className="mt-7 flex animate-fade-up flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted [animation-delay:300ms]">
                {[`A partir de ${aPartirDe}/mês no anual`, "Sem fidelidade no mensal", "Migração grátis no anual"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-success" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <PainelMockup />
          </div>
        </div>
      </section>

      {/* O problema */}
      <section aria-labelledby="problema-titulo" className="border-y border-white/[0.06] bg-base-alt py-20 sm:py-24">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">O problema</p>
            <h2 id="problema-titulo" className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              {p.problema.titulo}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{p.problema.texto}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {p.problema.dores.map((d, i) => {
              const Icon = DORES_ICONES[i] ?? CalendarX2;
              return (
                <Reveal key={d} delay={i * 0.08} className="h-full">
                  <div className="glass h-full rounded-2xl p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-400/10 text-rose-300">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="mt-4 text-base font-medium leading-snug">{d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Como funciona a nota fiscal */}
      <section id="nfse" aria-labelledby="nfse-titulo" className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full opacity-15 blur-[120px]" style={{ background: A }} />
        </div>
        <div className="container-site">
          <Reveal className="max-w-2xl">
            <p className="eyebrow" style={{ color: A }}>
              O diferencial
            </p>
            <h2 id="nfse-titulo" className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
              Recebeu o honorário? <span className="text-gold-gradient">A nota sai sozinha.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Sem abrir o portal da prefeitura, sem redigitar dados e sem esquecer de faturar. Do contrato ao e-mail do contador, em
              quatro passos automáticos.
            </p>
          </Reveal>
          <div className="mt-14">
            <NfseTimeline />
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" aria-labelledby="func-titulo" className="border-t border-white/[0.06] bg-base-alt py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Funcionalidades</p>
            <h2 id="func-titulo" className="mt-5 text-3xl font-bold sm:text-4xl">
              Tudo o que o escritório precisa, num lugar só
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.funcionalidades.map((f, i) => {
              const FIcon = f.icon;
              return (
                <Reveal key={f.titulo} delay={(i % 4) * 0.06} className="h-full">
                  <SpotlightCard accent={A} className="h-full p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: `${A}1f`, color: A }}>
                      <FIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{f.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.texto}</p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Planos + calculadora */}
      <PrecosMayajus />

      {/* FAQ */}
      <section aria-labelledby="faq-titulo" className="py-24 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-titulo" className="mt-5 text-3xl font-bold sm:text-4xl">
              Perguntas frequentes
            </h2>
            <p className="mt-4 text-ink-muted">Não achou a sua dúvida? Fale com a gente e respondemos rapidinho.</p>
            <ul className="mt-8 space-y-3">
              {p.paraQuem.map((q) => (
                <li key={q} className="flex gap-3 text-base">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-success" aria-hidden />
                  {q}
                </li>
              ))}
            </ul>
            <Link href="/?interesse=mayajus#contato" className="btn-secondary mt-8">
              Tirar uma dúvida
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqAccordion itens={p.faq} />
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section aria-labelledby="cta-titulo" className="pb-28">
        <div className="container-site">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-3xl border p-8 text-center sm:p-14" style={{ borderColor: `${A}55` }}>
              <div
                className="absolute inset-0 -z-10 opacity-30"
                style={{ background: `linear-gradient(135deg, ${A}, #6366F1 55%, #0A0F1E)` }}
                aria-hidden
              />
              <div className="bg-dots absolute inset-0 -z-10 opacity-40" aria-hidden />
              <p className="eyebrow" style={{ color: "#FDE68A" }}>
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> {p.lancamento}
              </p>
              <h2 id="cta-titulo" className="mt-5 text-3xl font-bold sm:text-5xl">
                Comece agora
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink">
                Contrate em poucos minutos. A nossa equipe cuida da configuração da NFS-e e da migração com você.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/produtos/mayajus/contratar" className="btn-gold">
                  Contratar o MayaJus <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a href="#calculadora" className="btn-secondary">
                  Descobrir meu plano
                </a>
              </div>
              <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Dados na nuvem, com backup e LGPD
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaFixo preco={`${aPartirDe}/mês`} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
