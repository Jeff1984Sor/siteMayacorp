"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { PRODUTOS } from "@/content/produtos";
import { NAV_LINKS } from "@/content/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProdutosOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProdutosOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const closeAll = () => {
    setMobileOpen(false);
    setProdutosOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-white/[0.08] bg-base/75 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="container-site flex h-16 items-center justify-between" aria-label="Principal">
        <Link href="/" aria-label="MayaCorp — página inicial" onClick={closeAll}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setProdutosOpen(true)}
            onMouseLeave={() => setProdutosOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-ink-muted transition hover:text-ink"
              aria-expanded={produtosOpen}
              aria-controls="menu-produtos"
              onClick={() => setProdutosOpen((v) => !v)}
            >
              Produtos
              <ChevronDown className={`h-4 w-4 transition ${produtosOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            <AnimatePresence>
              {produtosOpen && (
                <motion.div
                  id="menu-produtos"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full w-[520px] -translate-x-1/2 pt-3"
                >
                  <ul className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-base-alt/95 p-2 shadow-2xl backdrop-blur-xl">
                    {PRODUTOS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <li key={p.slug}>
                          <Link
                            href={`/produtos/${p.slug}`}
                            onClick={closeAll}
                            className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/5"
                          >
                            <span
                              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                              style={{ backgroundColor: `${p.accent}1f`, color: p.accent }}
                            >
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-ink">{p.nome}</span>
                              <span className="block text-xs leading-snug text-ink-muted">{p.tagline}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-ink-muted transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/#contato" className="btn-primary ml-3 !py-2.5">
            Fale com a gente
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-y-auto border-t border-white/[0.08] lg:hidden"
          >
            <div className="container-site flex flex-col gap-1 py-6">
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-ink-muted">Produtos</p>
              {PRODUTOS.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.slug}
                    href={`/produtos/${p.slug}`}
                    onClick={closeAll}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-ink transition hover:bg-white/5"
                  >
                    <Icon className="h-4 w-4" style={{ color: p.accent }} aria-hidden />
                    {p.nome}
                  </Link>
                );
              })}
              <div className="my-3 h-px bg-white/10" />
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeAll}
                  className="rounded-xl px-3 py-2.5 text-ink transition hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/#contato" onClick={closeAll} className="btn-primary mt-4">
                Fale com a gente
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
