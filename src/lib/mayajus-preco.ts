// Regras de preço do MayaJus (calculadora e tabela) — funções puras.
// Tudo é calculado em centavos (inteiros) para não haver erro de arredondamento.
import { MESES_ADICIONAL_NO_ANUAL, PLANOS, PRECO_USUARIO_ADICIONAL, type Ciclo, type Plano } from "@/content/mayajus-planos";

const c = (reais: number) => Math.round(reais * 100);
const r = (centavos: number) => Math.round(centavos) / 100;

/** Valor equivalente por mês do plano no ciclo escolhido (R$). */
export function mensalEquivalente(plano: Plano, ciclo: Ciclo): number {
  return ciclo === "anual" ? r(c(plano.anual) / 12) : plano.mensal;
}

/** Quanto o cliente economiza por ano no anual em relação a 12 mensalidades (R$). */
export function economiaAnualPlano(plano: Plano): number {
  return r(c(plano.mensal) * 12 - c(plano.anual));
}

// ---------------------------------------------------------------------------
// Calculadora "Qual plano é o meu?"
// ---------------------------------------------------------------------------

export type Uso = { usuarios: number; notas: number; ciclo: Ciclo };

export type CustoPlano = {
  plano: Plano;
  /** Custo total por mês (no anual, o equivalente mensal). */
  total: number;
  base: number;
  usuariosAdicionais: number;
  valorUsuarios: number;
  notasExcedentes: number;
  valorNotas: number;
};

export function custoDoPlano(plano: Plano, uso: Uso): CustoPlano {
  const usuarios = Math.max(1, Math.floor(uso.usuarios));
  const notas = Math.max(0, Math.floor(uso.notas));

  const baseC = uso.ciclo === "anual" ? c(plano.anual) / 12 : c(plano.mensal);

  const usuariosAdicionais = Math.max(0, usuarios - plano.usuariosIncluidos);
  const mesesAdicional = uso.ciclo === "anual" ? MESES_ADICIONAL_NO_ANUAL / 12 : 1;
  const usuariosC = usuariosAdicionais * c(PRECO_USUARIO_ADICIONAL) * mesesAdicional;

  const notasExcedentes = plano.notasIncluidas === null ? 0 : Math.max(0, notas - plano.notasIncluidas);
  const notasC = notasExcedentes * c(plano.notaExcedente ?? 0);

  return {
    plano,
    total: r(baseC + usuariosC + notasC),
    base: r(baseC),
    usuariosAdicionais,
    valorUsuarios: r(usuariosC),
    notasExcedentes,
    valorNotas: r(notasC),
  };
}

export type Recomendacao = {
  recomendado: CustoPlano;
  custos: CustoPlano[];
  /**
   * Preenchido quando um plano maior sai mais barato que um menor com adicionais:
   * `comparadoCom` é o mais barato entre os planos menores, `diferenca` é quanto se economiza por mês.
   */
  virada: { comparadoCom: Plano; diferenca: number } | null;
};

/** Recomenda o plano mais barato para o uso informado (empate: o plano maior, que inclui mais). */
export function recomendarPlano(uso: Uso, planos: Plano[] = PLANOS): Recomendacao {
  const custos = planos.map((p) => custoDoPlano(p, uso));

  let indice = 0;
  custos.forEach((custo, i) => {
    if (custo.total <= custos[indice].total) indice = i;
  });
  const recomendado = custos[indice];

  const menores = custos
    .slice(0, indice)
    .filter((x) => x.usuariosAdicionais > 0 || x.notasExcedentes > 0)
    .sort((a, b) => a.total - b.total);
  const alternativa = menores[0];

  return {
    recomendado,
    custos,
    virada:
      alternativa && alternativa.total > recomendado.total
        ? { comparadoCom: alternativa.plano, diferenca: r(c(alternativa.total) - c(recomendado.total)) }
        : null,
  };
}

// ---------------------------------------------------------------------------

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** "R$ 1.190" para valores inteiros, "R$ 99,17" quando há centavos. */
export function formatarBRL(valor: number): string {
  const s = brl.format(valor).replace(/ /g, " ");
  return Number.isInteger(valor) ? s.replace(/,00$/, "") : s;
}
