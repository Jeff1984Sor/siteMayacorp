import { Counter } from "@/components/counter";
import { Reveal } from "@/components/reveal";
import { STATS } from "@/content/site";

export function Stats() {
  return (
    <section aria-label="MayaCorp em números" className="border-y border-white/[0.06] bg-base-alt">
      <dl className="container-site grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-2 text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block font-display text-4xl font-bold text-gradient sm:text-5xl">
                {s.valor !== undefined ? <Counter valor={s.valor} prefixo={s.prefixo} sufixo={s.sufixo} /> : s.texto}
              </span>
              <span className="mt-2 block text-sm text-ink-muted">{s.label}</span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
