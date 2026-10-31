import { PLANO_DESTAQUE, getPlano, type Ciclo } from "@/content/mayajus-planos";

// Textos da página do MayaJus que não estão em produtos.ts (planos e preços: mayajus-planos.ts).

export const MAYAJUS_ACCENT = "#F5B83D";

export const MAYAJUS_HERO = {
  titulo: "O sistema jurídico que fatura o honorário e emite a nota sozinho.",
  subtitulo:
    "Processos, prazos, clientes, financeiro e NFS-e no mesmo lugar. Feito para escritórios de advocacia que querem crescer sem virar refém de planilha.",
};

export const MAYAJUS_NFSE_PASSOS = [
  {
    titulo: "Contrato de honorários",
    texto: "Cadastre o contrato uma vez: valor, parcelas, êxito ou mensalidade fixa.",
    detalhe: "Honorário mensal · R$ 3.500",
  },
  {
    titulo: "Recebimento lançado",
    texto: "O pagamento entra no financeiro, por baixa manual ou conciliação.",
    detalhe: "Recebido · 05/11",
  },
  {
    titulo: "NFS-e emitida automaticamente",
    texto: "O MayaJus gera a nota na prefeitura do seu município, com os dados do contrato.",
    detalhe: "NFS-e nº 2026/000184",
  },
  {
    titulo: "Nota enviada ao cliente e ao contador",
    texto: "PDF e XML vão por e-mail para o cliente e ficam disponíveis para o contador.",
    detalhe: "Enviada · cliente + contador",
  },
];

// Cadastro oficial do MayaJus: é onde a pessoa contrata (os dados vão direto para o sistema).
// Aceita ?plano=<nome do plano em minúsculas>&ciclo=mensal|anual.
export const MAYAJUS_CADASTRO = "https://mayajus.mayacorp.com.br/cadastro";

export function linkCadastro(planoId?: string, ciclo: Ciclo = "anual"): string {
  const plano = getPlano(planoId ?? PLANO_DESTAQUE) ?? getPlano(PLANO_DESTAQUE);
  const q = new URLSearchParams({ plano: (plano?.nome ?? "").toLowerCase(), ciclo });
  return `${MAYAJUS_CADASTRO}?${q}`;
}
