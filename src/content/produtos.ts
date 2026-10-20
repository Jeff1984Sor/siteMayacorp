// Conteúdo de todos os produtos — edite aqui para atualizar cards da home e páginas /produtos/[slug].
// Atenção: os ícones são componentes; use-os apenas em Server Components ou em
// Client Components que importam este arquivo diretamente (nunca passe `icon` como prop
// de um Server Component para um Client Component).
import {
  Bell,
  Brain,
  Building2,
  Calendar,
  Clock,
  Cpu,
  DollarSign,
  Dumbbell,
  Eye,
  FileText,
  Globe,
  History,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  Puzzle,
  Receipt,
  Send,
  ShieldCheck,
  Sparkles,
  Stamp,
  Target,
  TrendingUp,
  Upload,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type MockupTipo = "post" | "chat" | "documento" | "agenda" | "trade" | "lote";

export type Produto = {
  slug: string;
  nome: string;
  tagline: string;
  descricao: string;
  icon: LucideIcon;
  accent: string;
  bullets: string[];
  badge?: string;
  aviso?: string;
  problema: { titulo: string; texto: string; dores: string[] };
  funcionalidades: { titulo: string; texto: string; icon: LucideIcon }[];
  paraQuem: string[];
  faq: { pergunta: string; resposta: string }[];
  mockup: MockupTipo;
};

export const PRODUTOS: Produto[] = [
  {
    slug: "mayapost",
    nome: "MayaPost",
    tagline: "Instagram no piloto automático com IA",
    descricao:
      "Um time de agentes de IA — estrategista, copywriter, designer e revisor — cria, agenda e publica os posts do seu Instagram, com métricas em um só painel.",
    icon: Sparkles,
    accent: "#F472B6",
    bullets: [
      "Pipeline de agentes de IA: estrategista, copywriter, designer e revisor criando os posts",
      "Agendamento e publicação automática",
      "Dashboard de métricas (alcance, visualizações, curtidas, comentários, salvamentos)",
      "Em expansão para TikTok e LinkedIn",
    ],
    problema: {
      titulo: "Manter o Instagram ativo consome um tempo que você não tem",
      texto:
        "Pensar a pauta, escrever a legenda, criar a arte, revisar e lembrar de publicar — toda semana, sem falhar. Quando a rotina aperta, o perfil para, e a presença digital some junto.",
      dores: [
        "Falta de tempo para produzir conteúdo com frequência",
        "Posts feitos na correria, sem estratégia",
        "Dificuldade de saber o que realmente funciona",
      ],
    },
    funcionalidades: [
      {
        icon: Brain,
        titulo: "Time de agentes de IA",
        texto:
          "O estrategista define a pauta, o copywriter escreve, o designer cria a arte e o revisor confere tudo antes de publicar.",
      },
      {
        icon: Calendar,
        titulo: "Agendamento automático",
        texto: "Os posts entram no calendário e são publicados automaticamente nos horários definidos.",
      },
      {
        icon: TrendingUp,
        titulo: "Dashboard de métricas",
        texto: "Alcance, visualizações, curtidas, comentários e salvamentos de cada post, em um só lugar.",
      },
      {
        icon: Globe,
        titulo: "Novas redes a caminho",
        texto: "O MayaPost está em expansão para TikTok e LinkedIn.",
      },
    ],
    paraQuem: [
      "Pequenas e médias empresas que precisam de presença constante",
      "Profissionais liberais e prestadores de serviço",
      "Agências que querem escalar a produção de conteúdo",
    ],
    faq: [
      {
        pergunta: "Com quais redes o MayaPost funciona?",
        resposta: "Hoje com o Instagram. TikTok e LinkedIn estão em expansão.",
      },
      {
        pergunta: "Como acompanho os resultados?",
        resposta:
          "Pelo dashboard de métricas, com alcance, visualizações, curtidas, comentários e salvamentos de cada post.",
      },
      {
        pergunta: "Como contrato?",
        resposta: "O MayaPost é um SaaS por assinatura. Fale com a gente para conhecer os planos.",
      },
    ],
    mockup: "post",
  },
  {
    slug: "mayasec",
    nome: "MayaSec",
    tagline: "Secretária com IA no WhatsApp",
    descricao:
      "Uma secretária com IA que atende seus clientes 24h pelo WhatsApp: agenda, confirma, responde dúvidas e executa tarefas no seu sistema.",
    icon: MessageCircle,
    accent: "#10B981",
    bullets: [
      "Atende clientes 24h pelo WhatsApp com linguagem natural",
      "Agenda, confirma, responde dúvidas e executa tarefas no seu sistema",
      "Painel de controle para acompanhar conversas e configurar o comportamento",
      "Integra com os sistemas de gestão do cliente",
    ],
    problema: {
      titulo: "Cliente sem resposta é cliente que vai embora",
      texto:
        "As mensagens chegam fora do horário, no fim de semana e no meio do expediente corrido. Cada demora é uma chance a menos de agendar, fechar ou fidelizar.",
      dores: [
        "Mensagens acumuladas e respostas atrasadas",
        "Equipe presa em perguntas repetitivas",
        "Agendamentos e confirmações feitos na mão",
      ],
    },
    funcionalidades: [
      {
        icon: Clock,
        titulo: "Atendimento 24h",
        texto: "Responde a qualquer hora, com linguagem natural, direto no WhatsApp do seu negócio.",
      },
      {
        icon: Calendar,
        titulo: "Agenda e confirma",
        texto: "Reserva horários, envia confirmações e responde dúvidas frequentes sem intervenção manual.",
      },
      {
        icon: Zap,
        titulo: "Executa tarefas",
        texto: "Vai além da conversa: executa ações no seu sistema a partir do que o cliente pede.",
      },
      {
        icon: LayoutDashboard,
        titulo: "Painel de controle",
        texto: "Acompanhe as conversas e configure o comportamento da secretária em um só lugar.",
      },
      {
        icon: Puzzle,
        titulo: "Integração com sua gestão",
        texto: "Conecta-se aos sistemas de gestão que você já usa.",
      },
    ],
    paraQuem: [
      "Clínicas, consultórios e estúdios que vivem de agenda",
      "Escritórios e prestadores de serviço",
      "Qualquer negócio que atende pelo WhatsApp",
    ],
    faq: [
      {
        pergunta: "A MayaSec substitui minha equipe?",
        resposta:
          "Ela assume o atendimento repetitivo e libera a equipe para o que exige gente. Pelo painel, você acompanha todas as conversas.",
      },
      {
        pergunta: "Funciona com o sistema que eu já uso?",
        resposta:
          "A MayaSec integra com sistemas de gestão. Avaliamos a sua integração no diagnóstico, e o prazo vem definido no orçamento.",
      },
      {
        pergunta: "Consigo ajustar o jeito que ela responde?",
        resposta: "Sim. O comportamento é configurado pelo painel de controle.",
      },
    ],
    mockup: "chat",
  },
  {
    slug: "mayaassinador",
    nome: "MayaAssinador",
    tagline: "Documentos prontos e assinados para escritórios de advocacia",
    descricao:
      "Suba o Word e receba o documento com cabeçalho e rodapé do escritório, rubrica em todas as páginas e assinatura na última.",
    icon: FileText,
    accent: "#22D3EE",
    bullets: [
      "Suba o Word e o sistema aplica cabeçalho e rodapé do escritório",
      "Rubrica em todas as páginas e assinatura na última",
      "Tipografia configurável com preview ao vivo",
      "Histórico de documentos e envio por e-mail direto da plataforma",
    ],
    problema: {
      titulo: "Formatar documento não é trabalho de advogado",
      texto:
        "Ajustar cabeçalho e rodapé, padronizar a fonte, rubricar página por página e assinar no lugar certo: tarefas repetitivas que tomam tempo e abrem espaço para erro.",
      dores: [
        "Horas perdidas com formatação manual",
        "Documentos fora do padrão do escritório",
        "Rubricas e assinaturas feitas uma a uma",
      ],
    },
    funcionalidades: [
      {
        icon: Upload,
        titulo: "Suba o Word",
        texto: "Você continua escrevendo como sempre. É só enviar o arquivo .docx.",
      },
      {
        icon: Building2,
        titulo: "Padrão do escritório",
        texto: "Cabeçalho e rodapé do escritório aplicados automaticamente em todo documento.",
      },
      {
        icon: Stamp,
        titulo: "Rubrica e assinatura",
        texto: "Rubrica em todas as páginas e assinatura na última, sempre no lugar certo.",
      },
      {
        icon: Eye,
        titulo: "Tipografia com preview",
        texto: "Configure fonte, tamanho e espaçamento e veja o resultado ao vivo.",
      },
      {
        icon: History,
        titulo: "Histórico de documentos",
        texto: "Todos os documentos gerados ficam organizados na plataforma.",
      },
      {
        icon: Send,
        titulo: "Envio por e-mail",
        texto: "Envie o documento pronto direto da plataforma.",
      },
    ],
    paraQuem: [
      "Escritórios de advocacia de todos os portes",
      "Departamentos jurídicos de empresas",
      "Advogados autônomos que querem documentos com padrão profissional",
    ],
    faq: [
      {
        pergunta: "Preciso mudar meu jeito de escrever?",
        resposta:
          "Não. Você continua escrevendo no Word; o MayaAssinador cuida da formatação, das rubricas e da assinatura.",
      },
      {
        pergunta: "Posso ajustar a fonte e o tamanho?",
        resposta: "Sim. A tipografia é configurável, com preview ao vivo.",
      },
      {
        pergunta: "Os documentos ficam guardados?",
        resposta: "Sim. Há histórico de documentos na plataforma, com envio por e-mail direto dela.",
      },
    ],
    mockup: "documento",
  },
  {
    slug: "mayafit",
    nome: "MayaFit",
    tagline: "Gestão completa para estúdios de Pilates e academias",
    descricao:
      "Alunos, agenda, aulas, planos e financeiro em um só lugar, com integração à secretária MayaSec no WhatsApp.",
    icon: Dumbbell,
    accent: "#F59E0B",
    bullets: [
      "Alunos, agenda, aulas, planos e financeiro em um só lugar",
      "Integração com a secretária MayaSec no WhatsApp",
      "Gamificação e monitoramento de treino (em desenvolvimento)",
    ],
    problema: {
      titulo: "Planilha, caderno e WhatsApp não fazem gestão",
      texto:
        "Quando alunos, horários, planos e pagamentos ficam espalhados, sobra retrabalho e falta visão do negócio. O tempo que deveria ir para as aulas vai para a administração.",
      dores: [
        "Agenda e reposições controladas na mão",
        "Mensalidades difíceis de acompanhar",
        "Informações dos alunos espalhadas",
      ],
    },
    funcionalidades: [
      {
        icon: Users,
        titulo: "Alunos",
        texto: "Cadastro completo e histórico de cada aluno em um só lugar.",
      },
      {
        icon: Calendar,
        titulo: "Agenda e aulas",
        texto: "Horários, turmas e aulas organizados e fáceis de consultar.",
      },
      {
        icon: Wallet,
        titulo: "Planos e financeiro",
        texto: "Planos, mensalidades e controle financeiro integrados à rotina do estúdio.",
      },
      {
        icon: MessageCircle,
        titulo: "MayaSec no WhatsApp",
        texto: "Integração com a secretária com IA para atender e agendar pelo WhatsApp.",
      },
      {
        icon: Target,
        titulo: "Gamificação",
        texto: "Recursos para engajar alunos. Em desenvolvimento.",
      },
      {
        icon: TrendingUp,
        titulo: "Monitoramento de treino",
        texto: "Acompanhamento da evolução dos alunos. Em desenvolvimento.",
      },
    ],
    paraQuem: [
      "Estúdios de Pilates",
      "Academias e estúdios de treino funcional",
      "Profissionais que estão estruturando o próprio estúdio",
    ],
    faq: [
      {
        pergunta: "Preciso contratar a MayaSec junto?",
        resposta: "Não. A integração com a MayaSec é opcional e pode ser ativada quando fizer sentido.",
      },
      {
        pergunta: "A gamificação já está disponível?",
        resposta: "Gamificação e monitoramento de treino estão em desenvolvimento.",
      },
      {
        pergunta: "Como contrato?",
        resposta: "O MayaFit é um SaaS por assinatura. Fale com a gente para conhecer os planos.",
      },
    ],
    mockup: "agenda",
  },
  {
    slug: "mayatrade",
    nome: "Mayatrade",
    tagline: "Inteligência de mercado para day trade",
    descricao:
      "Painel de notícias globais, câmbio e alertas em tempo real, com IA configurável para apoiar a sua análise e notificações pelo WhatsApp.",
    icon: Newspaper,
    accent: "#A78BFA",
    badge: "Em breve",
    aviso: "Ferramenta de apoio à análise. Não é recomendação de investimento.",
    bullets: [
      "Painel de notícias globais (EUA, Europa, China), câmbio e alertas em tempo real",
      "IA para apoiar a análise, com motor e modelo configuráveis",
      "Notificações pelo WhatsApp",
    ],
    problema: {
      titulo: "Informação demais, tempo de menos",
      texto:
        "Notícias dos EUA, da Europa e da China, câmbio em movimento e alertas espalhados em várias telas. Acompanhar tudo em tempo real é difícil — e organizar a informação é metade da análise.",
      dores: [
        "Notícias relevantes espalhadas em muitas fontes",
        "Câmbio e alertas acompanhados em telas diferentes",
        "Pouco tempo para filtrar o que importa",
      ],
    },
    funcionalidades: [
      {
        icon: Globe,
        titulo: "Notícias globais",
        texto: "EUA, Europa e China reunidos em um único painel.",
      },
      {
        icon: DollarSign,
        titulo: "Câmbio em tempo real",
        texto: "Acompanhe as principais moedas sem trocar de tela.",
      },
      {
        icon: Bell,
        titulo: "Alertas",
        texto: "Alertas em tempo real para os eventos que você escolher acompanhar.",
      },
      {
        icon: Brain,
        titulo: "IA de apoio à análise",
        texto: "Resumos e organização das informações para apoiar a sua leitura do cenário.",
      },
      {
        icon: Cpu,
        titulo: "Motor e modelo configuráveis",
        texto: "Escolha o motor e o modelo de IA que fazem mais sentido para você.",
      },
      {
        icon: MessageCircle,
        titulo: "Notificações no WhatsApp",
        texto: "Receba os alertas direto no WhatsApp.",
      },
    ],
    paraQuem: [
      "Quem opera day trade e acompanha o noticiário diariamente",
      "Analistas que precisam de informação organizada",
      "Quem quer apoio de IA para as próprias análises",
    ],
    faq: [
      {
        pergunta: "O Mayatrade diz quando comprar ou vender?",
        resposta:
          "Não. É uma ferramenta de apoio à análise: organiza notícias, câmbio e alertas. As decisões são sempre suas. Não é recomendação de investimento.",
      },
      {
        pergunta: "Quando estará disponível?",
        resposta: "O Mayatrade está em desenvolvimento. Fale com a gente para entrar na lista de interesse.",
      },
    ],
    mockup: "trade",
  },
  {
    slug: "automacao-nfse",
    nome: "Automação de NFS-e",
    tagline: "Notas fiscais de serviço emitidas em lote",
    descricao:
      "Emissão em lote de notas fiscais de serviço a partir de arquivos, para escritórios e empresas com alto volume mensal.",
    icon: Receipt,
    accent: "#8B5CF6",
    bullets: [
      "Emissão em lote de notas fiscais de serviço a partir de arquivos",
      "Ideal para escritórios e empresas com alto volume mensal",
      "Redução de trabalho manual e de erros de digitação",
    ],
    problema: {
      titulo: "Emitir nota por nota não escala",
      texto:
        "Quando o volume mensal cresce, digitar cada NFS-e no portal vira um gargalo: horas de trabalho repetitivo e um risco constante de erro de digitação.",
      dores: [
        "Fechamento do mês travado pela emissão manual",
        "Erros de digitação que geram retrabalho",
        "Equipe ocupada com tarefa repetitiva",
      ],
    },
    funcionalidades: [
      {
        icon: Upload,
        titulo: "A partir de arquivos",
        texto: "As notas são geradas com base nos arquivos que você já tem.",
      },
      {
        icon: Layers,
        titulo: "Emissão em lote",
        texto: "Dezenas ou centenas de notas emitidas em um único processo.",
      },
      {
        icon: ShieldCheck,
        titulo: "Menos erros",
        texto: "Sem redigitação, cai o risco de erro de digitação.",
      },
      {
        icon: Clock,
        titulo: "Menos trabalho manual",
        texto: "A equipe deixa de emitir nota por nota e ganha tempo para o que importa.",
      },
    ],
    paraQuem: [
      "Escritórios de contabilidade",
      "Empresas com alto volume mensal de notas de serviço",
      "Prestadores com faturamento recorrente",
    ],
    faq: [
      {
        pergunta: "Funciona para qualquer município?",
        resposta:
          "Cada prefeitura tem as próprias regras e sistemas. Avaliamos o seu caso no diagnóstico, e o prazo vem definido no orçamento.",
      },
      {
        pergunta: "Preciso mudar meus arquivos?",
        resposta: "A automação é adaptada aos arquivos que você já usa sempre que possível.",
      },
    ],
    mockup: "lote",
  },
];

export function getProduto(slug: string): Produto | undefined {
  return PRODUTOS.find((p) => p.slug === slug);
}
