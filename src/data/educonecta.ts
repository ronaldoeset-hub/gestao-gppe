import {
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileArchive,
  FileText,
  Landmark,
  Megaphone,
  MessageSquare,
  Network,
  PieChart,
  Settings,
  Share2,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type EduModuleKey =
  | "dashboard"
  | "escolas"
  | "conselhos"
  | "recursos"
  | "biblioteca-sei"
  | "fnde-pdde"
  | "central-prazos"
  | "ia-educacional"
  | "parceiros"
  | "analytics"
  | "relatorios"
  | "mural"
  | "feedback"
  | "redes-sociais"
  | "arquivos"
  | "administracao"
  | "auditoria";

export type EduMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type EduCard = {
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "yellow" | "red" | "slate";
};

export type EduTableColumn = {
  key: string;
  header: string;
};

export type EduModule = {
  key: EduModuleKey;
  title: string;
  description: string;
  icon: LucideIcon;
  cards: EduCard[];
  columns: EduTableColumn[];
  rows: Record<string, string | number>[];
  actions: string[];
};

export const eduMenuItems: EduMenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/escolas", label: "Escolas", icon: Building2 },
  { href: "/conselhos", label: "Conselhos", icon: UsersRound },
  { href: "/recursos", label: "Recursos", icon: Landmark },
  { href: "/biblioteca-sei", label: "Biblioteca SEI", icon: FileText },
  { href: "/fnde-pdde", label: "FNDE/PDDE", icon: ClipboardCheck },
  { href: "/central-prazos", label: "Central de Prazos", icon: CalendarClock },
  { href: "/ia-educacional", label: "IA Educacional", icon: Bot },
  { href: "/parceiros", label: "Parceiros", icon: Network },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/relatorios", label: "Relatorios", icon: FileArchive },
  { href: "/mural", label: "Mural", icon: Megaphone },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/redes-sociais", label: "Redes Sociais", icon: Share2 },
  { href: "/arquivos", label: "Arquivos", icon: Archive },
  { href: "/administracao", label: "Administracao", icon: Settings }
];

export const dashboardCards: EduCard[] = [
  { label: "Total unidades", value: "55", detail: "Rede municipal mapeada", tone: "blue" },
  { label: "Conselhos vigentes", value: "42", detail: "Situacao regular", tone: "green" },
  { label: "Conselhos vencendo", value: "9", detail: "Proximos 90 dias", tone: "yellow" },
  { label: "Conselhos vencidos", value: "4", detail: "Exigem acao", tone: "red" },
  { label: "Recursos ativos", value: "R$ 8,2 mi", detail: "Mock financeiro", tone: "green" },
  { label: "Alertas criticos", value: "12", detail: "Prazos e pendencias", tone: "red" },
  { label: "Documentos", value: "186", detail: "Disponiveis na base", tone: "blue" },
  { label: "Parceiros", value: "18", detail: "Publicitarios mockados", tone: "slate" }
];

export const schools = [
  {
    Nome: "Escola M. Acelina Alves de Araujo",
    CNPJ: "00.000.000/0001-01",
    INEP: "52100001",
    Diretor: "Maria Oliveira",
    Telefone: "(61) 99999-0101",
    Email: "acelina@sme.local",
    Endereco: "Camping Clube",
    Conselho: "Vigente",
    Recursos: "PDDE, FNDE"
  },
  {
    Nome: "Escola Municipal Joaquim Pedro Gomes da Cruz",
    CNPJ: "00.000.000/0001-02",
    INEP: "52100029",
    Diretor: "Joao Pereira",
    Telefone: "(61) 99999-0202",
    Email: "joaquimpedro@sme.local",
    Endereco: "Mansoes Village",
    Conselho: "Vence em 90 dias",
    Recursos: "PDDE, LEIA"
  },
  {
    Nome: "Creche Municipal Eliene Martins Braga",
    CNPJ: "00.000.000/0001-03",
    INEP: "52100050",
    Diretor: "Ana Santos",
    Telefone: "(61) 99999-0303",
    Email: "eliene@sme.local",
    Endereco: "Residencial Jardim Paraiso",
    Conselho: "Em regularizacao",
    Recursos: "Educacao Conectada"
  }
];

