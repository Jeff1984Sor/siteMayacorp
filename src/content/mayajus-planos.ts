// Planos e preços do MayaJus — ÚNICO lugar para mudar valores.
// Tabela, calculadora, checkout, e-mails, JSON-LD e o recálculo do servidor leem daqui.

export type PlanoId = "solo" | "escritorio" | "pro" | "ilimitado";
export type Ciclo = "mensal" | "anual";

export type Plano = {
  id: PlanoId;
  nome: string;
  resumo: string;
  /** Preço mensal no ciclo mensal (R$). */
  mensal: number;
  /** Preço total do ciclo anual (R$). */
  anual: number;
  usuariosIncluidos: number;
  /** `null` = notas ilimitadas. */
  notasIncluidas: number | null;
  /** Preço por nota acima da franquia (R$). `null` quando não se aplica. */
  notaExcedente: number | null;
  automacoes: boolean;
  integracaoContador: boolean;
  selo?: "Mais popular" | "Mais completo";
};

export const PRECO_USUARIO_ADICIONAL = 49.9;

/** Usuários adicionais no anual: quantos meses são cobrados por ano (12 = sem desconto). */
export const MESES_ADICIONAL_NO_ANUAL = 12;

export const PLANOS: Plano[] = [
  {
    id: "solo",
    nome: "Solo",
    resumo: "Para o advogado que trabalha sozinho.",
    mensal: 119,
    anual: 1190,
    usuariosIncluidos: 1,
    notasIncluidas: 20,
    notaExcedente: 0.5,
    automacoes: false,
    integracaoContador: false,
  },
  {
    id: "escritorio",
    nome: "Escritório",
    resumo: "Para o escritório que está crescendo.",
    mensal: 279,
    anual: 2790,
    usuariosIncluidos: 5,
    notasIncluidas: 100,
    notaExcedente: 0.5,
    automacoes: false,
    integracaoContador: false,
    selo: "Mais popular",
  },
  {
    id: "pro",
    nome: "Pro",
    resumo: "Automação e contador conectados.",
    mensal: 549,
    anual: 5490,
    usuariosIncluidos: 15,
    notasIncluidas: 500,
    notaExcedente: 0.5,
    automacoes: true,
    integracaoContador: true,
  },
  {
    id: "ilimitado",
    nome: "Ilimitado",
    resumo: "Volume alto, nota sem limite.",
    mensal: 990,
    anual: 9900,
    usuariosIncluidos: 30,
    notasIncluidas: null,
    notaExcedente: null,
    automacoes: true,
    integracaoContador: true,
    selo: "Mais completo",
  },
];

export const PLANO_IDS = PLANOS.map((p) => p.id) as [PlanoId, ...PlanoId[]];

/** Plano aberto primeiro no carrossel do mobile. */
export const PLANO_DESTAQUE: PlanoId = "escritorio";

// Migração de dados do sistema atual
export type FaixaProcessos = "ate200" | "200a1000" | "acima1000";

/** Preço da migração no plano mensal. `null` = sob orçamento. No anual é sempre grátis. */
export const MIGRACAO_MENSAL: Record<FaixaProcessos, number | null> = {
  ate200: 0,
  "200a1000": 490,
  acima1000: null,
};

export function getPlano(id: string): Plano | undefined {
  return PLANOS.find((p) => p.id === id);
}

export function isPlanoId(v: string | null | undefined): v is PlanoId {
  return !!v && PLANOS.some((p) => p.id === v);
}

export function isCiclo(v: string | null | undefined): v is Ciclo {
  return v === "mensal" || v === "anual";
}
