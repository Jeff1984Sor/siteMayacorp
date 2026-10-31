import { NextResponse } from "next/server";
import { getPlano } from "@/content/mayajus-planos";
import { mascararDocumento, mascararTelefone, tipoDocumento } from "@/lib/documento";
import { destinatario, enviarEmail, smtpConfigurado } from "@/lib/mail";
import { emailCliente, emailInterno } from "@/lib/mayajus-emails";
import { faixaDoPedido, pedidoSchema } from "@/lib/mayajus-pedido-schema";
import { calcularPedido } from "@/lib/mayajus-preco";
import { getPaymentProvider } from "@/lib/pagamento";
import { getPedidoStore } from "@/lib/pedidos/store";
import type { NovoPedido } from "@/lib/pedidos/tipos";
import { rateLimit } from "@/lib/rate-limit";
import { EMAIL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconhecido";
}

export async function POST(req: Request) {
  const limite = rateLimit(`pedido:${clientIp(req)}`);
  if (!limite.ok) {
    return NextResponse.json(
      { ok: false, error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(limite.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot preenchido: responde sucesso sem registrar nada.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true, numero: null });
  }

  const parsed = pedidoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Verifique os campos.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const plano = getPlano(d.plano);
  if (!plano) return NextResponse.json({ ok: false, error: "Plano inválido." }, { status: 400 });

  // O preço é SEMPRE recalculado aqui — nenhum valor vindo do navegador é usado.
  const faixa = faixaDoPedido(d);
  const preco = calcularPedido({ plano, ciclo: d.ciclo, usuariosAdicionais: d.usuariosAdicionais, faixaProcessos: faixa });

  const base: Omit<NovoPedido, "pagamento"> = {
    status: "novo",
    plano: plano.id,
    planoNome: plano.nome,
    ciclo: d.ciclo,
    usuariosAdicionais: d.usuariosAdicionais,
    preco,
    escritorio: {
      razaoSocial: d.razaoSocial,
      documento: mascararDocumento(d.documento),
      tipoDocumento: tipoDocumento(d.documento) === "cnpj" ? "cnpj" : "cpf",
      oab: `${d.oabNumero.toUpperCase()}/${d.oabUf}`,
      municipio: d.municipio,
      municipioUf: d.municipioUf,
      responsavel: d.responsavel,
      email: d.email.toLowerCase(),
      whatsapp: mascararTelefone(d.whatsapp),
    },
    migracao: {
      sistemaAtual: d.sistemaAtual === "Outro" && d.sistemaOutro ? `Outro: ${d.sistemaOutro}` : d.sistemaAtual,
      faixaProcessos: faixa,
    },
    observacoes: d.observacoes || "",
  };

  let pedido;
  try {
    const pagamento = await getPaymentProvider().iniciar(base as NovoPedido);
    const store = await getPedidoStore();
    pedido = await store.criar({ ...base, pagamento });
  } catch (err) {
    console.error("[mayajus] falha ao registrar pedido:", err);
    return NextResponse.json(
      { ok: false, error: `Não conseguimos registrar o pedido agora. Tente de novo ou escreva para ${EMAIL}.` },
      { status: 500 },
    );
  }

  let emailEnviado = false;
  if (smtpConfigurado()) {
    const interno = emailInterno(pedido);
    const cliente = emailCliente(pedido);
    const [rInterno, rCliente] = await Promise.allSettled([
      enviarEmail({ to: destinatario(), replyTo: pedido.escritorio.email, ...interno }),
      enviarEmail({ to: pedido.escritorio.email, replyTo: EMAIL, ...cliente }),
    ]);
    if (rInterno.status === "rejected") console.error(`[mayajus] e-mail interno ${pedido.numero}:`, rInterno.reason);
    if (rCliente.status === "rejected") console.error(`[mayajus] e-mail do cliente ${pedido.numero}:`, rCliente.reason);
    emailEnviado = rCliente.status === "fulfilled";
  } else {
    console.warn(`[mayajus] SMTP não configurado — pedido ${pedido.numero} salvo sem envio de e-mail.`);
  }

  return NextResponse.json({ ok: true, numero: pedido.numero, emailEnviado });
}
