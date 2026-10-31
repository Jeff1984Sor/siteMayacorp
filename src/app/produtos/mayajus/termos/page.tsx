import type { Metadata } from "next";
import { MIGRACAO_MENSAL, PRECO_USUARIO_ADICIONAL } from "@/content/mayajus-planos";
import { formatarBRL } from "@/lib/mayajus-preco";
import { EMAIL, MAILTO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Contratação do MayaJus",
  description: "Condições de contratação do MayaJus: planos, ciclos, pagamento, migração, troca de plano e cancelamento.",
  alternates: { canonical: "/produtos/mayajus/termos" },
};

export default function TermosMayaJusPage() {
  return (
    <section className="pb-24 pt-32 sm:pt-40">
      <div className="container-site max-w-3xl">
        <p className="eyebrow">MayaJus</p>
        <h1 className="mt-5 text-4xl font-bold sm:text-5xl">Termos de Contratação</h1>
        <p className="mt-4 text-sm text-ink-muted">Última atualização: outubro de 2026</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-ink-muted [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          <div>
            <h2>1. O serviço</h2>
            <p>
              O MayaJus é um sistema em nuvem (SaaS) da MayaCorp para gestão de escritórios de advocacia, com processos, prazos,
              clientes, contratos, agenda, financeiro e emissão de NFS-e. O acesso é feito pelo navegador, mediante assinatura.
            </p>
          </div>
          <div>
            <h2>2. Pedido e confirmação</h2>
            <p>
              O pedido feito pelo site registra a sua intenção de contratar. A contratação é confirmada depois do nosso contato,
              da validação dos dados e do pagamento. Os valores considerados são sempre os da tabela vigente no momento do pedido.
            </p>
          </div>
          <div>
            <h2>3. Planos, ciclos e pagamento</h2>
            <ul>
              <li>Plano mensal: cobrado todo mês, sem fidelidade.</li>
              <li>Plano anual: cobrado de uma vez, com desconto equivalente a 2 meses.</li>
              <li>Usuário adicional: {formatarBRL(PRECO_USUARIO_ADICIONAL)} por mês, por usuário.</li>
              <li>Notas fiscais acima da franquia do plano são cobradas por unidade, conforme a tabela de planos.</li>
              <li>O pagamento é feito pelo link enviado pela nossa equipe.</li>
            </ul>
          </div>
          <div>
            <h2>4. Emissão de NFS-e</h2>
            <p>
              A emissão depende da integração com a prefeitura do município do escritório e, na maioria dos casos, de certificado
              digital válido do cliente. Confirmamos a integração logo depois da contratação e fazemos a configuração junto com você.
            </p>
          </div>
          <div>
            <h2>5. Migração</h2>
            <p>
              No plano anual a migração dos dados do sistema atual é grátis. No plano mensal é grátis até 200 processos, custa{" "}
              {formatarBRL(MIGRACAO_MENSAL["200a1000"] ?? 0)} de 200 a 1.000 processos e é feita sob orçamento acima disso.
            </p>
          </div>
          <div>
            <h2>6. Troca de plano e cancelamento</h2>
            <p>
              Você pode trocar de plano a qualquer momento. O plano mensal pode ser cancelado quando quiser, sem multa; o acesso
              continua até o fim do período já pago. No plano anual, o desconto considera o ciclo completo de 12 meses.
            </p>
          </div>
          <div>
            <h2>7. Dados e segurança</h2>
            <p>
              Os dados do escritório ficam em nuvem, com conexão criptografada e backups. O tratamento de dados pessoais segue a
              LGPD e a nossa{" "}
              <a href="/privacidade" className="text-accent hover:underline">
                Política de Privacidade
              </a>
              . Você pode solicitar a exportação dos seus dados ao encerrar a assinatura.
            </p>
          </div>
          <div>
            <h2>8. Contato</h2>
            <p>
              Dúvidas sobre estes termos:{" "}
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
