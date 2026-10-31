"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader, Lock, Minus, Plus, ShieldCheck } from "lucide-react";
import { CicloToggle } from "@/components/mayajus/planos";
import { MAYAJUS_ACCENT as A, PROXIMOS_PASSOS } from "@/content/mayajus";
import {
  FAIXAS_PROCESSOS,
  PLANO_DESTAQUE,
  PLANOS,
  PRECO_USUARIO_ADICIONAL,
  SISTEMAS_ATUAIS,
  getPlano,
  type Ciclo,
  type FaixaProcessos,
  type PlanoId,
} from "@/content/mayajus-planos";
import { mascararDocumento, mascararTelefone } from "@/lib/documento";
import { CAMPOS_POR_PASSO, MAX_ADICIONAIS, UFS, pedidoSchema } from "@/lib/mayajus-pedido-schema";
import { calcularPedido, formatarBRL, mensalEquivalente, migracaoTexto } from "@/lib/mayajus-preco";
import { EMAIL } from "@/lib/site";

type Campos = {
  plano: PlanoId;
  ciclo: Ciclo;
  usuariosAdicionais: number;
  razaoSocial: string;
  documento: string;
  oabNumero: string;
  oabUf: string;
  municipio: string;
  municipioUf: string;
  responsavel: string;
  email: string;
  whatsapp: string;
  sistemaAtual: string;
  sistemaOutro: string;
  faixaProcessos: string;
  observacoes: string;
  aceite: boolean;
  website: string;
};

type Erros = Partial<Record<keyof Campos, string>>;

const PASSOS = ["Plano", "Escritório", "Confirmação"];

export type CheckoutInicial = { plano?: PlanoId; ciclo?: Ciclo; adicionais?: number };

function errosDoPasso(c: Campos, passo: number): Erros {
  const erros: Erros = {};
  const r = pedidoSchema.safeParse(c);
  if (!r.success) {
    const f = r.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    for (const k of CAMPOS_POR_PASSO[passo]) if (f[k]?.[0]) erros[k] = f[k]![0];
  }
  // As regras condicionais do schema só rodam quando o resto é válido; checamos aqui também.
  if (passo === 2) {
    if (c.sistemaAtual === "Outro" && !c.sistemaOutro.trim()) erros.sistemaOutro = "Qual sistema você usa?";
    if (c.sistemaAtual && c.sistemaAtual !== "Nenhum" && !c.faixaProcessos)
      erros.faixaProcessos = "Selecione a quantidade aproximada.";
  }
  return erros;
}

