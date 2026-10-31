"use client";

import { useActionState } from "react";
import { Loader, Lock } from "lucide-react";
import { entrar } from "@/app/admin/pedidos/actions";

export function LoginForm() {
  const [estado, acao, pendente] = useActionState(entrar, undefined);
  return (
    <form action={acao} className="glass mx-auto mt-10 max-w-sm rounded-3xl p-6 sm:p-8">
      <span className="bg-gradient-primary grid h-12 w-12 place-items-center rounded-xl text-white">
        <Lock className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-semibold">Pedidos MayaJus</h1>
      <p className="mt-1 text-sm text-ink-muted">Área restrita da equipe.</p>
      <label htmlFor="senha" className="mb-1.5 mt-6 block text-sm font-medium">
        Senha
      </label>
      <input
        id="senha"
        name="senha"
        type="password"
        autoComplete="current-password"
        required
        className="input"
        aria-invalid={!!estado?.erro || undefined}
        aria-describedby={estado?.erro ? "erro-senha" : undefined}
      />
      {estado?.erro && (
        <p id="erro-senha" role="alert" className="mt-1.5 text-xs text-rose-300">
          {estado.erro}
        </p>
      )}
      <button type="submit" className="btn-primary mt-6 w-full" disabled={pendente}>
        {pendente ? <Loader className="h-4 w-4 animate-spin" aria-hidden /> : null} Entrar
      </button>
    </form>
  );
}
