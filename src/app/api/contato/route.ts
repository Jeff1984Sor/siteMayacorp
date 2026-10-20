import { NextResponse } from "next/server";
import { contatoSchema } from "@/lib/contato-schema";
import { interesseLabel } from "@/content/interesses";
import { rateLimit } from "@/lib/rate-limit";
import { destinatario, enviarEmail, escapeHtml, smtpConfigurado } from "@/lib/mail";
import { EMAIL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconhecido";
}

export async function POST(req: Request) {
  const limite = rateLimit(clientIp(req));
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

  // Honeypot preenchido: responde sucesso sem enviar nada.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contatoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Verifique os campos.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!smtpConfigurado()) {
    return NextResponse.json({ ok: false, fallback: "mailto" }, { status: 503 });
  }

  const d = parsed.data;
  const interesse = interesseLabel(d.interesse);
  const subject = `[Site] ${interesse} — ${d.nome}`;

  const linhas: [string, string][] = [
    ["Nome", d.nome],
    ["E-mail", d.email],
    ["Telefone/WhatsApp", d.telefone || "—"],
    ["Empresa", d.empresa],
    ["Interesse", interesse],
  ];

  const text = `${linhas.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMensagem:\n${d.mensagem}`;
  const html = `
    <h2 style="font-family:Arial,sans-serif">Novo contato pelo site</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${linhas
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#555"><strong>${k}</strong></td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px"><strong>Mensagem:</strong></p>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(d.mensagem)}</p>`;

  try {
    await enviarEmail({ to: destinatario(), subject, text, html, replyTo: d.email });
  } catch (err) {
    console.error("[contato] falha ao enviar e-mail:", err);
    return NextResponse.json({ ok: false, fallback: "mailto" }, { status: 502 });
  }

  if (process.env.CONTACT_AUTOREPLY === "true") {
    const primeiroNome = d.nome.split(" ")[0];
    enviarEmail({
      to: d.email,
      subject: "Recebemos sua mensagem — MayaCorp",
      replyTo: EMAIL,
      text: `Olá, ${primeiroNome}!\n\nRecebemos sua mensagem sobre "${interesse}" e vamos responder em breve.\n\nEquipe MayaCorp\n${EMAIL}`,
      html: `<p style="font-family:Arial,sans-serif;font-size:14px">Olá, ${escapeHtml(primeiroNome)}!</p>
        <p style="font-family:Arial,sans-serif;font-size:14px">Recebemos sua mensagem sobre <strong>${escapeHtml(interesse)}</strong> e vamos responder em breve.</p>
        <p style="font-family:Arial,sans-serif;font-size:14px">Equipe MayaCorp<br><a href="mailto:${EMAIL}">${EMAIL}</a></p>`,
    }).catch((err) => console.error("[contato] falha na resposta automática:", err));
  }

  return NextResponse.json({ ok: true });
}
