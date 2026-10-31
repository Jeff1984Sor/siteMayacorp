import Link from "next/link";
import { Download, LogOut } from "lucide-react";
import { LoginForm } from "@/app/admin/pedidos/login-form";
import { mudarStatus, sair } from "@/app/admin/pedidos/actions";
import { FAIXAS_PROCESSOS } from "@/content/mayajus-planos";
import { adminConfigurado, isAdmin } from "@/lib/admin-auth";
import { formatarBRL, migracaoTexto } from "@/lib/mayajus-preco";
import { getPedidoStore } from "@/lib/pedidos/store";
import { STATUS_PEDIDO, isStatusPedido, statusLabel, type StatusPedido } from "@/lib/pedidos/tipos";

export const dynamic = "force-dynamic";

const COR_STATUS: Record<StatusPedido, string> = {
  novo: "bg-accent/15 text-accent",
  aguardando_pagamento: "bg-amber-400/15 text-amber-300",
  ativo: "bg-emerald-400/15 text-emerald-300",
  cancelado: "bg-rose-400/15 text-rose-300",
};

const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

type Props = { searchParams: Promise<{ status?: string }> };

export default async function PedidosAdminPage({ searchParams }: Props) {
  if (!adminConfigurado()) {
    return (
      <section className="container-site pb-24 pt-32">
        <div className="glass mx-auto max-w-lg rounded-3xl p-8">
          <h1 className="text-2xl font-semibold">Painel desativado</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Defina <code className="text-ink">ADMIN_PASSWORD</code> (mínimo de 8 caracteres) no <code className="text-ink">.env</code> e reinicie o
            serviço.
          </p>
        </div>
      </section>
    );
  }

  if (!(await isAdmin())) {
    return (
      <section className="container-site pb-24 pt-24">
        <LoginForm />
      </section>
    );
  }

  const { status: filtroBruto } = await searchParams;
  const filtro = isStatusPedido(filtroBruto) ? filtroBruto : undefined;
  const store = await getPedidoStore();
  const todos = await store.listar();
  const pedidos = filtro ? todos.filter((p) => p.status === filtro) : todos;
  const contagem = (s?: StatusPedido) => (s ? todos.filter((p) => p.status === s).length : todos.length);

  const chips: { id?: StatusPedido; label: string }[] = [{ label: "Todos" }, ...STATUS_PEDIDO.map((s) => ({ id: s.id, label: s.label }))];

  return (
    <section className="pb-24 pt-28">
      <div className="container-site max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Administração</p>
            <h1 className="mt-4 text-3xl font-bold">Pedidos MayaJus</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/admin/pedidos/csv${filtro ? `?status=${filtro}` : ""}`} className="btn-secondary !py-2.5">
              <Download className="h-4 w-4" aria-hidden /> Exportar CSV
            </a>
            <form action={sair}>
              <button type="submit" className="btn-secondary !py-2.5" aria-label="Sair">
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Filtrar por status" className="mt-8 flex flex-wrap gap-2">
          {chips.map((c) => {
            const ativo = filtro === c.id;
            return (
              <Link
                key={c.label}
                href={c.id ? `/admin/pedidos?status=${c.id}` : "/admin/pedidos"}
                aria-current={ativo ? "page" : undefined}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  ativo ? "border-primary bg-primary/15 text-ink" : "border-white/10 text-ink-muted hover:text-ink"
                }`}
              >
                {c.label} <span className="ml-1 text-xs opacity-70">{contagem(c.id)}</span>
              </Link>
            );
          })}
        </nav>

        {pedidos.length === 0 ? (
          <p className="glass mt-8 rounded-2xl p-8 text-center text-ink-muted">Nenhum pedido {filtro ? `com status “${statusLabel(filtro)}”` : "ainda"}.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {pedidos.map((p) => {
              const faixa = FAIXAS_PROCESSOS.find((f) => f.id === p.migracao.faixaProcessos)?.label;
              return (
                <li key={p.numero} className="glass rounded-2xl">
                  <details className="group">
                    <summary className="grid cursor-pointer list-none gap-3 p-4 sm:grid-cols-[150px_1fr_170px_130px] sm:items-center sm:p-5">
                      <div>
                        <p className="font-mono text-sm font-semibold text-gold">{p.numero}</p>
                        <p className="text-xs text-ink-muted">{dataHora.format(new Date(p.criadoEm))}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{p.escritorio.razaoSocial}</p>
                        <p className="truncate text-xs text-ink-muted">
                          {p.escritorio.responsavel} · {p.escritorio.municipio}/{p.escritorio.municipioUf}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p>
                          {p.planoNome} · {p.ciclo === "anual" ? "Anual" : "Mensal"}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {formatarBRL(p.preco.totalCiclo)}
                          {p.ciclo === "anual" ? "/ano" : "/mês"}
                        </p>
                      </div>
                      <span className={`justify-self-start rounded-full px-2.5 py-1 text-xs font-semibold sm:justify-self-end ${COR_STATUS[p.status]}`}>
                        {statusLabel(p.status)}
                      </span>
                    </summary>
                    <div className="grid gap-6 border-t border-white/[0.08] p-4 text-sm sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                      <dl className="space-y-1.5">
                        <div><dt className="inline text-ink-muted">{p.escritorio.tipoDocumento.toUpperCase()}: </dt><dd className="inline font-mono">{p.escritorio.documento}</dd></div>
                        <div><dt className="inline text-ink-muted">OAB: </dt><dd className="inline">{p.escritorio.oab}</dd></div>
                        <div><dt className="inline text-ink-muted">E-mail: </dt><dd className="inline"><a className="text-accent hover:underline" href={`mailto:${p.escritorio.email}`}>{p.escritorio.email}</a></dd></div>
                        <div><dt className="inline text-ink-muted">WhatsApp: </dt><dd className="inline"><a className="text-accent hover:underline" href={`https://wa.me/55${p.escritorio.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{p.escritorio.whatsapp}</a></dd></div>
                      </dl>
                      <dl className="space-y-1.5">
                        <div><dt className="inline text-ink-muted">Usuários adicionais: </dt><dd className="inline">{p.usuariosAdicionais}</dd></div>
                        <div><dt className="inline text-ink-muted">Total mensal: </dt><dd className="inline">{formatarBRL(p.preco.totalMensal)}</dd></div>
                        {p.preco.economia > 0 && <div><dt className="inline text-ink-muted">Economia anual: </dt><dd className="inline">{formatarBRL(p.preco.economia)}</dd></div>}
                        <div><dt className="inline text-ink-muted">Sistema atual: </dt><dd className="inline">{p.migracao.sistemaAtual}{faixa ? ` · ${faixa}` : ""}</dd></div>
                        <div><dt className="inline text-ink-muted">Migração: </dt><dd className="inline">{migracaoTexto(p.preco)}</dd></div>
                        <div><dt className="inline text-ink-muted">Pagamento: </dt><dd className="inline">{p.pagamento.provedor} ({p.pagamento.status})</dd></div>
                      </dl>
                      <div className="space-y-4">
                        <p className="whitespace-pre-wrap text-ink-muted">{p.observacoes || "Sem observações."}</p>
                        <form action={mudarStatus} className="flex gap-2">
                          <input type="hidden" name="numero" value={p.numero} />
                          <label htmlFor={`status-${p.numero}`} className="sr-only">
                            Status do pedido {p.numero}
                          </label>
                          <select id={`status-${p.numero}`} name="status" defaultValue={p.status} className="input !py-2">
                            {STATUS_PEDIDO.map((s) => (
                              <option key={s.id} value={s.id} className="bg-base-alt">
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="btn-primary !py-2">
                            Salvar
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
