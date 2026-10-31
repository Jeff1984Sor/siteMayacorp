// Pagamento do MayaJus. Hoje o link de pagamento é enviado depois, pela equipe (ManualProvider).
// Para plugar um gateway (Pix/boleto/cartão): implemente PaymentProvider e registre em PROVEDORES,
// depois defina PAYMENT_PROVIDER=<id> no .env.
import type { NovoPedido, Pagamento } from "@/lib/pedidos/tipos";

export interface PaymentProvider {
  readonly id: string;
  /** Chamado ao criar o pedido, antes de salvar. Pode devolver link/referência do gateway. */
  iniciar(pedido: NovoPedido): Promise<Pagamento>;
}

/** Só registra o pedido como aguardando pagamento — o link é enviado por e-mail/WhatsApp depois do contato. */
export class ManualProvider implements PaymentProvider {
  readonly id = "manual";
  async iniciar(): Promise<Pagamento> {
    return { provedor: this.id, status: "aguardando" };
  }
}

const PROVEDORES: Record<string, () => PaymentProvider> = {
  manual: () => new ManualProvider(),
};

export function getPaymentProvider(): PaymentProvider {
  const id = process.env.PAYMENT_PROVIDER || "manual";
  return (PROVEDORES[id] ?? PROVEDORES.manual)();
}
