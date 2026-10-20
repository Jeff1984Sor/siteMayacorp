import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { PRODUTOS } from "@/content/produtos";
import { NAV_LINKS } from "@/content/site";
import { EMAIL, MAILTO } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-base-alt">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="MayaCorp — página inicial">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            Software que trabalha pelo seu negócio. SaaS prontos e sistemas sob medida, com IA.
          </p>
        </div>

        <nav aria-label="Seções">
          <h2 className="font-sans text-sm font-semibold text-ink">Navegação</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/#produtos" className="text-ink-muted transition hover:text-ink">
                Produtos
              </Link>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contato" className="text-ink-muted transition hover:text-ink">
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Produtos">
          <h2 className="font-sans text-sm font-semibold text-ink">Produtos</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PRODUTOS.map((p) => (
              <li key={p.slug}>
                <Link href={`/produtos/${p.slug}`} className="text-ink-muted transition hover:text-ink">
                  {p.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold text-ink">Contato</h2>
          <a href={MAILTO} className="mt-4 inline-flex items-center gap-2 break-all text-sm text-accent hover:underline">
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            {EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-muted sm:flex-row">
          <p>© 2026 MayaCorp. Todos os direitos reservados.</p>
          <Link href="/privacidade" className="transition hover:text-ink">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
