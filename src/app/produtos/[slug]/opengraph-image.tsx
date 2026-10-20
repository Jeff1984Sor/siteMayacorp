import { OG_SIZE, renderOg } from "@/lib/og";
import { PRODUTOS, getProduto } from "@/content/produtos";

export const alt = "Produto MayaCorp";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduto(slug);
  return renderOg({
    titulo: p ? `${p.nome} — ${p.tagline}` : "MayaCorp",
    subtitulo: p?.descricao ?? "Software que trabalha pelo seu negócio.",
    accent: p?.accent,
  });
}
