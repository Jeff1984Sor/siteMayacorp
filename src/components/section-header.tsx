import { Reveal } from "@/components/reveal";

type SectionHeaderProps = {
  eyebrow: string;
  titulo: React.ReactNode;
  texto?: string;
  id?: string;
  align?: "center" | "left";
};

export function SectionHeader({ eyebrow, titulo, texto, id, align = "center" }: SectionHeaderProps) {
  const center = align === "center";
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
        {titulo}
      </h2>
      {texto && <p className="mt-4 text-lg leading-relaxed text-ink-muted">{texto}</p>}
    </Reveal>
  );
}
