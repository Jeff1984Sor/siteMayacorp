import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-dots mask-fade absolute inset-0" />
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[min(640px,140vw)] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
      </div>
      <div className="container-site text-center">
        <p className="font-display text-8xl font-bold text-gradient sm:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Página não encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          O endereço pode ter mudado ou não existe mais. Que tal voltar para o início?
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao início
          </Link>
          <Link href="/#contato" className="btn-secondary">
            Fale com a gente
          </Link>
        </div>
      </div>
    </section>
  );
}
