import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "MayaCorp — Software que trabalha pelo seu negócio";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    titulo: "Software que trabalha pelo seu negócio.",
    subtitulo: "SaaS prontos e sistemas sob medida — CRMs, ERPs, automações e IA — com prazo definido no orçamento e cumprido.",
  });
}
