import { Bell, Check, FileText, Heart, MessageCircle, Bookmark, Eye } from "lucide-react";
import type { MockupTipo } from "@/content/produtos";

type Props = { tipo: MockupTipo; accent: string };

function Janela({ titulo, accent, children }: { titulo: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/[0.08] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs text-ink-muted">{titulo}</span>
        <span className="ml-auto h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: accent }} />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Post({ accent }: { accent: string }) {
  return (
    <Janela titulo="MayaPost · calendário" accent={accent}>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-lg"
            style={{
              background: `linear-gradient(${135 + i * 30}deg, ${accent}55, #6366F155 60%, #22D3EE33)`,
            }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] text-ink-muted">
        {[
          { i: Eye, l: "Alcance" },
          { i: Heart, l: "Curtidas" },
          { i: MessageCircle, l: "Coment." },
          { i: Bookmark, l: "Salvos" },
        ].map(({ i: Icon, l }) => (
          <div key={l} className="rounded-lg bg-white/[0.04] p-2">
            <Icon className="mx-auto h-4 w-4" style={{ color: accent }} />
            <span className="mt-1 block">{l}</span>
          </div>
        ))}
      </div>
    </Janela>
  );
}

function Chat({ accent }: { accent: string }) {
  const msgs = [
    { de: "cliente", t: "Oi! Tem horário amanhã à tarde?" },
    { de: "ia", t: "Olá! Tenho às 14h e às 16h30. Qual prefere?" },
    { de: "cliente", t: "16h30, por favor." },
    { de: "ia", t: "Agendado para amanhã às 16h30. Enviarei um lembrete antes. ✅" },
  ];
  return (
    <Janela titulo="MayaSec · WhatsApp" accent={accent}>
      <div className="space-y-2.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.de === "ia" ? "justify-start" : "justify-end"}`}>
            <p
              className="max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed sm:text-sm"
              style={
                m.de === "ia"
                  ? { backgroundColor: `${accent}26`, color: "#F1F5F9" }
                  : { backgroundColor: "rgba(255,255,255,0.06)", color: "#F1F5F9" }
              }
            >
              {m.t}
            </p>
          </div>
        ))}
      </div>
    </Janela>
  );
}

function Documento({ accent }: { accent: string }) {
  return (
    <Janela titulo="MayaAssinador · preview" accent={accent}>
      <div className="mx-auto max-w-xs rounded-lg bg-slate-100 p-4 text-slate-800 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-300 pb-2">
          <span className="h-3 w-20 rounded" style={{ backgroundColor: accent }} />
          <FileText className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-3 space-y-1.5">
          {[100, 92, 96, 80, 94, 70].map((w, i) => (
            <div key={i} className="h-1.5 rounded bg-slate-300" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-5 flex items-end justify-between">
          <span className="font-serif text-[10px] italic text-slate-500">rubrica</span>
          <svg viewBox="0 0 120 30" className="h-8 w-24" aria-hidden>
            <path
              d="M4 22 C18 4 26 28 38 14 S58 6 64 20 S88 8 116 12"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-2 border-t border-slate-300 pt-1.5 text-center text-[9px] text-slate-500">
          rodapé do escritório
        </div>
      </div>
    </Janela>
  );
}

function Agenda({ accent }: { accent: string }) {
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const ocupados = [
    [1, 0, 1, 1],
    [0, 1, 1, 0],
    [1, 1, 0, 1],
    [0, 1, 1, 1],
    [1, 0, 1, 0],
  ];
  return (
    <Janela titulo="MayaFit · agenda da semana" accent={accent}>
      <div className="grid grid-cols-5 gap-2 text-center text-[11px] text-ink-muted">
        {dias.map((d, i) => (
          <div key={d} className="space-y-1.5">
            <span className="block">{d}</span>
            {ocupados[i].map((o, j) => (
              <div
                key={j}
                className="h-7 rounded-md"
                style={{ backgroundColor: o ? `${accent}40` : "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
        <span className="text-ink-muted">Aula de Pilates · 18h</span>
        <span className="flex items-center gap-1" style={{ color: accent }}>
          <Check className="h-3.5 w-3.5" /> confirmada
        </span>
      </div>
    </Janela>
  );
}

function Trade({ accent }: { accent: string }) {
  return (
    <Janela titulo="Mayatrade · painel" accent={accent}>
      <div className="space-y-2">
        {["EUA", "Europa", "China"].map((r) => (
          <div key={r} className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2">
            <span className="w-14 text-[11px] font-semibold" style={{ color: accent }}>
              {r}
            </span>
            <span className="h-1.5 flex-1 rounded bg-white/10" />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 70" className="mt-4 h-16 w-full" aria-hidden>
        <path
          d="M0 50 L30 44 L60 52 L90 34 L120 40 L150 26 L180 36 L210 22 L240 30 L270 18 L300 24"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-ink-muted">
        <Bell className="h-3.5 w-3.5" style={{ color: accent }} /> Alerta enviado pelo WhatsApp
      </div>
    </Janela>
  );
}

function Lote({ accent }: { accent: string }) {
  return (
    <Janela titulo="Emissão de NFS-e em lote" accent={accent}>
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
            <span className="text-ink-muted">Nota {String(n).padStart(3, "0")}</span>
            <span className="h-1.5 flex-1 rounded bg-white/10" />
            <span className="flex items-center gap-1 text-success">
              <Check className="h-3.5 w-3.5" /> emitida
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-4/5 rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #22D3EE)` }} />
      </div>
    </Janela>
  );
}

/** Mockup ilustrativo por produto, feito em código. */
export function ProductMockup({ tipo, accent }: Props) {
  const mapa = { post: Post, chat: Chat, documento: Documento, agenda: Agenda, trade: Trade, lote: Lote };
  const Comp = mapa[tipo];
  return (
    <div className="relative" role="img" aria-label="Ilustração da interface do produto">
      <div
        className="absolute -inset-6 -z-10 rounded-[2rem] opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
        aria-hidden
      />
      <div aria-hidden>
        <Comp accent={accent} />
      </div>
    </div>
  );
}
