import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { anoAtual, formatarNumero, type PedidoStore } from "@/lib/pedidos/store";
import type { Pedido } from "@/lib/pedidos/tipos";

type Arquivo = { sequencias: Record<string, number>; pedidos: Pedido[] };

export function criarFileStore(dir = process.env.PEDIDOS_DIR || join(process.cwd(), "data")): PedidoStore {
  const caminho = join(dir, "pedidos-mayajus.json");

  // Fila simples: uma escrita por vez (o site roda em uma única instância).
  let fila: Promise<unknown> = Promise.resolve();
  const emFila = <T>(fn: () => Promise<T>): Promise<T> => {
    const p = fila.then(fn, fn);
    fila = p.catch(() => undefined);
    return p;
  };

  async function ler(): Promise<Arquivo> {
    try {
      return JSON.parse(await readFile(caminho, "utf8")) as Arquivo;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return { sequencias: {}, pedidos: [] };
      throw err;
    }
  }

  async function gravar(dados: Arquivo) {
    await mkdir(dir, { recursive: true });
    const tmp = `${caminho}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(dados, null, 2), { encoding: "utf8", mode: 0o600 });
    await rename(tmp, caminho);
  }

  return {
    criar: (novo) =>
      emFila(async () => {
        const dados = await ler();
        const ano = anoAtual();
        const seq = (dados.sequencias[ano] ?? 0) + 1;
        dados.sequencias[ano] = seq;
        const agora = new Date().toISOString();
        const pedido: Pedido = { ...novo, numero: formatarNumero(ano, seq), criadoEm: agora, atualizadoEm: agora };
        dados.pedidos.push(pedido);
        await gravar(dados);
        return pedido;
      }),

    listar: async (filtro) => {
      const { pedidos } = await ler();
      return pedidos
        .filter((p) => !filtro?.status || p.status === filtro.status)
        .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    },

    atualizarStatus: (numero, status) =>
      emFila(async () => {
        const dados = await ler();
        const pedido = dados.pedidos.find((p) => p.numero === numero);
        if (!pedido) return null;
        pedido.status = status;
        pedido.atualizadoEm = new Date().toISOString();
        await gravar(dados);
        return pedido;
      }),
  };
}
