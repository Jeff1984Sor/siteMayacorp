// E-mails do pedido MayaJus: aviso interno (para a MayaCorp) e confirmação para o cliente.
// HTML em tabelas com estilos inline, para renderizar bem em Gmail, Outlook e celulares.
import { MAYAJUS_ACCENT, PROXIMOS_PASSOS } from "@/content/mayajus";
import { FAIXAS_PROCESSOS, PRECO_USUARIO_ADICIONAL } from "@/content/mayajus-planos";
import { escapeHtml } from "@/lib/mail";
import { formatarBRL, migracaoTexto } from "@/lib/mayajus-preco";
import { EMAIL, SITE_URL } from "@/lib/site";
import type { Pedido } from "@/lib/pedidos/tipos";

const cicloLabel = (c: Pedido["ciclo"]) => (c === "anual" ? "Anual" : "Mensal");

function linhasPreco(p: Pedido): [string, string][] {
  const { preco } = p;
  const linhas: [string, string][] = [
    [`Plano ${p.planoNome} (${cicloLabel(p.ciclo).toLowerCase()})`, formatarBRL(preco.valorPlano)],
  ];
  if (p.usuariosAdicionais > 0) {
    linhas.push([
      `${p.usuariosAdicionais} usuário(s) adicional(is) × ${formatarBRL(PRECO_USUARIO_ADICIONAL)}/mês`,
      formatarBRL(preco.valorAdicionais),
    ]);
  }
  if (p.ciclo === "anual") {
    linhas.push(["Total do ano", formatarBRL(preco.totalCiclo)]);
    linhas.push(["Equivale a", `${formatarBRL(preco.totalMensal)}/mês`]);
    if (preco.economia > 0) linhas.push(["Economia no anual", formatarBRL(preco.economia)]);
  } else {
    linhas.push(["Total mensal", formatarBRL(preco.totalCiclo)]);
  }
  linhas.push(["Migração", migracaoTexto(preco)]);
  return linhas;
}

function linhasEscritorio(p: Pedido): [string, string][] {
  const e = p.escritorio;
  const faixa = FAIXAS_PROCESSOS.find((f) => f.id === p.migracao.faixaProcessos)?.label ?? "—";
  return [
    ["Escritório / advogado", e.razaoSocial],
    [e.tipoDocumento === "cnpj" ? "CNPJ" : "CPF", e.documento],
    ["OAB", e.oab],
    ["Município (NFS-e)", `${e.municipio}/${e.municipioUf}`],
    ["Responsável", e.responsavel],
    ["E-mail", e.email],
    ["WhatsApp", e.whatsapp],
    ["Sistema atual", p.migracao.sistemaAtual],
    ["Processos", faixa],
  ];
}

const texto = (linhas: [string, string][]) => linhas.map(([k, v]) => `${k}: ${v}`).join("\n");

// ---------------------------------------------------------------------------

export function emailInterno(p: Pedido) {
  const subject = `[MayaJus] Novo pedido ${p.numero} — ${p.planoNome} ${cicloLabel(p.ciclo)} — ${p.escritorio.razaoSocial}`;
  const preco = linhasPreco(p);
  const dados = linhasEscritorio(p);

  const tabela = (titulo: string, linhas: [string, string][]) => `
    <h3 style="font-family:Arial,sans-serif;font-size:15px;margin:20px 0 8px">${titulo}</h3>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${linhas
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}
    </table>`;

  const html = `
    <h2 style="font-family:Arial,sans-serif">Novo pedido MayaJus — ${escapeHtml(p.numero)}</h2>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#555">Pagamento: ${escapeHtml(p.pagamento.provedor)} (${escapeHtml(p.pagamento.status)}). Enviar o link de pagamento após o contato.</p>
    ${tabela("Plano", preco)}
    ${tabela("Escritório", dados)}
    <h3 style="font-family:Arial,sans-serif;font-size:15px;margin:20px 0 8px">Observações</h3>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(p.observacoes || "—")}</p>`;

  const text = `Novo pedido MayaJus ${p.numero}\n\nPLANO\n${texto(preco)}\n\nESCRITÓRIO\n${texto(dados)}\n\nObservações:\n${
    p.observacoes || "—"
  }\n\nPagamento: ${p.pagamento.provedor} (${p.pagamento.status})`;

  return { subject, html, text };
}

// ---------------------------------------------------------------------------

