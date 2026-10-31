// Regras de preço do MayaJus — funções puras, usadas no navegador e recalculadas no servidor.
// Tudo é calculado em centavos (inteiros) para não haver erro de arredondamento.
import {
  MESES_ADICIONAL_NO_ANUAL,
  MIGRACAO_MENSAL,
  PLANOS,
  PRECO_USUARIO_ADICIONAL,
  type Ciclo,
  type FaixaProcessos,
  type Plano,
} from "@/content/mayajus-planos";

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
// Pedido (checkout) — o servidor sempre recalcula com esta função
// ---------------------------------------------------------------------------

export type EntradaPedido = {
  plano: Plano;
  ciclo: Ciclo;
  usuariosAdicionais: number;
  /** `null` = não há migração (cliente não usa nenhum sistema). */
  faixaProcessos: FaixaProcessos | null;
};

export type ResumoPreco = {
  ciclo: Ciclo;
  /** Valor do plano cobrado no ciclo (mês ou ano). */
  valorPlano: number;
  /** Valor dos usuários adicionais cobrado no ciclo. */
  valorAdicionais: number;
  /** Total cobrado no ciclo (mês ou ano). */
  totalCiclo: number;
  /** Total por mês (no anual, o equivalente mensal). */
  totalMensal: number;
  /** Economia anual em relação ao mensal (0 no mensal). */
  economia: number;
  /** Custo da migração: 0 = grátis, `null` = sob orçamento ou não se aplica (ver `migracaoStatus`). */
  migracao: number | null;
  migracaoStatus: "gratis" | "cobrada" | "orcamento" | "nao-se-aplica";
};

export function calcularPedido(e: EntradaPedido): ResumoPreco {
  const adicionais = Math.max(0, Math.floor(e.usuariosAdicionais));
  const adicionalMesC = adicionais * c(PRECO_USUARIO_ADICIONAL);

  let planoC: number;
  let adicionaisC: number;
  let economiaC = 0;

  if (e.ciclo === "anual") {
    planoC = c(e.plano.anual);
    adicionaisC = adicionalMesC * MESES_ADICIONAL_NO_ANUAL;
    economiaC = c(e.plano.mensal) * 12 + adicionalMesC * 12 - (planoC + adicionaisC);
  } else {
    planoC = c(e.plano.mensal);
    adicionaisC = adicionalMesC;
  }

  const totalC = planoC + adicionaisC;

  let migracao: number | null;
  let migracaoStatus: ResumoPreco["migracaoStatus"];
  if (e.faixaProcessos === null) {
    migracao = null;
    migracaoStatus = "nao-se-aplica";
  } else if (e.ciclo === "anual") {
    migracao = 0;
    migracaoStatus = "gratis";
  } else {
    migracao = MIGRACAO_MENSAL[e.faixaProcessos];
    migracaoStatus = migracao === null ? "orcamento" : migracao === 0 ? "gratis" : "cobrada";
  }

  return {
    ciclo: e.ciclo,
    valorPlano: r(planoC),
    valorAdicionais: r(adicionaisC),
    totalCiclo: r(totalC),
    totalMensal: e.ciclo === "anual" ? r(totalC / 12) : r(totalC),
    economia: r(Math.max(0, economiaC)),
    migracao,
    migracaoStatus,
  };
}

export function migracaoTexto(p: Pick<ResumoPreco, "migracao" | "migracaoStatus">): string {
  switch (p.migracaoStatus) {
    case "gratis":
      return "Grátis";
    case "cobrada":
      return formatarBRL(p.migracao ?? 0);
    case "orcamento":
      return "Sob orçamento";
    default:
      return "Não se aplica";
  }
}

// ---------------------------------------------------------------------------

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** "R$ 1.190" para valores inteiros, "R$ 99,17" quando há centavos. */
export function formatarBRL(valor: number): string {
  const s = brl.format(valor).replace(/ /g, " ");
  return Number.isInteger(valor) ? s.replace(/,00$/, "") : s;
}
