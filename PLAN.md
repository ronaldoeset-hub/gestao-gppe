# Plano de Implementacao GPPE/EduConecta

## Estado Atual

- Projeto Next.js 14 com App Router, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage e componentes locais.
- Fluxo de login, cadastro, nova senha e bloqueio por aprovacao ja existe.
- A tela `/perfis` recebeu painel de aprovacao de acessos e deve ser preservada.
- O banco ja tem `profiles`, `school_units`, `school_councils`, `resource_transfers`, `accountabilities`, `documents` e `alerts` em SQL base, mas ainda precisa de modelo operacional mais amplo.
- Ha dados mockados e alguns imports SQL de conselhos/unidades.
- O design atual usa azul, amarelo e verde institucionais, mas ainda ha classes hardcoded e componentes sem sistema unificado.

## Plano de Engenharia

- Preservar funcionalidades existentes antes de expandir:
  - autentificacao e middleware;
  - aprovacao de usuarios em `/perfis`;
  - rotas publicas `/login`, `/cadastro`, `/nova-senha`, `/recursos-educacionais`;
  - rotas privadas ja existentes.
- Criar uma camada de design system antes de telas novas:
  - tokens em `globals.css`;
  - extensoes de tema em `tailwind.config.ts`;
  - componentes base em `src/components/ui`.
- Criar migrations idempotentes em `supabase/migrations` para a base operacional:
  - programas de recurso;
  - movimentos financeiros;
  - saldos por unidade/programa;
  - prestacoes de contas;
  - conselhos e membros;
  - documentos obrigatorios e registros documentais;
  - alertas;
  - eventos de analytics;
  - chamados de suporte;
  - links FNDE/PDDE;
  - snapshots de transparencia.
- Manter compatibilidade com tabelas existentes:
  - usar `alter table if exists` quando for estender estruturas atuais;
  - evitar renomear colunas usadas por telas atuais;
  - usar views/funcoes quando ajudar a consolidar dados sem quebrar queries antigas.
- Organizar consultas Supabase:
  - manter fallback para dados mockados onde o banco nao estiver configurado;
  - criar tipos e helpers para indicadores do dashboard;
  - separar operacoes de leitura e escrita quando necessario.
- Implementar funcionalidades por ordem de valor:
  1. migrations e seeds;
  2. dashboard operacional;
  3. recursos financeiros;
  4. prestacao de contas;
  5. alertas e prazos;
  6. unidades/escolas;
  7. conselhos;
  8. transparencia;
  9. arquivos/documentos;
  10. regularidade documental;
  11. suporte;
  12. analytics;
  13. IA Educacional por templates.
- Validar a cada ciclo:
  - `npm run build`;
  - checagem visual local das telas principais;
  - `git status --short` antes de commit.

## Plano de Design

- Direcao visual:
  - institucional, limpa, densa o suficiente para trabalho administrativo;
  - hierarquia forte, pouco ornamento e bastante legibilidade;
  - azul profundo como cor de confianca, neutros frios para base, amarelo somente para alertas/prazos.
- Paleta:
  - primaria: azul institucional profundo;
  - secundaria: azul claro/teal para estados informativos;
  - sucesso: verde discreto;
  - aviso: amarelo/ambar;
  - perigo: vermelho sobrio;
  - neutros: slate/cinza frio.
- Tipografia:
  - `Inter` com fallback `system-ui`;
  - corpo entre 14 e 16px;
  - titulos compactos e fortes;
  - evitar hero typography dentro de paineis administrativos.
- Layout:
  - shell autenticado com sidebar fixa no desktop e drawer no mobile;
  - topbar com contexto do usuario, pendencias e logout;
  - conteudo com largura maxima e padding consistente.
- Componentes base:
  - `Button`, `Input`, `Label`, `Select`, `Textarea`, `Card`, `Badge`, `Dialog`, `Toast`, `Tabs`, `Table`, `EmptyState`, `LoadingSpinner`, `PageHeader`, `Breadcrumb`.
- Padroes:
  - cada pagina privada com `PageHeader`;
  - tabelas viram cards em telas pequenas;
  - formularios longos em cards por secao;
  - estados vazios com texto util e CTA;
  - foco visivel em todos os controles.
- Acessibilidade:
  - contraste AA;
  - labels reais;
  - `aria-label` em botoes iconicos;
  - `aria-live` em mensagens;
  - dialog com escape, foco e botao de fechar.

## Riscos e Decisoes

- A tarefa e grande; a implementacao deve ser incremental para manter o build verde.
- Sem acesso direto ao Supabase remoto, migrations serao entregues para aplicacao no Studio/CLI.
- Dados reais ausentes devem aparecer como "Nao informado" e campos editaveis, sem inventar informacao sensivel.
- O prompt original pedia push direto para `main`, mas a regra mais recente pede branch `feat/implementacao-gppe-completo`; prevalece a regra mais recente.
