import { TECNOLOGIAS } from "@/content/site";

function Lista({ duplicada = false }: { duplicada?: boolean }) {
  return (
    <ul className={`flex shrink-0 items-center gap-4 pr-4 ${duplicada ? "marquee-dup" : ""}`} aria-hidden={duplicada || undefined}>
      {TECNOLOGIAS.map((t) => (
        <li
          key={t}
          className="glass whitespace-nowrap rounded-full px-5 py-2.5 font-display text-sm font-semibold text-ink/90"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Tecnologias() {
  return (
    <section aria-labelledby="tec-titulo" className="py-20">
      <div className="container-site">
        <h2 id="tec-titulo" className="text-center text-sm font-medium uppercase tracking-wider text-ink-muted">
          Tecnologias que usamos
        </h2>
      </div>
      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="marquee-track flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <Lista />
          <Lista duplicada />
        </div>
      </div>
    </section>
  );
}