export function Checkout({ inicial }: { inicial: CheckoutInicial }) {
  const reduzir = useReducedMotion();
  const topo = useRef<HTMLDivElement>(null);
  const [passo, setPasso] = useState(0);
  const [direcao, setDirecao] = useState(1);
  const [erros, setErros] = useState<Erros>({});
  const [status, setStatus] = useState<"idle" | "enviando" | "erro">("idle");
  const [mensagemErro, setMensagemErro] = useState("");
  const [sucesso, setSucesso] = useState<{ numero: string | null; emailEnviado: boolean } | null>(null);
  const [c, setC] = useState<Campos>({
    plano: inicial.plano ?? PLANO_DESTAQUE,
    ciclo: inicial.ciclo ?? "anual",
    usuariosAdicionais: Math.min(MAX_ADICIONAIS, Math.max(0, inicial.adicionais ?? 0)),
    razaoSocial: "",
    documento: "",
    oabNumero: "",
    oabUf: "",
    municipio: "",
    municipioUf: "",
    responsavel: "",
    email: "",
    whatsapp: "",
    sistemaAtual: "",
    sistemaOutro: "",
    faixaProcessos: "",
    observacoes: "",
    aceite: false,
    website: "",
  });

  const plano = getPlano(c.plano) ?? PLANOS[0];
  const faixa =
    c.sistemaAtual && c.sistemaAtual !== "Nenhum" && c.faixaProcessos ? (c.faixaProcessos as FaixaProcessos) : null;
  const preco = useMemo(
    () => calcularPedido({ plano, ciclo: c.ciclo, usuariosAdicionais: c.usuariosAdicionais, faixaProcessos: faixa }),
    [plano, c.ciclo, c.usuariosAdicionais, faixa],
  );

  const set = <K extends keyof Campos>(k: K, v: Campos[K]) => {
    setC((atual) => ({ ...atual, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };
  const onText = (k: keyof Campos, mascara?: (v: string) => string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    set(k, (mascara ? mascara(e.target.value) : e.target.value) as never);

  const irPara = (n: number) => {
    setDirecao(n > passo ? 1 : -1);
    setPasso(n);
    requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" }));
  };

  const focarPrimeiroErro = (e: Erros) => {
    const primeiro = Object.keys(e)[0];
    if (primeiro) setTimeout(() => document.getElementById(`campo-${primeiro}`)?.focus(), 50);
  };

  const avancar = () => {
    const e = errosDoPasso(c, passo);
    setErros(e);
    if (Object.keys(e).length) return focarPrimeiroErro(e);
    irPara(passo + 1);
  };

  async function enviar() {
    const e = errosDoPasso(c, 2);
    setErros(e);
    if (Object.keys(e).length) return focarPrimeiroErro(e);

    setStatus("enviando");
    setMensagemErro("");
    try {
      const res = await fetch("/api/mayajus/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        numero?: string | null;
        emailEnviado?: boolean;
        error?: string;
        fields?: Record<string, string[]>;
      };
      if (res.ok && data.ok) {
        setSucesso({ numero: data.numero ?? null, emailEnviado: !!data.emailEnviado });
        requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" }));
        return;
      }
      if (data.fields) {
        const novos: Erros = Object.fromEntries(Object.entries(data.fields).map(([k, v]) => [k, v?.[0]]));
        setErros(novos);
        const passoComErro = CAMPOS_POR_PASSO.findIndex((campos) => campos.some((k) => novos[k]));
        if (passoComErro >= 0 && passoComErro !== passo) irPara(passoComErro);
        focarPrimeiroErro(novos);
      }
      setMensagemErro(data.error || "Não foi possível enviar agora.");
      setStatus("erro");
    } catch {
      setMensagemErro("Sem conexão no momento.");
      setStatus("erro");
      return;
    }
    setStatus((s) => (s === "enviando" ? "idle" : s));
  }

  const aria = (k: keyof Campos) => ({
    id: `campo-${k}`,
    name: k,
    "aria-invalid": !!erros[k] || undefined,
    "aria-describedby": erros[k] ? `erro-${k}` : undefined,
  });
  const erro = (k: keyof Campos) =>
    erros[k] ? (
      <p id={`erro-${k}`} className="mt-1.5 text-xs text-rose-300">
        {erros[k]}
      </p>
    ) : null;
  const Label = ({ k, children, opcional }: { k: keyof Campos; children: React.ReactNode; opcional?: boolean }) => (
    <label htmlFor={`campo-${k}`} className="mb-1.5 block text-sm font-medium">
      {children} {opcional && <span className="font-normal text-ink-muted">(opcional)</span>}
    </label>
  );

  if (sucesso) return <Sucesso numero={sucesso.numero} emailEnviado={sucesso.emailEnviado} email={c.email} refTopo={topo} />;

  const variantes = {
    entra: (d: number) => ({ opacity: 0, x: reduzir ? 0 : d * 40 }),
    centro: { opacity: 1, x: 0 },
    sai: (d: number) => ({ opacity: 0, x: reduzir ? 0 : d * -40 }),
  };

  return (
    <div ref={topo} className="scroll-mt-24">
      {/* Stepper */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Etapas da contratação">
        {PASSOS.map((nome, i) => {
          const feito = i < passo;
          const atual = i === passo;
          return (
            <li key={nome} aria-current={atual ? "step" : undefined}>
              <button
                type="button"
                disabled={i > passo}
                onClick={() => i < passo && irPara(i)}
                className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
              >
                <span className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${A}, #FDE68A)` }}
                    animate={{ width: feito || atual ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition"
                    style={
                      feito || atual
                        ? { background: A, color: "#0A0F1E" }
                        : { border: "1px solid rgba(255,255,255,.2)", color: "#94A3B8" }
                    }
                  >
                    {feito ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                  </span>
                  <span className={atual ? "font-semibold text-ink" : "text-ink-muted"}>{nome}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (passo < 2) avancar();
            else enviar();
          }}
          className="glass relative overflow-hidden rounded-3xl p-5 sm:p-8"
        >
          <AnimatePresence mode="wait" custom={direcao} initial={false}>
            <motion.div
              key={passo}
              custom={direcao}
              variants={variantes}
              initial="entra"
              animate="centro"
              exit="sai"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {passo === 0 && (
                <fieldset>
                  <legend className="font-display text-2xl font-semibold">Escolha o plano</legend>
                  <div className="mt-5">
                    <CicloToggle id="ciclo-checkout" ciclo={c.ciclo} onChange={(v) => set("ciclo", v)} />
                  </div>
                  <div role="radiogroup" aria-label="Plano" className="mt-6 grid gap-3 sm:grid-cols-2">
                    {PLANOS.map((p) => {
                      const ativo = c.plano === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={ativo}
                          id={ativo ? "campo-plano" : undefined}
                          onClick={() => set("plano", p.id)}
                          className={`relative rounded-2xl border p-4 text-left transition ${ativo ? "bg-white/[0.06]" : "border-white/10 hover:border-white/25"}`}
                          style={ativo ? { borderColor: A, boxShadow: `0 0 0 1px ${A}` } : undefined}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-semibold">{p.nome}</span>
                            <span
                              className="grid h-5 w-5 place-items-center rounded-full border transition"
                              style={ativo ? { background: A, borderColor: A, color: "#0A0F1E" } : { borderColor: "rgba(255,255,255,.25)" }}
                            >
                              {ativo && <Check className="h-3 w-3" aria-hidden />}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs text-ink-muted">
                            {p.usuariosIncluidos === 1 ? "1 usuário" : `até ${p.usuariosIncluidos} usuários`} ·{" "}
                            {p.notasIncluidas === null ? "notas ilimitadas" : `${p.notasIncluidas} notas/mês`}
                          </span>
                          <span className="mt-3 block font-display text-xl font-semibold">
                            {formatarBRL(mensalEquivalente(p, c.ciclo))}
                            <span className="text-sm font-normal text-ink-muted">/mês</span>
                          </span>
                          {p.selo && (
                            <span className="absolute -top-2.5 right-4 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: A, color: "#0A0F1E" }}>
                              {p.selo}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p id="label-adicionais" className="text-sm font-medium">
                        Usuários adicionais
                      </p>
                      <p className="text-xs text-ink-muted">
                        {plano.usuariosIncluidos === 1 ? "1 usuário incluso" : `${plano.usuariosIncluidos} usuários inclusos`} · cada adicional{" "}
                        {formatarBRL(PRECO_USUARIO_ADICIONAL)}/mês
                      </p>
                    </div>
                    <div className="flex items-center gap-2" role="group" aria-labelledby="label-adicionais">
                      <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 transition hover:bg-white/10 disabled:opacity-40"
                        onClick={() => set("usuariosAdicionais", Math.max(0, c.usuariosAdicionais - 1))}
                        disabled={c.usuariosAdicionais <= 0}
                        aria-label="Remover um usuário adicional"
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <input
                        {...aria("usuariosAdicionais")}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={MAX_ADICIONAIS}
                        value={c.usuariosAdicionais}
                        onChange={(e) => set("usuariosAdicionais", Math.min(MAX_ADICIONAIS, Math.max(0, Math.floor(Number(e.target.value) || 0))))}
                        className="input w-20 text-center font-display text-lg font-semibold tabular-nums"
                        aria-label="Quantidade de usuários adicionais"
                      />
                      <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 transition hover:bg-white/10 disabled:opacity-40"
                        onClick={() => set("usuariosAdicionais", Math.min(MAX_ADICIONAIS, c.usuariosAdicionais + 1))}
                        disabled={c.usuariosAdicionais >= MAX_ADICIONAIS}
                        aria-label="Adicionar um usuário adicional"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                  {erro("usuariosAdicionais")}
                </fieldset>
              )}

              {passo === 1 && (
                <fieldset className="grid gap-5 sm:grid-cols-2">
                  <legend className="mb-5 font-display text-2xl font-semibold sm:col-span-2">Dados do escritório</legend>
                  <div className="sm:col-span-2">
                    <Label k="razaoSocial">Razão social ou nome do advogado</Label>
                    <input {...aria("razaoSocial")} className="input" autoComplete="organization" value={c.razaoSocial} onChange={onText("razaoSocial")} />
                    {erro("razaoSocial")}
                  </div>
                  <div>
                    <Label k="documento">CNPJ ou CPF</Label>
                    <input
                      {...aria("documento")}
                      className="input font-mono"
                      inputMode="text"
                      autoCapitalize="characters"
                      placeholder="00.000.000/0000-00"
                      value={c.documento}
                      onChange={onText("documento", mascararDocumento)}
                    />
                    {erro("documento")}
                  </div>
                  <div className="grid grid-cols-[1fr_96px] gap-3">
                    <div>
                      <Label k="oabNumero">Nº da OAB</Label>
                      <input {...aria("oabNumero")} className="input" inputMode="numeric" value={c.oabNumero} onChange={onText("oabNumero")} />
                    </div>
                    <div>
                      <Label k="oabUf">UF</Label>
                      <select
                        {...aria("oabUf")}
                        className="input px-3"
                        value={c.oabUf}
                        onChange={(e) => {
                          set("oabUf", e.target.value);
                          if (!c.municipioUf) set("municipioUf", e.target.value);
                        }}
                      >
                        <option value="" disabled>
                          —
                        </option>
                        {UFS.map((u) => (
                          <option key={u} value={u} className="bg-base-alt">
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 -mt-2">
                      {erro("oabNumero")}
                      {erro("oabUf")}
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_96px] gap-3 sm:col-span-2">
                    <div>
                      <Label k="municipio">Município do escritório</Label>
                      <input {...aria("municipio")} className="input" autoComplete="address-level2" value={c.municipio} onChange={onText("municipio")} />
                    </div>
                    <div>
                      <Label k="municipioUf">UF</Label>
                      <select {...aria("municipioUf")} className="input px-3" value={c.municipioUf} onChange={onText("municipioUf")}>
                        <option value="" disabled>
                          —
                        </option>
                        {UFS.map((u) => (
                          <option key={u} value={u} className="bg-base-alt">
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 -mt-2">
                      {erro("municipio")}
                      {erro("municipioUf")}
                      <p className="mt-1.5 text-xs text-ink-muted">É por ele que configuramos a emissão da NFS-e na sua prefeitura.</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label k="responsavel">Nome do responsável</Label>
                    <input {...aria("responsavel")} className="input" autoComplete="name" value={c.responsavel} onChange={onText("responsavel")} />
                    {erro("responsavel")}
                  </div>
                  <div>
                    <Label k="email">E-mail</Label>
                    <input {...aria("email")} type="email" className="input" autoComplete="email" value={c.email} onChange={onText("email")} />
                    {erro("email")}
                  </div>
                  <div>
                    <Label k="whatsapp">WhatsApp</Label>
                    <input
                      {...aria("whatsapp")}
                      type="tel"
                      className="input"
                      autoComplete="tel-national"
                      placeholder="(11) 91234-5678"
                      value={c.whatsapp}
                      onChange={onText("whatsapp", mascararTelefone)}
                    />
                    {erro("whatsapp")}
                  </div>
                </fieldset>
              )}

              {passo === 2 && (
                <fieldset className="grid gap-5">
                  <legend className="mb-5 font-display text-2xl font-semibold">Migração e confirmação</legend>
                  <div>
                    <Label k="sistemaAtual">Já usa algum sistema?</Label>
                    <select {...aria("sistemaAtual")} className="input" value={c.sistemaAtual} onChange={onText("sistemaAtual")}>
                      <option value="" disabled>
                        Selecione…
                      </option>
                      {SISTEMAS_ATUAIS.map((s) => (
                        <option key={s} value={s} className="bg-base-alt">
                          {s}
                        </option>
                      ))}
                    </select>
                    {erro("sistemaAtual")}
                  </div>
                  {c.sistemaAtual === "Outro" && (
                    <div>
                      <Label k="sistemaOutro">Qual sistema?</Label>
                      <input {...aria("sistemaOutro")} className="input" value={c.sistemaOutro} onChange={onText("sistemaOutro")} />
                      {erro("sistemaOutro")}
                    </div>
                  )}
                  {c.sistemaAtual && c.sistemaAtual !== "Nenhum" && (
                    <div role="radiogroup" aria-labelledby="label-faixa" aria-describedby={erros.faixaProcessos ? "erro-faixaProcessos" : undefined}>
                      <p id="label-faixa" className="mb-2 text-sm font-medium">
                        Quantidade aproximada de processos
                      </p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {FAIXAS_PROCESSOS.map((f, i) => {
                          const ativo = c.faixaProcessos === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              role="radio"
                              aria-checked={ativo}
                              id={i === 0 ? "campo-faixaProcessos" : undefined}
                              onClick={() => set("faixaProcessos", f.id)}
                              className={`rounded-xl border px-3 py-3 text-sm transition ${ativo ? "bg-white/[0.06] font-semibold" : "border-white/10 text-ink-muted hover:border-white/25"}`}
                              style={ativo ? { borderColor: A, color: "#F1F5F9" } : undefined}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                      {erro("faixaProcessos")}
                    </div>
                  )}
                  <div>
                    <Label k="observacoes" opcional>
                      Observações
                    </Label>
                    <textarea
                      {...aria("observacoes")}
                      rows={4}
                      className="input resize-y"
                      placeholder="Algo que a gente precisa saber? Ex.: melhor horário para contato, prefeitura, contador."
                      value={c.observacoes}
                      onChange={onText("observacoes")}
                    />
                    {erro("observacoes")}
                  </div>
                  <div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-4 text-sm leading-relaxed">
                      <input
                        {...aria("aceite")}
                        type="checkbox"
                        checked={c.aceite}
                        onChange={(e) => set("aceite", e.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-gold"
                      />
                      <span className="text-ink-muted">
                        Li e aceito os{" "}
                        <Link href="/produtos/mayajus/termos" target="_blank" className="text-ink underline underline-offset-2">
                          Termos de Contratação
                        </Link>{" "}
                        e a{" "}
                        <Link href="/privacidade" target="_blank" className="text-ink underline underline-offset-2">
                          Política de Privacidade
                        </Link>
                        .
                      </span>
                    </label>
                    {erro("aceite")}
                  </div>
                </fieldset>
              )}
            </motion.div>
          </AnimatePresence>

          {/* honeypot */}
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="campo-website">Site</label>
            <input id="campo-website" name="website" tabIndex={-1} autoComplete="off" value={c.website} onChange={onText("website")} />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
            {passo > 0 ? (
              <button type="button" onClick={() => irPara(passo - 1)} className="btn-secondary">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
              </button>
            ) : (
              <Link href="/produtos/mayajus#planos" className="btn-secondary">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Ver planos
              </Link>
            )}
            {passo < 2 ? (
              <button type="submit" className="btn-gold">
                Continuar <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <button type="submit" className="btn-gold" disabled={status === "enviando"}>
                {status === "enviando" ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" aria-hidden /> Enviando…
                  </>
                ) : (
                  <>
                    Confirmar contratação <Check className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
            )}
          </div>
          {status === "erro" && (
            <p role="alert" className="mt-4 text-sm text-rose-300">
              {mensagemErro} Se preferir, escreva para{" "}
              <a className="underline" href={`mailto:${EMAIL}?subject=${encodeURIComponent("[MayaJus] Contratação")}`}>
                {EMAIL}
              </a>
              .
            </p>
          )}
        </form>

        <Resumo
          planoNome={plano.nome}
          ciclo={c.ciclo}
          adicionais={c.usuariosAdicionais}
          preco={preco}
          mostrarMigracao={c.sistemaAtual === "Nenhum" || faixa !== null}
        />
      </div>
    </div>
  );
}

function Linha({ k, v, destaque, verde }: { k: React.ReactNode; v: React.ReactNode; destaque?: boolean; verde?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${destaque ? "pt-3" : ""}`}>
      <dt className={destaque ? "font-semibold text-ink" : "text-ink-muted"}>{k}</dt>
      <dd
        className={`text-right tabular-nums ${destaque ? "font-display text-2xl font-semibold" : "font-medium"} ${verde ? "text-emerald-300" : ""}`}
        style={destaque ? { color: A } : undefined}
      >
        {v}
      </dd>
    </div>
  );
}

function Resumo({
  planoNome,
  ciclo,
  adicionais,
  preco,
  mostrarMigracao,
}: {
  planoNome: string;
  ciclo: Ciclo;
  adicionais: number;
  preco: ReturnType<typeof calcularPedido>;
  mostrarMigracao: boolean;
}) {
  return (
    <aside aria-label="Resumo do pedido" className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-3xl border bg-base-alt p-6" style={{ borderColor: `${A}55` }}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-[70px]" style={{ background: A }} aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Resumo do pedido</p>
        <p className="mt-2 font-display text-2xl font-semibold">
          MayaJus <span style={{ color: A }}>{planoNome}</span>
        </p>
        <p className="text-sm text-ink-muted">{ciclo === "anual" ? "Plano anual" : "Plano mensal, sem fidelidade"}</p>

        <dl className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-5 text-sm" aria-live="polite">
          <Linha k={`Plano ${ciclo === "anual" ? "(ano)" : "(mês)"}`} v={formatarBRL(preco.valorPlano)} />
          {adicionais > 0 && <Linha k={`${adicionais} usuário(s) adicional(is)`} v={formatarBRL(preco.valorAdicionais)} />}
          {ciclo === "anual" ? (
            <>
              <Linha k="Total do ano" v={formatarBRL(preco.totalCiclo)} />
              {preco.economia > 0 && <Linha k="Você economiza" v={formatarBRL(preco.economia)} verde />}
              <div className="border-t border-white/[0.08]" />
              <Linha k="Equivale a" v={`${formatarBRL(preco.totalMensal)}/mês`} destaque />
            </>
          ) : (
            <>
              <div className="border-t border-white/[0.08]" />
              <Linha k="Total mensal" v={formatarBRL(preco.totalMensal)} destaque />
            </>
          )}
          {mostrarMigracao && (
            <div className="pt-2">
              <Linha k="Migração (única vez)" v={migracaoTexto(preco)} verde={preco.migracaoStatus === "gratis"} />
            </div>
          )}
        </dl>

        <ul className="mt-6 space-y-2 border-t border-white/[0.08] pt-5 text-xs text-ink-muted">
          <li className="flex gap-2">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: A }} aria-hidden />
            Nada é cobrado agora: o link de pagamento chega depois do nosso contato.
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: A }} aria-hidden />
            Troque de plano quando quiser.
          </li>
        </ul>
      </div>
    </aside>
  );
}

function Sucesso({
  numero,
  emailEnviado,
  email,
  refTopo,
}: {
  numero: string | null;
  emailEnviado: boolean;
  email: string;
  refTopo: React.RefObject<HTMLDivElement | null>;
}) {
  const reduzir = useReducedMotion();
  return (
    <div ref={refTopo} className="scroll-mt-24" role="status" aria-live="polite">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl border bg-base-alt p-6 text-center sm:p-12"
        style={{ borderColor: `${A}55` }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: `radial-gradient(60% 50% at 50% 0%, ${A}22, transparent)` }} />
        {/* faíscas douradas */}
        {!reduzir &&
          Array.from({ length: 14 }).map((_, i) => {
            const ang = (i / 14) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                aria-hidden
                className="absolute left-1/2 top-[88px] h-2 w-2 rounded-full sm:top-[112px]"
                style={{ background: i % 2 ? A : "#FDE68A" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(ang) * 120, y: Math.sin(ang) * 90, opacity: 0, scale: 0.4 }}
                transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
              />
            );
          })}
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          {!reduzir && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: A }}
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.4, repeat: 2, delay: 0.2 }}
            />
          )}
          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
            className="grid h-20 w-20 place-items-center rounded-full text-[#0A0F1E]"
            style={{ background: `linear-gradient(135deg, ${A}, #FDE68A)` }}
          >
            <Check className="h-10 w-10" strokeWidth={3} aria-hidden />
          </motion.span>
        </div>
        <h2 className="relative mt-8 text-3xl font-bold sm:text-4xl">Pedido recebido!</h2>
        {numero && (
          <p className="relative mt-4">
            <span className="text-sm text-ink-muted">Número do pedido</span>
            <span className="mt-1 block font-mono text-2xl font-bold tracking-wider sm:text-3xl" style={{ color: A }}>
              {numero}
            </span>
          </p>
        )}
        <p className="relative mx-auto mt-4 max-w-md text-ink-muted">
          {emailEnviado
            ? `Enviamos a confirmação para ${email}. Nossa equipe fala com você em até 1 dia útil.`
            : "Nossa equipe fala com você em até 1 dia útil para confirmar os dados e enviar o link de pagamento."}
        </p>

        <ol className="relative mx-auto mt-10 max-w-xl space-y-0 text-left">
          {PROXIMOS_PASSOS.map((s, i) => (
            <motion.li
              key={s.titulo}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {i < PROXIMOS_PASSOS.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-white/10" aria-hidden />}
              <span
                className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold"
                style={i === 0 ? { background: A, color: "#0A0F1E" } : { border: "1px solid rgba(255,255,255,.2)", color: "#94A3B8" }}
              >
                {i === 0 ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              <span className="pt-1">
                <span className="block font-semibold">{s.titulo}</span>
                <span className="block text-sm text-ink-muted">{s.texto}</span>
              </span>
            </motion.li>
          ))}
        </ol>

        <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/produtos/mayajus" className="btn-secondary">
            Voltar para o MayaJus
          </Link>
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`[MayaJus] Pedido ${numero ?? ""}`)}`} className="btn-gold">
            Falar com a equipe
          </a>
        </div>
      </motion.div>
    </div>
  );
}
