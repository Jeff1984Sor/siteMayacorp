import { z } from "zod";
import { INTERESSE_VALUES } from "@/content/interesses";

const texto = (obrigatorio: string) => z.string({ required_error: obrigatorio, invalid_type_error: obrigatorio });

export const contatoSchema = z.object({
  nome: texto("Informe seu nome.").trim().min(2, "Informe seu nome.").max(100, "Nome muito longo."),
  email: texto("Informe seu e-mail.").trim().email("Informe um e-mail válido.").max(160),
  telefone: z.string().trim().max(40, "Telefone muito longo.").optional().or(z.literal("")),
  empresa: texto("Informe a empresa.").trim().min(1, "Informe a empresa.").max(120, "Nome da empresa muito longo."),
  interesse: z.enum(INTERESSE_VALUES, { errorMap: () => ({ message: "Selecione um interesse." }) }),
  mensagem: texto("Escreva sua mensagem.")
    .trim()
    .min(10, "Conte um pouco mais (mínimo de 10 caracteres).")
    .max(5000, "Mensagem muito longa."),
  // honeypot: precisa chegar vazio
  website: z.string().max(0).optional().or(z.literal("")),
});

export type Contato = z.infer<typeof contatoSchema>;
