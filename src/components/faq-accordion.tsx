"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

type Item = { pergunta: string; resposta: string };

export function FaqAccordion({ itens }: { itens: Item[] }) {
  const [aberto, setAberto] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      {itens.map((item, i) => {
        const open = aberto === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.pergunta}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setAberto(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-medium text-ink transition hover:text-white sm:px-6"
              >
                {item.pergunta}
                <Plus
                  className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                  aria-hidden
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6">{item.resposta}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
