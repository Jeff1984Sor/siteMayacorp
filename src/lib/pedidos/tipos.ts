import type { Ciclo, FaixaProcessos, PlanoId } from "@/content/mayajus-planos";
import type { ResumoPreco } from "@/lib/mayajus-preco";

export const STATUS_PEDIDO = [
  { id: "novo", label: "Novo" },
  { id: "aguardando_pagamento", label: "Aguardando pagamento" },
  { id: "ativo", label: "Ativo" },
  { id: "cancelado", label: "Cancelado" },
] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number]["id"];

export function isStatusPedido(v: unknown): v is StatusPedido {
  return STATUS_PEDIDO.some((s) => s.id === v);
}

export function statusLabel(s: StatusPedido): string {
  return STATUS_PEDIDO.find((x) => x.id === s)?.label ?? s;
}

export type Pagamento = {
  provedor: string;
  status: "aguardando" | "pago" | "falhou";
  referencia?: string;
  link?: string;
};

export type Pedido = {
  numero: string;
  criadoEm: string;
  atualizadoEm: string;
  status: StatusPedido;
  plano: PlanoId;
  planoNome: string;
  ciclo: Ciclo;
  usuariosAdicionais: number;
  preco: ResumoPreco;
  escritorio: {
    razaoSocial: string;
    documento: string;
    tipoDocumento: "cpf" | "cnpj";
    oab: string;
    municipio: string;
    municipioUf: string;
    responsavel: string;
    email: string;
    whatsapp: string;
  };
  migracao: { sistemaAtual: string; faixaProcessos: FaixaProcessos | null };
  observacoes: string;
  pagamento: Pagamento;
};

/** Pedido antes de receber número e datas (o armazenamento preenche). */
export type NovoPedido = Omit<Pedido, "numero" | "criadoEm" | "atualizadoEm">;
