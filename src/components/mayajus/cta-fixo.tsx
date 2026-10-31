"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { linkCadastro } from "@/content/mayajus";

/** Barra "Contratar" fixa no rodapé do mobile, que aparece depois do hero e some na tabela de planos. */
export function CtaFixo({ preco }: { preco: string }) {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const planos = document.getElementById("planos");
    const onScroll = () => {
      const passouHero = window.scrollY > window.innerHeight * 0.8;
      const r = planos?.getBoundingClientRect();
      const naTabela = r ? r.top < window.innerHeight && r.bottom > 0 : false;
      setMostrar(passouHero && !naTabela);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-base/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs leading-tight text-ink-muted">
              MayaJus a partir de
              <span className="block font-display text-base font-semibold text-ink">{preco}</span>
            </p>
            <a href={linkCadastro()} className="btn-gold !py-2.5">
              Contratar <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
