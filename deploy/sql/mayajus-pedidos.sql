-- Pedidos do MayaJus (PostgreSQL). Só é usado quando DATABASE_URL está no .env.
-- Sugestão de criação (rodar como superusuário do Postgres, com senha forte no lugar de ...):
--   CREATE ROLE mayacorp_site LOGIN PASSWORD '...';
--   CREATE DATABASE mayacorp_site OWNER mayacorp_site;
-- Depois: DATABASE_URL=postgres://mayacorp_site:...@127.0.0.1:5432/mayacorp_site
-- As tabelas abaixo também são criadas automaticamente pelo site na primeira conexão.

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
