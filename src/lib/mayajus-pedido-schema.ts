import { z } from "zod";
import { FAIXAS_PROCESSOS, PLANO_IDS, SISTEMAS_ATUAIS, type FaixaProcessos } from "@/content/mayajus-planos";
import { documentoValido } from "@/lib/documento";

export const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
  "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
] as const;

export const MAX_ADICIONAIS = 200;

const FAIXA_IDS = FAIXAS_PROCESSOS.map((f) => f.id) as [FaixaProcessos, ...FaixaProcessos[]];

const texto = (obrigatorio: string) => z.string({ required_error: obrigatorio, invalid_type_error: obrigatorio }).trim();
const uf = (msg: string) => z.enum(UFS, { errorMap: () => ({ message: msg }) });

export const pedidoSchema = z
  .object({
    // Passo 1 — plano
    plano: z.enum(PLANO_IDS, { errorMap: () => ({ message: "Escolha um plano." }) }),
    ciclo: z.enum(["mensal", "anual"], { errorMap: () => ({ message: "Escolha o ciclo." }) }),
    usuariosAdicionais: z.coerce
      .number({ invalid_type_error: "Quantidade inválida." })
      .int("Quantidade inválida.")
      .min(0, "Quantidade inválida.")
      .max(MAX_ADICIONAIS, `Para mais de ${MAX_ADICIONAIS} usuários adicionais, fale com a gente.`),

    // Passo 2 — escritório
    razaoSocial: texto("Informe a razão social ou o nome do advogado.")
      .min(3, "Informe a razão social ou o nome do advogado.")
      .max(160, "Nome muito longo."),
    documento: texto("Informe o CNPJ ou CPF.").refine(documentoValido, "CNPJ ou CPF inválido. Confira os números."),
    oabNumero: texto("Informe o número da OAB.")
      .regex(/^[0-9A-Za-z.\-/ ]{2,20}$/, "Informe o número da OAB."),
    oabUf: uf("Selecione a UF da OAB."),
    municipio: texto("Informe o município.").min(2, "Informe o município.").max(80, "Nome muito longo."),
    municipioUf: uf("Selecione a UF do município."),
    responsavel: texto("Informe o nome do responsável.").min(3, "Informe o nome do responsável.").max(100, "Nome muito longo."),
    email: texto("Informe o e-mail.").email("Informe um e-mail válido.").max(160),
    whatsapp: texto("Informe o WhatsApp.").refine((v) => {
      const d = v.replace(/\D/g, "");
      return d.length === 10 || d.length === 11;
    }, "Informe o WhatsApp com DDD."),

    // Passo 3 — migração e confirmação
    sistemaAtual: z.enum(SISTEMAS_ATUAIS, { errorMap: () => ({ message: "Selecione uma opção." }) }),
    sistemaOutro: z.string().trim().max(80, "Nome muito longo.").optional().or(z.literal("")),
    faixaProcessos: z.enum(FAIXA_IDS).optional().or(z.literal("")),
    observacoes: z.string().trim().max(2000, "Observações muito longas.").optional().or(z.literal("")),
    aceite: z.literal(true, { errorMap: () => ({ message: "É preciso aceitar os termos para continuar." }) }),

    // honeypot: precisa chegar vazio
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((d, ctx) => {
    if (d.sistemaAtual === "Outro" && !d.sistemaOutro) {
      ctx.addIssue({ code: "custom", path: ["sistemaOutro"], message: "Qual sistema você usa?" });
    }
    if (d.sistemaAtual !== "Nenhum" && !d.faixaProcessos) {
      ctx.addIssue({ code: "custom", path: ["faixaProcessos"], message: "Selecione a quantidade aproximada." });
    }
  });

export type PedidoEntrada = z.infer<typeof pedidoSchema>;

/** Campos de cada passo do checkout (para validar um passo por vez no navegador). */
export const CAMPOS_POR_PASSO: (keyof PedidoEntrada)[][] = [
  ["plano", "ciclo", "usuariosAdicionais"],
  ["razaoSocial", "documento", "oabNumero", "oabUf", "municipio", "municipioUf", "responsavel", "email", "whatsapp"],
  ["sistemaAtual", "sistemaOutro", "faixaProcessos", "observacoes", "aceite"],
];

export function faixaDoPedido(d: Pick<PedidoEntrada, "sistemaAtual" | "faixaProcessos">): FaixaProcessos | null {
  return d.sistemaAtual === "Nenhum" || !d.faixaProcessos ? null : d.faixaProcessos;
}
