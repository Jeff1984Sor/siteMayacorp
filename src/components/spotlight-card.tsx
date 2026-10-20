"use client";

import { useRef, type CSSProperties } from "react";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: string;
};

/** Card glass com luz que segue o cursor (só aparece em dispositivos com hover). */
export function SpotlightCard({ children, className = "", accent }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`spotlight glass card-hover rounded-2xl ${className}`}
      style={accent ? ({ "--spot": accent } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
