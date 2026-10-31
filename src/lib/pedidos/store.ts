// Armazenamento dos pedidos do MayaJus.
// Com DATABASE_URL no .env usa PostgreSQL; sem ela, grava em arquivo JSON (PEDIDOS_DIR, padrão ./data).
import type { NovoPedido, Pedido, StatusPedido } from "@/lib/pedidos/tipos";

export interface PedidoStore {
  criar(pedido: NovoPedido): Promise<Pedido>;
  listar(filtro?: { status?: StatusPedido }): Promise<Pedido[]>;
  atualizarStatus(numero: string, status: StatusPedido): Promise<Pedido | null>;
}

let store: Promise<PedidoStore> | null = null;

export function getPedidoStore(): Promise<PedidoStore> {
  if (!store) {
    store = process.env.DATABASE_URL
      ? import("@/lib/pedidos/pg-store").then((m) => m.criarPgStore(process.env.DATABASE_URL as string))
      : import("@/lib/pedidos/file-store").then((m) => m.criarFileStore());
  }
  return store;
}

/** Ano corrente no fuso de Brasília (o número do pedido reinicia a cada ano). */
export function anoAtual(agora = new Date()): number {
  return Number(new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "America/Sao_Paulo" }).format(agora));
}

export function formatarNumero(ano: number, sequencia: number): string {
  return `MJ-${ano}-${String(sequencia).padStart(4, "0")}`;
}
