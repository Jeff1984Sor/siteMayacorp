"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Loader, Mail, Send } from "lucide-react";
import { INTERESSES, interesseLabel, isInteresse } from "@/content/interesses";
import { contatoSchema } from "@/lib/contato-schema";
import { EMAIL } from "@/lib/site";

type Campos = {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  interesse: string;
  mensagem: string;
  website: string;
};

type Status = "idle" | "enviando" | "sucesso" | "mailto" | "erro";

const VAZIO: Campos = { nome: "", email: "", telefone: "", empresa: "", interesse: "", mensagem: "", website: "" };

/** Lê ?interesse=slug da URL — aceita tanto /?interesse=x#contato quanto /#contato?interesse=x. */
function interesseDaUrl(): string | null {
  const { search, hash } = window.location;
  const daQuery = new URLSearchParams(search).get("interesse");
  if (isInteresse(daQuery)) return daQuery;
  const q = hash.indexOf("?");
  if (q >= 0) {
    const doHash = new URLSearchParams(hash.slice(q + 1)).get("interesse");
    if (isInteresse(doHash)) return doHash;
  }
  return null;
}

function montarMailto(c: Campos): string {
  const subject = `[Site] ${interesseLabel(c.interesse)} — ${c.nome}`;
  const body = [
    `Nome: ${c.nome}`,
    `E-mail: ${c.email}`,
    `Telefone/WhatsApp: ${c.telefone || "—"}`,
    `Empresa: ${c.empresa}`,
    `Interesse: ${interesseLabel(c.interesse)}`,
    "",
    c.mensagem,
  ].join("\n");
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [campos, setCampos] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    const aplicar = () => {
      const i = interesseDaUrl();
      if (i) setCampos((c) => ({ ...c, interesse: i }));
    };
    aplicar();
    window.addEventListener("hashchange", aplicar);
    return () => window.removeEventListener("hashchange", aplicar);
  }, []);

  const set = (k: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCampos((c) => ({ ...c, [k]: e.target.value }));
    if (erros[k]) setErros((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = contatoSchema.safeParse(campos);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErros(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v?.[0]])) as typeof erros);
      const primeiro = Object.keys(f)[0];
      if (primeiro) document.getElementById(`campo-${primeiro}`)?.focus();
      return;
    }

    setStatus("enviando");
    setMensagemErro("");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campos),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; fallback?: string; error?: string };

      if (res.ok && data.ok) {
        setStatus("sucesso");
        setCampos(VAZIO);
        return;
      }
      if (data.fallback === "mailto") {
        window.location.href = montarMailto(campos);
        setStatus("mailto");
        return;
      }
      setMensagemErro(data.error || "Não foi possível enviar agora.");
      setStatus("erro");
    } catch {
      window.location.href = montarMailto(campos);
      setStatus("mailto");
    }
  }

  const campoErro = (k: keyof Campos) =>
    erros[k] ? (
      <p id={`erro-${k}`} className="mt-1.5 text-xs text-rose-300">
        {erros[k]}
      </p>
    ) : null;

  const aria = (k: keyof Campos) => ({
    id: `campo-${k}`,
    name: k,
    "aria-invalid": !!erros[k] || undefined,
    "aria-describedby": erros[k] ? `erro-${k}` : undefined,
  });

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "sucesso" || status === "mailto" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success"
            >
              {status === "sucesso" ? <CheckCircle className="h-8 w-8" aria-hidden /> : <Mail className="h-8 w-8" aria-hidden />}
            </motion.div>
            <h3 className="mt-6 text-2xl font-semibold">
              {status === "sucesso" ? "Mensagem enviada!" : "Quase lá!"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              {status === "sucesso"
                ? "Recebemos seu contato e vamos responder em breve."
                : `Abrimos seu aplicativo de e-mail com a mensagem pronta. É só enviar para ${EMAIL}.`}
            </p>
            <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-6">
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-5 sm:grid-cols-2"
          >
            <div>
              <label htmlFor="campo-nome" className="mb-1.5 block text-sm font-medium">
                Nome
              </label>
              <input {...aria("nome")} className="input" autoComplete="name" value={campos.nome} onChange={set("nome")} required />
              {campoErro("nome")}
            </div>
            <div>
              <label htmlFor="campo-email" className="mb-1.5 block text-sm font-medium">
                E-mail
              </label>
              <input
                {...aria("email")}
                type="email"
                className="input"
                autoComplete="email"
                value={campos.email}
                onChange={set("email")}
                required
              />
              {campoErro("email")}
            </div>
            <div>
              <label htmlFor="campo-telefone" className="mb-1.5 block text-sm font-medium">
                Telefone/WhatsApp <span className="font-normal text-ink-muted">(opcional)</span>
              </label>
              <input
                {...aria("telefone")}
                type="tel"
                className="input"
                autoComplete="tel"
                value={campos.telefone}
                onChange={set("telefone")}
              />
              {campoErro("telefone")}
            </div>
            <div>
              <label htmlFor="campo-empresa" className="mb-1.5 block text-sm font-medium">
                Empresa
              </label>
              <input
                {...aria("empresa")}
                className="input"
                autoComplete="organization"
                value={campos.empresa}
                onChange={set("empresa")}
                required
              />
              {campoErro("empresa")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="campo-interesse" className="mb-1.5 block text-sm font-medium">
                Interesse
              </label>
              <select {...aria("interesse")} className="input" value={campos.interesse} onChange={set("interesse")} required>
                <option value="" disabled>
                  Selecione…
                </option>
                {INTERESSES.map((i) => (
                  <option key={i.value} value={i.value} className="bg-base-alt">
                    {i.label}
                  </option>
                ))}
              </select>
              {campoErro("interesse")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="campo-mensagem" className="mb-1.5 block text-sm font-medium">
                Mensagem
              </label>
              <textarea
                {...aria("mensagem")}
                rows={5}
                className="input resize-y"
                placeholder="Conte o que você precisa: o processo, o problema e o que espera do sistema."
                value={campos.mensagem}
                onChange={set("mensagem")}
                required
              />
              {campoErro("mensagem")}
            </div>

            {/* honeypot */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="campo-website">Site</label>
              <input id="campo-website" name="website" tabIndex={-1} autoComplete="off" value={campos.website} onChange={set("website")} />
            </div>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-muted">
                Usamos seus dados só para responder ao contato.{" "}
                <a href="/privacidade" className="underline underline-offset-2 hover:text-ink">
                  Privacidade
                </a>
              </p>
              <button type="submit" className="btn-primary" disabled={status === "enviando"}>
                {status === "enviando" ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" aria-hidden /> Enviando…
                  </>
                ) : (
                  <>
                    Enviar mensagem <Send className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
            </div>
            {status === "erro" && (
              <p role="alert" className="text-sm text-rose-300 sm:col-span-2">
                {mensagemErro} Se preferir, escreva para{" "}
                <a className="underline" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
                .
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
