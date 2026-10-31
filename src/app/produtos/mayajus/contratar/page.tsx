import { redirect } from "next/navigation";
import { linkCadastro } from "@/content/mayajus";
import { isCiclo } from "@/content/mayajus-planos";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Endereço antigo da contratação: manda para o cadastro oficial com o mesmo plano e ciclo. */
export default async function ContratarPage({ searchParams }: Props) {
  const q = await searchParams;
  const ciclo = um(q.ciclo);
  redirect(linkCadastro(um(q.plano), isCiclo(ciclo) ? ciclo : "anual"));
}
