import { Clock, Mail, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { EMAIL, MAILTO } from "@/lib/site";

export function Contato() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-dots mask-fade absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-1/3 h-[480px] w-[min(720px,140vw)] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      </div>

      <div className="container-site">
        <SectionHeader
          id="contato-titulo"
          eyebrow="Contato"
          titulo={
            <>
              Vamos construir o próximo sistema <span className="text-gradient">do seu negócio?</span>
            </>
          }
          texto="Conte o que você precisa. A gente responde para entender o cenário e montar um orçamento com escopo, valor e prazo."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="glass flex h-full flex-col rounded-3xl p-6 sm:p-8">
              <span className="bg-gradient-primary grid h-12 w-12 place-items-center rounded-xl text-white">
                <Mail className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold">Prefere e-mail?</h3>
              <p className="mt-2 text-sm text-ink-muted">Escreva direto para a gente:</p>
              <a href={MAILTO} className="mt-3 break-all font-display text-lg font-semibold text-accent hover:underline">
                {EMAIL}
              </a>
              <a href={`${MAILTO}?subject=${encodeURIComponent("Contato pelo site")}`} className="btn-secondary mt-6">
                Enviar e-mail <Mail className="h-4 w-4" aria-hidden />
              </a>
              <ul className="mt-8 space-y-3 border-t border-white/[0.08] pt-6 text-sm text-ink-muted">
                <li className="flex gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  Prazo definido no orçamento — e cumprido.
                </li>
                <li className="flex gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  Seus dados são usados só para responder ao contato.
                </li>
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
