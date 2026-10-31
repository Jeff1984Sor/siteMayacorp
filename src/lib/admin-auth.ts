import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mc_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12;

export function adminConfigurado(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

/** Token do cookie: HMAC da senha (trocar ADMIN_PASSWORD derruba todas as sessões). */
export function tokenAdmin(): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update("mayacorp-admin-v1").digest("hex");
}

function iguais(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function senhaCorreta(senha: string): boolean {
  return adminConfigurado() && iguais(senha, process.env.ADMIN_PASSWORD as string);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigurado()) return false;
  const valor = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!valor && iguais(valor, tokenAdmin());
}