export const modules: Record<Exclude<EduModuleKey, "dashboard">, EduModule> = {
  escolas: {
    key: "escolas",
    title: "Escolas",
    description: "Cadastro, busca, filtros e detalhes das unidades educacionais.",
    icon: Building2,
    cards: [
      { label: "Unidades cadastradas", value: "55", detail: "Dados mockados", tone: "blue" },
      { label: "Com conselho", value: "50", detail: "Com vinculo informado", tone: "green" },
      { label: "Pendentes", value: "5", detail: "Faltam dados", tone: "yellow" }
    ],
    columns: [
      { key: "Nome", header: "Nome" },
      { key: "INEP", header: "INEP" },
      { key: "Diretor", header: "Diretor" },
      { key: "Conselho", header: "Conselho" },
      { key: "Recursos", header: "Recursos" }
    ],
    rows: schools,
    actions: ["Nova escola", "Importar planilha", "Ver detalhes"]
  },
  conselhos: {
    key: "conselhos",
    title: "Conselhos",
    description: "Mandatos, presidentes, documentos, historico e alertas.",
    icon: UsersRound,
    cards: [
      { label: "Vigentes", value: "42", detail: "Dentro do prazo", tone: "green" },
      { label: "Vence em 30 dias", value: "3", detail: "Acompanhar", tone: "yellow" },
      { label: "Vencidos", value: "4", detail: "Regularizar", tone: "red" }
    ],
    columns: [
      { key: "Escola", header: "Escola" },
      { key: "Presidente", header: "Presidente" },
      { key: "CPF", header: "CPF mascarado" },
      { key: "Posse", header: "Data posse" },
      { key: "Vencimento", header: "Vencimento" },
      { key: "Status", header: "Status" }
    ],
    rows: [
      { Escola: "Escola M. Acelina Alves", Presidente: "R. Almeida", CPF: "***.123.***-**", Posse: "10/02/2024", Vencimento: "10/02/2027", Status: "Vigente" },
      { Escola: "Joaquim Pedro", Presidente: "M. Costa", CPF: "***.456.***-**", Posse: "12/08/2023", Vencimento: "12/08/2026", Status: "Vence em 90 dias" },
      { Escola: "Creche Eliene Martins", Presidente: "A. Lima", CPF: "***.789.***-**", Posse: "01/03/2022", Vencimento: "01/03/2025", Status: "Vencido" }
    ],
    actions: ["Novo conselho", "Upload documentos", "Gerar alerta"]
  },
  recursos: {
    key: "recursos",
    title: "Recursos",
    description: "Programas, saldos, execucao e situacao de prestacao de contas.",
    icon: Landmark,
    cards: [
      { label: "PDDE", value: "R$ 2,4 mi", detail: "Recebido", tone: "blue" },
      { label: "FNDE", value: "R$ 3,1 mi", detail: "Recebido", tone: "green" },
      { label: "Saldo", value: "R$ 920 mil", detail: "Disponivel", tone: "yellow" }
    ],
    columns: [
      { key: "Programa", header: "Programa" },
      { key: "Ano", header: "Ano" },
      { key: "Recebido", header: "Valor recebido" },
      { key: "Executado", header: "Valor executado" },
      { key: "Saldo", header: "Saldo" },
      { key: "Situacao", header: "Prestacao" }
    ],
    rows: [
      { Programa: "PDDE", Ano: 2026, Recebido: "R$ 2.450.000", Executado: "R$ 1.920.000", Saldo: "R$ 530.000", Situacao: "Em dia" },
      { Programa: "FNDE", Ano: 2026, Recebido: "R$ 3.100.000", Executado: "R$ 2.020.000", Saldo: "R$ 1.080.000", Situacao: "Pendente" },
      { Programa: "Educacao Conectada", Ano: 2026, Recebido: "R$ 680.000", Executado: "R$ 410.000", Saldo: "R$ 270.000", Situacao: "Em analise" }
    ],
    actions: ["Novo recurso", "Filtrar programa", "Exportar"]
  },
  "biblioteca-sei": {
    key: "biblioteca-sei",
    title: "Biblioteca SEI",
    description: "Modelos de oficio, despacho, relatorio, parecer, ata e memorando.",
    icon: FileText,
    cards: [
      { label: "Modelos", value: "32", detail: "Documentos mockados", tone: "blue" },
      { label: "Mais usados", value: "Oficio", detail: "Ultimos 30 dias", tone: "green" }
    ],
    columns: [{ key: "Documento", header: "Documento" }, { key: "Tipo", header: "Tipo" }, { key: "Uso", header: "Uso" }],
    rows: [
      { Documento: "Oficio GPPE", Tipo: "Oficio", Uso: "Alto" },
      { Documento: "Parecer de prestacao", Tipo: "Parecer", Uso: "Medio" },
      { Documento: "Ata de conselho", Tipo: "Ata", Uso: "Alto" }
    ],
    actions: ["Gerar oficio", "Gerar despacho", "Gerar relatorio"]
  },
  "fnde-pdde": {
    key: "fnde-pdde",
    title: "FNDE/PDDE",
    description: "Biblioteca, consulta simulada, PDDEWeb, PDDE Interativo, resolucoes e manuais.",
    icon: ClipboardCheck,
    cards: [
      { label: "Consultas", value: "128", detail: "Simuladas", tone: "blue" },
      { label: "Repasses", value: "R$ 4,2 mi", detail: "Mock FNDE", tone: "green" },
      { label: "Pendencias", value: "7", detail: "SIGPC/PDDEWeb", tone: "red" }
    ],
    columns: [{ key: "Escola", header: "Escola" }, { key: "CNPJ", header: "CNPJ" }, { key: "INEP", header: "INEP" }, { key: "Situacao", header: "Situacao" }, { key: "Saldo", header: "Saldo" }],
    rows: [
      { Escola: "Acelina Alves", CNPJ: "00.000.000/0001-01", INEP: "52100001", Situacao: "Regular", Saldo: "R$ 12.400" },
      { Escola: "Joaquim Pedro", CNPJ: "00.000.000/0001-02", INEP: "52100029", Situacao: "Prestacao pendente", Saldo: "R$ 31.200" }
    ],
    actions: ["Consulta PDDE", "PDDEWeb", "Historico presidentes"]
  },
  "central-prazos": {
    key: "central-prazos",
    title: "Central de Prazos",
    description: "Alertas de 90, 30, 15 dias e vencidos para conselhos, FNDE, SIGPC, VAAR e emendas.",
    icon: CalendarClock,
    cards: [
      { label: "90 dias", value: "18", detail: "Monitorar", tone: "blue" },
      { label: "30 dias", value: "9", detail: "Priorizar", tone: "yellow" },
      { label: "Vencidos", value: "4", detail: "Critico", tone: "red" }
    ],
    columns: [{ key: "Objeto", header: "Objeto" }, { key: "Tipo", header: "Tipo" }, { key: "Prazo", header: "Prazo" }, { key: "Status", header: "Status" }],
    rows: [
      { Objeto: "Conselho Acelina", Tipo: "Conselho", Prazo: "12/08/2026", Status: "90 dias" },
      { Objeto: "PDDEWeb", Tipo: "PDDE", Prazo: "30/06/2026", Status: "30 dias" },
      { Objeto: "SIGPC", Tipo: "FNDE", Prazo: "15/06/2026", Status: "15 dias" }
    ],
    actions: ["Novo prazo", "Criar alerta", "Exportar agenda"]
  },
  "ia-educacional": {
    key: "ia-educacional",
    title: "IA Educacional",
    description: "Interface mockada para gerar textos administrativos e checklists.",
    icon: Bot,
    cards: [
      { label: "Comandos", value: "7", detail: "Modelos prontos", tone: "blue" },
      { label: "Rascunhos", value: "24", detail: "Mockados", tone: "green" }
    ],
    columns: [{ key: "Acao", header: "Acao" }, { key: "Resultado", header: "Resultado" }, { key: "Status", header: "Status" }],
    rows: [
      { Acao: "Gerar despacho SEI", Resultado: "Texto administrativo", Status: "Disponivel" },
      { Acao: "Gerar justificativa PDDE", Resultado: "Justificativa", Status: "Disponivel" },
      { Acao: "Gerar ata", Resultado: "Minuta", Status: "Disponivel" }
    ],
    actions: ["Gerar despacho SEI", "Gerar oficio", "Gerar justificativa PDDE", "Gerar checklist VAAR", "Gerar relatorio", "Gerar parecer", "Gerar ata"]
  },
  parceiros: {
    key: "parceiros",
    title: "Parceiros",
    description: "Area publicitaria independente, sem recomendacao oficial ou credenciamento.",
    icon: Network,
    cards: [
      { label: "Bronze", value: "8", detail: "Publicidade", tone: "slate" },
      { label: "Prata", value: "6", detail: "Publicidade", tone: "blue" },
      { label: "Ouro", value: "4", detail: "Publicidade", tone: "yellow" }
    ],
    columns: [{ key: "Nome", header: "Nome" }, { key: "Categoria", header: "Categoria" }, { key: "Telefone", header: "Telefone" }, { key: "WhatsApp", header: "WhatsApp" }, { key: "Plano", header: "Plano" }],
    rows: [
      { Nome: "Parceiro Demo Internet", Categoria: "Internet", Telefone: "(61) 99999-1111", WhatsApp: "Sim", Plano: "Ouro" },
      { Nome: "Parceiro Demo Grafica", Categoria: "Graficas", Telefone: "(61) 99999-2222", WhatsApp: "Sim", Plano: "Prata" },
      { Nome: "Parceiro Demo Cursos", Categoria: "Cursos", Telefone: "(61) 99999-3333", WhatsApp: "Nao", Plano: "Bronze" }
    ],
    actions: ["Novo parceiro", "Planos", "Revisar aviso"]
  },
  analytics: {
    key: "analytics",
    title: "Analytics",
    description: "Acessos, origem, dispositivos, downloads, cliques e tempo medio.",
    icon: PieChart,
    cards: [
      { label: "Visitantes totais", value: "12.480", detail: "Mock 30 dias", tone: "blue" },
      { label: "Unicos", value: "4.920", detail: "Usuarios distintos", tone: "green" },
      { label: "Downloads", value: "1.204", detail: "Arquivos baixados", tone: "yellow" }
    ],
    columns: [{ key: "Origem", header: "Origem" }, { key: "Acessos", header: "Acessos" }, { key: "Dispositivo", header: "Dispositivo" }, { key: "SO", header: "Sistema" }],
    rows: [
      { Origem: "Direto", Acessos: 5400, Dispositivo: "Desktop", SO: "Windows" },
      { Origem: "WhatsApp", Acessos: 3200, Dispositivo: "Mobile", SO: "Android" },
      { Origem: "Instagram", Acessos: 1800, Dispositivo: "Mobile", SO: "iOS" }
    ],
    actions: ["Linha", "Barras", "Pizza", "Mapa calor"]
  },
  relatorios: {
    key: "relatorios",
    title: "Relatorios",
    description: "Relatorios de escolas, conselhos, recursos, FNDE e acessos.",
    icon: FileArchive,
    cards: [
      { label: "Modelos", value: "5", detail: "PDF/Excel", tone: "blue" },
      { label: "Gerados", value: "74", detail: "Mockados", tone: "green" }
    ],
    columns: [{ key: "Relatorio", header: "Relatorio" }, { key: "Formato", header: "Formato" }, { key: "Status", header: "Status" }],
    rows: [
      { Relatorio: "Escolas", Formato: "PDF/Excel", Status: "Disponivel" },
      { Relatorio: "Conselhos", Formato: "PDF/Excel", Status: "Disponivel" },
      { Relatorio: "Recursos", Formato: "PDF/Excel", Status: "Disponivel" }
    ],
    actions: ["Exportar PDF", "Exportar Excel"]
  },
  mural: {
    key: "mural",
    title: "Mural",
    description: "Feed de documentos, noticias, resolucoes, avisos, eventos e parceiros.",
    icon: Megaphone,
    cards: [
      { label: "Publicacoes", value: "28", detail: "Feed ativo", tone: "blue" },
      { label: "Eventos", value: "6", detail: "Proximos", tone: "green" }
    ],
    columns: [{ key: "Tipo", header: "Tipo" }, { key: "Titulo", header: "Titulo" }, { key: "Data", header: "Data" }],
    rows: [
      { Tipo: "Aviso", Titulo: "Prazo de prestacao", Data: "26/05/2026" },
      { Tipo: "Resolucao", Titulo: "Conselhos escolares", Data: "20/05/2026" },
      { Tipo: "Evento", Titulo: "Formacao PDDE", Data: "10/06/2026" }
    ],
    actions: ["Nova publicacao", "Fixar aviso", "Agendar"]
  },
  feedback: {
    key: "feedback",
    title: "Feedback",
    description: "Sugestoes, avaliacoes, sentimentos e painel de retorno dos usuarios.",
    icon: MessageSquare,
    cards: [
      { label: "Media", value: "4,7", detail: "Estrelas", tone: "green" },
      { label: "Sugestoes", value: "32", detail: "Recebidas", tone: "blue" }
    ],
    columns: [{ key: "Nome", header: "Nome" }, { key: "Tipo", header: "Tipo" }, { key: "Estrelas", header: "Estrelas" }, { key: "Sentimento", header: "Sentimento" }],
    rows: [
      { Nome: "Usuario Demo", Tipo: "Sugestao", Estrelas: 5, Sentimento: "Positivo" },
      { Nome: "Gestor Demo", Tipo: "Erro", Estrelas: 4, Sentimento: "Neutro" }
    ],
    actions: ["Nova sugestao", "Ver graficos", "Responder"]
  },
  "redes-sociais": {
    key: "redes-sociais",
    title: "Redes Sociais",
    description: "Estrutura futura para Instagram, Facebook, YouTube, TikTok, LinkedIn, WhatsApp e Telegram.",
    icon: Share2,
    cards: [
      { label: "Canais", value: "7", detail: "Preparados", tone: "blue" },
      { label: "Posts", value: "42", detail: "Calendario mock", tone: "green" }
    ],
    columns: [{ key: "Canal", header: "Canal" }, { key: "Metricas", header: "Metricas" }, { key: "Status", header: "Status" }],
    rows: [
      { Canal: "Instagram", Metricas: "12.400 alcance", Status: "Planejado" },
      { Canal: "YouTube", Metricas: "820 visualizacoes", Status: "Planejado" },
      { Canal: "WhatsApp", Metricas: "Listas internas", Status: "Planejado" }
    ],
    actions: ["Compartilhar", "Calendario", "Metricas"]
  },
  arquivos: {
    key: "arquivos",
    title: "Arquivos",
    description: "Organizacao de documentos, uploads e biblioteca de arquivos.",
    icon: Archive,
    cards: [
      { label: "Arquivos", value: "214", detail: "Mockados", tone: "blue" },
      { label: "Pastas", value: "18", detail: "Categorias", tone: "green" }
    ],
    columns: [{ key: "Arquivo", header: "Arquivo" }, { key: "Categoria", header: "Categoria" }, { key: "Tamanho", header: "Tamanho" }],
    rows: [
      { Arquivo: "Manual PDDE.pdf", Categoria: "FNDE", Tamanho: "2.4 MB" },
      { Arquivo: "Modelo oficio.docx", Categoria: "SEI", Tamanho: "180 KB" }
    ],
    actions: ["Upload", "Nova pasta", "Exportar lista"]
  },
  administracao: {
    key: "administracao",
    title: "Administracao",
    description: "Cadastros centrais, analytics, auditoria e configuracoes futuras.",
    icon: Settings,
    cards: [
      { label: "Cadastros", value: "6", detail: "Areas", tone: "blue" },
      { label: "Logs", value: "1.248", detail: "Auditoria mock", tone: "slate" }
    ],
    columns: [{ key: "Modulo", header: "Modulo" }, { key: "Permissao", header: "Permissao" }, { key: "Status", header: "Status" }],
    rows: [
      { Modulo: "Cadastro escolas", Permissao: "Admin", Status: "Ativo" },
      { Modulo: "Cadastro parceiros", Permissao: "Admin", Status: "Ativo" },
      { Modulo: "Auditoria", Permissao: "Admin", Status: "Planejado" }
    ],
    actions: ["Cadastro escolas", "Cadastro parceiros", "Auditoria"]
  },
  auditoria: {
    key: "auditoria",
    title: "Auditoria",
    description: "Logs de usuario, acao, documento, pagina, dispositivo e IP mascarado.",
    icon: ShieldCheck,
    cards: [
      { label: "Logs hoje", value: "96", detail: "Mockados", tone: "blue" },
      { label: "Alertas", value: "3", detail: "Revisar", tone: "yellow" }
    ],
    columns: [{ key: "Data", header: "Data" }, { key: "Hora", header: "Hora" }, { key: "Usuario", header: "Usuario" }, { key: "Acao", header: "Acao" }, { key: "Pagina", header: "Pagina" }, { key: "IP", header: "IP mascarado" }],
    rows: [
      { Data: "26/05/2026", Hora: "09:12", Usuario: "admin@demo", Acao: "Visualizou", Pagina: "Dashboard", IP: "192.168.*.*" },
      { Data: "26/05/2026", Hora: "09:18", Usuario: "tecnico@demo", Acao: "Exportou", Pagina: "Relatorios", IP: "10.0.*.*" }
    ],
    actions: ["Filtrar logs", "Exportar", "Gerar parecer"]
  }
};
