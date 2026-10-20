import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardMockup } from "@/components/dashboard-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-dots mask-fade absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[min(860px,140vw)] -translate-x-1/2">
          <div className="h-full w-full animate-glow rounded-full bg-gradient-to-r from-primary/35 via-primary-violet/30 to-accent/20 blur-[120px]" />
        </div>
      </div>

      <div className="container-site grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="text-center lg:text-left">
          <p className="eyebrow animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Fábrica de software com IA
          </p>
          <h1 className="mt-6 animate-fade-up text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            Software que <span className="text-gradient">trabalha pelo seu negócio.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-ink-muted lg:mx-0 [animation-delay:160ms]">
            A MayaCorp cria SaaS prontos e sistemas sob medida — CRMs, ERPs, automações e inteligência artificial — com
            prazo definido no orçamento e cumprido.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col justify-center gap-3 sm:flex-row lg:justify-start [animation-delay:240ms]">
            <Link href="/#contato" className="btn-primary">
              Quero um orçamento <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/#produtos" className="btn-secondary">
              Conhecer os produtos
            </Link>
          </div>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
