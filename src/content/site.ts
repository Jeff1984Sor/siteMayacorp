import {
  Bot,
  Boxes,
  Brain,
  ClipboardList,
  Cloud,
  Code,
  Database,
  GraduationCap,
  HeartHandshake,
  Headphones,
  KanbanSquare,
  Layers,
  Rocket,
  Search,
  ShieldCheck,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/#sob-medida", label: "Sob Medida" },
  { href: "/#como-trabalhamos", label: "Como Trabalhamos" },
  { href: "/#sobre", label: "Sobre" },
];

export type Stat = { valor?: number; texto?: string; prefixo?: string; sufixo?: string; label: string };

export const STATS: Stat[] = [
  { valor: 15, prefixo: "+", sufixo: " anos", label: "de experiência em tecnologia e atendimento" },
  { valor: 6, sufixo: "+", label: "produtos próprios" },
  { valor: 100, sufixo: "%", label: "em nuvem" },
  { texto: "IA", label: "em todos os produtos" },
];

export const SOB_MEDIDA: { titulo: string; texto: string; icon: LucideIcon }[] = [
  {
    icon: Target,
    titulo: "CRMs personalizados",
    texto: "Funil de vendas, contatos, propostas, metas, inteligência de receita e IA.",
  },
  {
    icon: Boxes,
    titulo: "ERPs personalizados",
    texto: "Financeiro, estoque, faturamento, emissão de notas e relatórios.",
  },
  {
    icon: KanbanSquare,
    titulo: "Gestão de processos",
    texto: "Fluxos, prazos, documentos e tarefas — jurídico, serviços e operações.",
  },
  {
    icon: Workflow,
    titulo: "Automações e robôs",
    texto:
      "WhatsApp, e-mail, n8n, integrações entre sistemas e robôs que baixam e classificam documentos.",
  },
  {
    icon: Brain,
    titulo: "Inteligência Artificial",
    texto: "Agentes, assistentes, resumo e classificação de documentos e análise de dados.",
  },
  {
    icon: Layers,
    titulo: "Sistemas de nicho",
    texto: "Estúdios, quadras de beach tennis, escritórios e o que a sua operação precisar.",
  },
];

export const ETAPAS: { titulo: string; texto: string; icon: LucideIcon }[] = [
  { icon: Search, titulo: "Diagnóstico", texto: "Entendemos o processo e o problema real." },
  { icon: ClipboardList, titulo: "Orçamento com prazo", texto: "Escopo, valor e prazo definidos por escrito." },
  { icon: Code, titulo: "Desenvolvimento por fases", texto: "Entregas visíveis a cada etapa." },
  { icon: GraduationCap, titulo: "Implantação e treinamento", texto: "Sistema no ar e equipe treinada." },
  { icon: HeartHandshake, titulo: "Sucesso do cliente", texto: "Acompanhamento e evolução contínua." },
];

export const DIFERENCIAIS: { titulo: string; texto: string; icon: LucideIcon }[] = [
  {
    icon: Bot,
    titulo: "Fábrica com agentes de IA",
    texto: "Agentes especializados em UX, banco de dados, backend, frontend e QA aceleram cada projeto.",
  },
  {
    icon: Cloud,
    titulo: "Tecnologia moderna",
    texto: "Python/FastAPI, Django, Next.js, PostgreSQL e Google Cloud.",
  },
  {
    icon: ShieldCheck,
    titulo: "Seguro desde a base",
    texto: "Multiempresa (multi-tenant), criptografia e backups desde o primeiro dia.",
  },
  {
    icon: Rocket,
    titulo: "Visão de Customer Success",
    texto: "Foco em adoção e resultado, não só em entrega.",
  },
  {
    icon: Database,
    titulo: "Funcionalidade completa",
    texto: "Tela, regra e banco: cada funcionalidade entregue inteira, nada pela metade.",
  },
  {
    icon: Headphones,
    titulo: "Suporte próximo",
    texto: "Gente de verdade do outro lado, sem robô de atendimento genérico.",
  },
];

export const TECNOLOGIAS = [
  "Python",
  "FastAPI",
  "Django",
  "Next.js",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Google Cloud",
  "WhatsApp",
  "n8n",
  "IA generativa",
];

export const FAQ = [
  {
    pergunta: "Vocês fazem sistema do zero ou adaptam um existente?",
    resposta:
      "Os dois. Criamos sistemas do zero e também evoluímos, integramos ou adaptamos o que você já usa — tudo começa no diagnóstico.",
  },
  {
    pergunta: "Quanto tempo leva?",
    resposta:
      "Depende do escopo. O prazo vem definido por escrito no orçamento — e é cumprido.",
  },
  {
    pergunta: "O sistema fica na nuvem?",
    resposta: "Sim. Tudo roda em nuvem, com backup e acesso de qualquer lugar.",
  },
  {
    pergunta: "Dá pra integrar com WhatsApp e com o que eu já uso?",
    resposta: "Sim. Integramos com WhatsApp, e-mail e com os sistemas que a sua operação já utiliza.",
  },
  {
    pergunta: "Tem mensalidade?",
    resposta:
      "Nos SaaS, sim: é uma assinatura. Nos sistemas sob medida, você paga o projeto, e o suporte mensal é opcional.",
  },
  {
    pergunta: "Como peço um orçamento?",
    resposta:
      "Pelo formulário logo abaixo ou pelo e-mail mayacorp@mayacorp.com.br. Respondemos para entender o seu cenário.",
  },
];
