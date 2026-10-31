// PostgreSQL — ativado quando DATABASE_URL está no .env. Tabelas em deploy/sql/mayajus-pedidos.sql
// (também criadas aqui na primeira conexão, se ainda não existirem).
import { Pool } from "pg";
import { anoAtual, formatarNumero, type PedidoStore } from "@/lib/pedidos/store";
import type { Pedido } from "@/lib/pedidos/tipos";

const DDL = `
CREATE TABLE IF NOT EXISTS mayajus_pedido_sequencia (
  ano integer PRIMARY KEY,
  ultimo integer NOT NULL
);
CREATE TABLE IF NOT EXISTS mayajus_pedidos (
  numero text PRIMARY KEY,
  status text NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  dados jsonb NOT NULL
);
CREATE INDEX IF NOT EXISTS mayajus_pedidos_status_idx ON mayajus_pedidos (status, criado_em DESC);
`;

type Linha = { numero: string; status: Pedido["status"]; criado_em: Date; atualizado_em: Date; dados: Pedido };

const deLinha = (l: Linha): Pedido => ({
  ...l.dados,
  numero: l.numero,
  status: l.status,
  criadoEm: l.criado_em.toISOString(),
  atualizadoEm: l.atualizado_em.toISOString(),
});

export async function criarPgStore(url: string): Promise<PedidoStore> {
  const pool = new Pool({ connectionString: url, max: 3 });
  await pool.query(DDL);

  return {
    async criar(novo) {
      const cliente = await pool.connect();
      try {
        await cliente.query("BEGIN");
        const ano = anoAtual();
        const { rows } = await cliente.query<{ ultimo: number }>(
          `INSERT INTO mayajus_pedido_sequencia (ano, ultimo) VALUES ($1, 1)
           ON CONFLICT (ano) DO UPDATE SET ultimo = mayajus_pedido_sequencia.ultimo + 1
           RETURNING ultimo`,
          [ano],
        );
        const numero = formatarNumero(ano, rows[0].ultimo);
        const agora = new Date().toISOString();
        const pedido: Pedido = { ...novo, numero, criadoEm: agora, atualizadoEm: agora };
        await cliente.query(
          "INSERT INTO mayajus_pedidos (numero, status, criado_em, atualizado_em, dados) VALUES ($1, $2, $3, $3, $4)",
          [numero, pedido.status, agora, pedido],
        );
        await cliente.query("COMMIT");
        return pedido;
      } catch (err) {
        await cliente.query("ROLLBACK").catch(() => undefined);
        throw err;
      } finally {
        cliente.release();
      }
    },

    async listar(filtro) {
      const { rows } = filtro?.status
        ? await pool.query<Linha>("SELECT * FROM mayajus_pedidos WHERE status = $1 ORDER BY criado_em DESC", [filtro.status])
        : await pool.query<Linha>("SELECT * FROM mayajus_pedidos ORDER BY criado_em DESC");
      return rows.map(deLinha);
    },

    async atualizarStatus(numero, status) {
      const { rows } = await pool.query<Linha>(
        `UPDATE mayajus_pedidos
         SET status = $2, atualizado_em = now(), dados = jsonb_set(dados, '{status}', to_jsonb($2::text))
         WHERE numero = $1 RETURNING *`,
        [numero, status],
      );
      return rows[0] ? deLinha(rows[0]) : null;
    },
  };
}
