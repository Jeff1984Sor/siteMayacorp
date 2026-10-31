import { NextResponse } from "next/server";
import { FAIXAS_PROCESSOS } from "@/content/mayajus-planos";
import { isAdmin } from "@/lib/admin-auth";
import { migracaoTexto } from "@/lib/mayajus-preco";
import { getPedidoStore } from "@/lib/pedidos/store";
import { isStatusPedido, statusLabel } from "@/lib/pedidos/tipos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Escapa para CSV (separador ;) e neutraliza fórmulas de planilha (=, +, -, @). */
function cel(v: string | number): string {
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const num = (v: number) => v.toFixed(2).replace(".", ",");

export async function GET(req: Request) {
  if (!(await isAdmin())) return new NextResponse("Não autorizado", { status: 401 });

  const status = new URL(req.url).searchParams.get("status");
  const store = await getPedidoStore();
  const pedidos = await store.listar(isStatusPedido(status) ? { status } : undefined);

  const cabecalho = [
    "Número", "Criado em", "Status", "Plano", "Ciclo", "Usuários adicionais", "Total do ciclo", "Total mensal", "Economia anual",
    "Migração", "Razão social", "Documento", "OAB", "Município", "UF", "Responsável", "E-mail", "WhatsApp", "Sistema atual",
    "Processos", "Pagamento", "Observações",
  ];

  const linhas = pedidos.map((p) =>
    [
      p.numero,
      new Date(p.criadoEm).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      statusLabel(p.status),
      p.planoNome,
      p.ciclo,
      p.usuariosAdicionais,
      num(p.preco.totalCiclo),
      num(p.preco.totalMensal),
      num(p.preco.economia),
      migracaoTexto(p.preco),
      p.escritorio.razaoSocial,
      p.escritorio.documento,
      p.escritorio.oab,
      p.escritorio.municipio,
      p.escritorio.municipioUf,
      p.escritorio.responsavel,
      p.escritorio.email,
      p.escritorio.whatsapp,
      p.migracao.sistemaAtual,
      FAIXAS_PROCESSOS.find((f) => f.id === p.migracao.faixaProcessos)?.label ?? "",
      `${p.pagamento.provedor} (${p.pagamento.status})`,
      p.observacoes,
    ]
      .map(cel)
      .join(";"),
  );

  const csv = "﻿" + [cabecalho.map(cel).join(";"), ...linhas].join("\r\n");
  const data = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-mayajus-${data}.csv"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
