// Opções do select "Interesse" do formulário de contato.
// Os valores dos produtos são iguais aos slugs de /produtos/[slug].
export const INTERESSES = [
  { value: "mayapost", label: "MayaPost" },
  { value: "mayasec", label: "MayaSec" },
  { value: "mayaassinador", label: "MayaAssinador" },
  { value: "mayafit", label: "MayaFit" },
  { value: "mayatrade", label: "Mayatrade" },
  { value: "automacao-nfse", label: "Automação de NFS-e" },
  { value: "crm", label: "CRM personalizado" },
  { value: "erp", label: "ERP personalizado" },
  { value: "automacao-ia", label: "Automação/IA" },
  { value: "outro", label: "Outro" },
] as const;

export type Interesse = (typeof INTERESSES)[number]["value"];

export const INTERESSE_VALUES = INTERESSES.map((i) => i.value) as [Interesse, ...Interesse[]];

export function interesseLabel(value: string): string {
  return INTERESSES.find((i) => i.value === value)?.label ?? "Outro";
}

export function isInteresse(value: string | null | undefined): value is Interesse {
  return !!value && INTERESSES.some((i) => i.value === value);
}
