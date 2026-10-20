"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CounterProps = { valor: number; prefixo?: string; sufixo?: string };

export function Counter({ valor, prefixo = "", sufixo = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setAtual(valor);
      return;
    }
    const controls = animate(0, valor, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAtual(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, valor]);

  return (
    <span ref={ref} aria-label={`${prefixo}${valor}${sufixo}`}>
      <span aria-hidden>
        {prefixo}
        {atual}
        {sufixo}
      </span>
    </span>
  );
}
