"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

/** Linha vertical da timeline que se preenche conforme a rolagem. */
export function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });

  return (
    <div ref={ref} className="absolute bottom-6 left-6 top-6 w-px bg-white/10 sm:left-8" aria-hidden>
      <motion.div
        className="h-full w-full origin-top bg-gradient-to-b from-primary via-primary-violet to-accent"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}
