import type { Metadata } from "next";
import { EMAIL, MAILTO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a MayaCorp trata os dados enviados pelo formulário de contato, em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <section className="pb-24 pt-32 sm:pt-40">
      <div className="container-site max-w-3xl">
        <p className="eyebrow">LGPD</p>
        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">Política de Privacidade</h1>
        <p className="mt-4 text-sm text-ink-muted">Última atualização: outubro de 2026</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-ink-muted [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          <div>
            <h2>1. Quem somos</h2>
            <p>
              Este site pertence à MayaCorp, fábrica de software que desenvolve SaaS próprios e sistemas sob medida. Esta
              política explica como tratamos os dados pessoais coletados por aqui, em conformidade com a Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </div>

          <div>
            <h2>2. Quais dados coletamos</h2>
            <p>Coletamos apenas os dados que você informa voluntariamente no formulário de contato:</p>
            <ul className="mt-3">
              <li>nome;</li>
              <li>e-mail;</li>
              <li>telefone/WhatsApp (opcional);</li>
              <li>empresa;</li>
              <li>interesse e mensagem.</li>
            </ul>
            <p className="mt-3">
              Para proteger o formulário contra abuso, o endereço IP de quem envia é usado temporariamente para limitar o
              número de envios, sem ser armazenado de forma permanente.
            </p>
          </div>

          <div>
            <h2>3. Para que usamos</h2>
            <p>
              Os dados do formulário são usados <strong className="text-ink">exclusivamente para responder ao seu contato</strong>{" "}
              e, quando for o caso, preparar um orçamento. Não vendemos, alugamos nem compartilhamos seus dados com
              terceiros para fins de publicidade. A base legal é o seu consentimento e o procedimento preliminar a um
              possível contrato, a seu pedido (art. 7º, I e V, da LGPD).
            </p>
          </div>

          <div>
            <h2>4. Por quanto tempo guardamos</h2>
            <p>
              Mantemos as mensagens pelo tempo necessário para tratar o seu contato e o eventual relacionamento comercial.
              Você pode pedir a exclusão a qualquer momento.
            </p>
          </div>

          <div>
            <h2>5. Cookies</h2>
            <p>Este site não utiliza cookies de rastreamento ou de publicidade.</p>
          </div>

          <div>
            <h2>6. Seus direitos</h2>
            <p>
              Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade ou exclusão dos
              seus dados, além de revogar o consentimento, escrevendo para{" "}
              <a href={MAILTO} className="text-accent hover:underline">
                {EMAIL}
              </a>
              .
            </p>
          </div>

          <div>
            <h2>7. Segurança</h2>
            <p>
              O site usa conexão criptografada (HTTPS) e adotamos medidas técnicas e administrativas para proteger os dados
              contra acesso não autorizado.
            </p>
          </div>

          <div>
            <h2>8. Contato</h2>
            <p>
              Dúvidas sobre esta política? Fale com a gente em{" "}
              <a href={MAILTO} className="text-accent hover:underline">
                {EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