export function emailCliente(p: Pedido) {
  const primeiroNome = p.escritorio.responsavel.split(" ")[0];
  const subject = `Recebemos seu pedido ${p.numero} — MayaJus`;
  const A = MAYAJUS_ACCENT;
  const preco = linhasPreco(p);

  const linhasHtml = preco
    .map(([k, v], i) => {
      const destaque = k.startsWith("Total");
      return `<tr>
        <td style="padding:10px 0;border-top:${i ? "1px solid #1E293B" : "0"};color:${destaque ? "#F1F5F9" : "#94A3B8"};font-size:14px;${destaque ? "font-weight:bold;" : ""}">${escapeHtml(k)}</td>
        <td align="right" style="padding:10px 0;border-top:${i ? "1px solid #1E293B" : "0"};color:${destaque ? A : "#F1F5F9"};font-size:${destaque ? "16px" : "14px"};font-weight:bold;white-space:nowrap">${escapeHtml(v)}</td>
      </tr>`;
    })
    .join("");

  const passosHtml = PROXIMOS_PASSOS.map(
    (s, i) => `<tr>
      <td width="36" valign="top" style="padding:0 0 14px">
        <div style="width:28px;height:28px;line-height:28px;border-radius:14px;text-align:center;font-size:13px;font-weight:bold;${
          i === 0 ? `background:${A};color:#0A0F1E;` : `border:1px solid #334155;color:#94A3B8;`
        }">${i === 0 ? "&#10003;" : i + 1}</div>
      </td>
      <td valign="top" style="padding:3px 0 14px 8px">
        <div style="color:#F1F5F9;font-size:14px;font-weight:bold">${s.titulo}</div>
        <div style="color:#94A3B8;font-size:13px;margin-top:2px">${s.texto}</div>
      </td>
    </tr>`,
  ).join("");

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#0A0F1E">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;font-family:Arial,Helvetica,sans-serif">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 4px 20px">
      <span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:9px;background:${A};color:#0A0F1E;text-align:center;font-weight:bold;font-size:17px;vertical-align:middle">&#167;</span>
      <span style="color:#F1F5F9;font-size:19px;font-weight:bold;vertical-align:middle;padding-left:8px">Maya<span style="color:${A}">Jus</span></span>
      <span style="color:#64748B;font-size:12px;vertical-align:middle;padding-left:6px">por MayaCorp</span>
    </td></tr>
    <tr><td style="background:#0F172A;border:1px solid #1E293B;border-radius:18px;padding:32px 28px">
      <div style="display:inline-block;padding:5px 12px;border-radius:999px;background:rgba(16,185,129,.12);color:#34D399;font-size:12px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase">Pedido recebido</div>
      <h1 style="margin:16px 0 6px;color:#F1F5F9;font-size:24px;line-height:1.3">Tudo certo, ${escapeHtml(primeiroNome)}!</h1>
      <p style="margin:0;color:#94A3B8;font-size:15px;line-height:1.6">Recebemos o pedido do <strong style="color:#F1F5F9">${escapeHtml(
        p.escritorio.razaoSocial,
      )}</strong>. Nossa equipe entra em contato em até 1 dia útil para confirmar os dados e enviar o link de pagamento.</p>
      <div style="margin:24px 0;padding:16px 18px;border-radius:14px;border:1px dashed ${A}66;background:rgba(245,184,61,.06)">
        <div style="color:#94A3B8;font-size:12px;text-transform:uppercase;letter-spacing:.06em">Número do pedido</div>
        <div style="color:${A};font-size:22px;font-weight:bold;font-family:'Courier New',monospace;margin-top:4px">${escapeHtml(p.numero)}</div>
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${linhasHtml}</table>
      <h2 style="margin:30px 0 16px;color:#F1F5F9;font-size:17px">Próximos passos</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${passosHtml}</table>
      <p style="margin:12px 0 0;color:#94A3B8;font-size:13px;line-height:1.6">Dúvidas? É só responder este e-mail ou escrever para <a href="mailto:${EMAIL}" style="color:${A}">${EMAIL}</a>.</p>
    </td></tr>
    <tr><td align="center" style="padding:20px 8px;color:#64748B;font-size:12px;line-height:1.6">
      MayaJus é um produto <a href="${SITE_URL}" style="color:#94A3B8">MayaCorp</a>.<br>Você recebeu este e-mail porque fez um pedido em mayacorp.com.br.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

  const text = `Tudo certo, ${primeiroNome}!

Recebemos o pedido ${p.numero} do ${p.escritorio.razaoSocial}.
Nossa equipe entra em contato em até 1 dia útil para confirmar os dados e enviar o link de pagamento.

${texto(preco)}

Próximos passos:
${PROXIMOS_PASSOS.map((s, i) => `${i + 1}. ${s.titulo} — ${s.texto}`).join("\n")}

Dúvidas? Responda este e-mail ou escreva para ${EMAIL}.
Equipe MayaCorp`;

  return { subject, html, text };
}
