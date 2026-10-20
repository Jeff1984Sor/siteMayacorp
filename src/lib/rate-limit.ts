// Rate limit simples em memória (suficiente para uma única instância PM2).
const JANELA_MS = 10 * 60 * 1000;
const LIMITE = 5;

const hits = new Map<string, number[]>();

export function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const agora = Date.now();
  const recentes = (hits.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);

  if (recentes.length >= LIMITE) {
    hits.set(ip, recentes);
    return { ok: false, retryAfter: Math.ceil((JANELA_MS - (agora - recentes[0])) / 1000) };
  }

  recentes.push(agora);
  hits.set(ip, recentes);

  if (hits.size > 5000) {
    for (const [chave, ts] of hits) {
      if (ts.every((t) => agora - t >= JANELA_MS)) hits.delete(chave);
    }
  }
  return { ok: true, retryAfter: 0 };
}
