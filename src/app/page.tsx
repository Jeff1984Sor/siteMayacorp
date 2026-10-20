import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Produtos } from "@/components/sections/produtos";
import { SobMedida } from "@/components/sections/sob-medida";
import { ComoTrabalhamos } from "@/components/sections/como-trabalhamos";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Tecnologias } from "@/components/sections/tecnologias";
import { Faq } from "@/components/sections/faq";
import { Contato } from "@/components/sections/contato";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Produtos />
      <SobMedida />
      <ComoTrabalhamos />
      <Diferenciais />
      <Tecnologias />
      <Faq />
      <Contato />
    </>
  );
}
