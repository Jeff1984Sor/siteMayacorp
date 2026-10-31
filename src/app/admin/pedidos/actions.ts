"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, isAdmin, senhaCorreta, tokenAdmin } from "@/lib/admin-auth";
import { getPedidoStore } from "@/lib/pedidos/store";
import { isStatusPedido } from "@/lib/pedidos/tipos";
import { rateLimit } from "@/lib/rate-limit";

export async function entrar(_: { erro?: string } | undefined, form: FormData): Promise<{ erro?: string }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "desconhecido";
  if (!rateLimit(`admin:${ip}`).ok) return { erro: "Muitas tentativas. Aguarde alguns minutos." };

  if (!senhaCorreta(String(form.get("senha") ?? ""))) return { erro: "Senha incorreta." };

  (await cookies()).set(ADMIN_COOKIE, tokenAdmin(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  redirect("/admin/pedidos");
}

export async function sair() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/pedidos");
}

export async function mudarStatus(form: FormData) {
  if (!(await isAdmin())) redirect("/admin/pedidos");
  const numero = String(form.get("numero") ?? "");
  const status = form.get("status");
  if (!numero || !isStatusPedido(status)) return;
  const store = await getPedidoStore();
  await store.atualizarStatus(numero, status);
  revalidatePath("/admin/pedidos");
}
