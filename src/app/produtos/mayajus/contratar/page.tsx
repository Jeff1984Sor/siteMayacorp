import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Checkout, type CheckoutInicial } from "@/components/mayajus/checkout";
import { MAYAJUS_ACCENT as A } from "@/content/mayajus";
import { isCiclo, isPlanoId } from "@/content/mayajus-planos";

export const metadata: Metadata = {
  title: "Contratar o MayaJus",
  description: "Contrate o MayaJus online em 3 passos: escolha o plano, informe os dados do escritório e confirme. O pagamento é enviado por link.",
  alternates: { canonical: "/produtos/mayajus/contratar" },
  openGraph: { title: "Contratar o MayaJus", url: "/produtos/mayajus/contratar", type: "website" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContratarPage({ searchParams }: Props) {
  const q = await searchParams;
  const plano = um(q.plano);
  const ciclo = um(q.ciclo);
  const adicionais = Number(um(q.adicionais));
  const inicial: CheckoutInicial = {
    plano: isPlanoId(plano) ? plano : undefined,
    ciclo: isCiclo(ciclo) ? ciclo : undefined,
    adicionais: Number.isInteger(adicionais) && adicionais > 0 ? adicionais : undefined,
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-dots mask-fade absolute inset-0 opacity-50" />
        <div
          className="absolute -top-40 right-0 h-[420px] w-[min(640px,120vw)] rounded-full opacity-20 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${A}, transparent 70%)` }}
        />
      </div>
      <div className="container-site">
        <Link href="/produtos/mayajus" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden /> MayaJus
        </Link>
        <div className="mb-10 mt-6 max-w-2xl">
          <p className="eyebrow" style={{ color: A }}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Lançamento do ano
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Contratar o MayaJus</h1>
          <p className="mt-3 text-ink-muted">Três passos, poucos minutos. Nada é cobrado agora: o link de pagamento chega depois do nosso contato.</p>
        </div>
        <Checkout inicial={inicial} />
      </div>
    </section>
  );
}
