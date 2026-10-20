import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { FAQ } from "@/content/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="bg-base-alt py-24 sm:py-32">
      <div className="container-site max-w-3xl">
        <SectionHeader id="faq-titulo" eyebrow="FAQ" titulo="Perguntas frequentes" />
        <Reveal className="mt-12">
          <FaqAccordion itens={FAQ} />
        </Reveal>
      </div>
    </section>
  );
}
