import { CalendarDays, FolderKanban, LayoutDashboard, Receipt, Scale, Users, Wallet } from "lucide-react";
import { HonorarioNfseCard } from "@/components/mayajus/honorario-nfse-card";
import { MAYAJUS_ACCENT as A } from "@/content/mayajus";

const MENU = [
  { icon: LayoutDashboard, label: "Painel", ativo: true },
  { icon: FolderKanban, label: "Processos" },
  { icon: CalendarDays, label: "Agenda" },
  { icon: Users, label: "Clientes" },
  { icon: Wallet, label: "Financeiro" },
  { icon: Receipt, label: "Notas" },
];

const PRAZOS = [
  { proc: "0012345-67.2026.8.26.0100", acao: "Contestação", quando: "Hoje", urgente: true },
  { proc: "5004321-11.2026.4.03.6100", acao: "Réplica", quando: "Amanhã" },
  { proc: "1009876-22.2025.8.26.0224", acao: "Audiência", quando: "Qui, 14h" },
];

/** Mockup do painel do MayaJus feito em código (sem imagem). */
export function PainelMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mr-0" aria-hidden>
      <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
        <div className="flex items-center gap-1.5 border-b border-white/[0.08] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <Scale className="h-3.5 w-3.5" style={{ color: A }} /> MayaJus · painel do escritório
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr]">
          <nav className="hidden flex-col gap-1 border-r border-white/[0.06] p-3 sm:flex">
            {MENU.map(({ icon: Icon, label, ativo }) => (
              <span
                key={label}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${ativo ? "text-ink" : "text-ink-muted"}`}
                style={ativo ? { backgroundColor: `${A}1a`, color: A } : undefined}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </span>
            ))}
          </nav>
          <div className="min-w-0 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: "Prazos hoje", v: "3" },
                { k: "A receber", v: "R$ 18,4 mil" },
                { k: "Notas no mês", v: "42" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-white/[0.04] p-2.5">
                  <p className="text-[10px] text-ink-muted sm:text-[11px]">{s.k}</p>
                  <p className="mt-0.5 truncate font-display text-sm font-semibold sm:text-base">{s.v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-ink-muted">Próximos prazos</p>
            <ul className="mt-2 space-y-1.5">
              {PRAZOS.map((p) => (
                <li key={p.proc} className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-2 text-[11px]">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${p.urgente ? "bg-rose-400" : "bg-ink-muted/50"}`} />
                  <span className="min-w-0 flex-1 truncate font-mono text-ink-muted">{p.proc}</span>
                  <span className="hidden text-ink sm:inline">{p.acao}</span>
                  <span className={p.urgente ? "font-semibold text-rose-300" : "text-ink-muted"}>{p.quando}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 h-16 rounded-xl bg-white/[0.03] p-2.5">
              <div className="flex h-full items-end gap-1.5">
                {[38, 52, 44, 60, 56, 72, 68, 84, 78, 92].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t"
                    style={{ height: `${h}%`, background: i === 9 ? A : `${A}${i > 6 ? "66" : "33"}` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative -mt-14 ml-auto w-[78%] max-w-[300px] animate-float-slow sm:-mr-6 sm:-mt-20">
        <HonorarioNfseCard />
      </div>
    </div>
  );
}
