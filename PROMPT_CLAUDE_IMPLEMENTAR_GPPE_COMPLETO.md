# Prompt para Claude - Implementacao completa do sistema GPPE/EduConecta

Voce vai trabalhar no projeto Next.js abaixo:

`C:\Users\Admin\OneDrive\Codex\SITE - GPPE\PUBLICAR_GITHUB_GESTAO_GPPE`

Objetivo: transformar o prototipo EduConecta/GPPE em um sistema operacional para alimentacao real de dados de escolas, creches, conselhos escolares, recursos financeiros, prestacoes de contas, transparencia, arquivos, suporte e IA educacional.

Importante:
- Preserve as alteracoes existentes no projeto, especialmente o fluxo recente de aprovacao de usuarios em `/perfis`.
- Antes de editar, rode `git status --short --branch` e entenda o que ja esta modificado.
- Nao sobrescreva `.env.local`, chaves do Supabase ou qualquer segredo.
- Nao invente dados reais sensiveis. Quando faltar informacao, use campos editaveis e status "nao informado".
- Implemente em etapas pequenas, com build passando ao final.
- Depois de concluir, rode `npm install` se necessario, `npm run build`, `git status`, `git add -A`, `git commit -m "Implementar base operacional GPPE"` e `git push origin main`.
- Se o deploy estiver conectado ao GitHub/Vercel, o push para `main` deve disparar a publicacao automaticamente. Se houver erro de credencial, parar e relatar exatamente o comando que faltou autorizar.

## Contexto do projeto

Stack atual:
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth, Database e Storage
- Lucide React
- Exportacao PDF/Excel ja aparece nas dependencias

Rotas e areas existentes:
- `/dashboard`
- `/escolas`
- `/conselhos`
- `/recursos`
- `/prestacao-contas`
- `/central-prazos`
- `/documentos`
- `/arquivos`
- `/analytics`
- `/transparencia`
- `/ia-educacional`
- `/perfis`
- `/cadastro`
- `/login`

Ja existe uma estrutura de Supabase em `supabase/schema.sql`, `supabase/cadastro-acesso.sql` e `supabase/updates`.

## Prioridade maxima

Criar uma base real de banco de dados e telas funcionais para o GPPE com alimentacao por usuario autorizado.

Perfis:
- `admin_sme`: acesso total, aprova usuarios, configura tudo.
- `tecnico_gppe`: alimenta dados financeiros, conselhos, prazos, arquivos, suporte e regularidade.
- `gestor_escolar`: visualiza e alimenta somente sua unidade quando permitido.
- `conselho_escolar`: visualiza dados vinculados ao conselho/unidade.

Manter e respeitar RLS no Supabase.

## Banco de dados

Criar uma nova migration em `supabase/updates/YYYY-MM-DD-base-operacional-gppe.sql` com tabelas e politicas para:

1. `school_units`
   - id, name, inep, cnpj, type, district, address, manager_name, email, phone, active, created_at, updated_at.
   - Deve suportar escola, creche, CEMEI e conveniada.
   - Deve listar todas as unidades ja existentes nos seeds/imports atuais do projeto. Se houver duplicatas entre dados mockados/importados, consolidar por nome.

2. `resource_programs`
   - id, name, acronym, source, official_url, description, active.
   - Programas iniciais: PDDE, FNDE, PDDE Basico, PDDE Qualidade, PDDE Estrutura, Educacao Conectada, PNATE se aplicavel, outros programas que ja aparecem no projeto.

3. `unit_financial_balances`
   - id, school_unit_id, program_id, fiscal_year, opening_balance, received_amount, spent_amount, committed_amount, available_balance, updated_at.
   - O saldo deve ser calculavel/atualizavel a partir dos lancamentos.

4. `financial_movements`
   - id, school_unit_id, program_id, movement_type (`receita`, `despesa`, `estorno`, `ajuste`), amount, movement_date, description, document_number, supplier_name, expense_category (`custeio`, `capital`, `outros`), created_by, created_at.
   - Tecnico GPPE pode inserir e editar. Admin pode tudo. Gestor escolar so da sua unidade, se permitido.

5. `accountabilities`
   - id, school_unit_id, program_id, reference_period, due_date, submitted_at, status (`nao_entregue`, `em_analise`, `aprovada`, `reprovada`, `pendente_correcao`), protocol, notes, created_at, updated_at.
   - Tela inicial deve listar em ordem alfabetica todas as unidades com status `nao_entregue` ou prazo vencido.

6. `school_councils`
   - id, school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, expected_members_count, registry_date, status (`regular`, `atencao`, `pendente`, `vencido`), notes.
   - Usar os dados ja existentes nos imports de conselho em `supabase/imports` quando houver.

7. `council_members`
   - id, council_id, name, role, cpf_masked, phone, email, start_date, end_date, active.
   - Nao armazenar CPF aberto; somente mascarado quando existir.

8. `required_documents`
   - id, scope (`unidade`, `conselho`, `prestacao`, `financeiro`), name, description, required, validity_months.

9. `document_records`
   - id, school_unit_id, council_id, accountability_id, category, title, storage_path, expiration_date, status (`valido`, `vencendo`, `vencido`, `pendente`), uploaded_by, created_at.
   - Integrar com Supabase Storage.

10. `alerts`
   - id, school_unit_id, title, description, severity (`baixa`, `media`, `alta`, `critica`), due_date, resolved_at, source_module.
   - Gerar alertas automaticos para conselhos vencendo, prestacao nao entregue, documentos vencidos e saldos inconsistentes.

11. `analytics_events`
   - id, user_id, event_name, path, module, school_unit_id, metadata jsonb, created_at.
   - Registrar acessos reais a modulos e acoes importantes.

12. `support_tickets`
   - id, school_unit_id, opened_by, assigned_to, title, description, priority, status, created_at, updated_at.
   - Area "Suporte as unidades".

13. `fnde_links`
   - id, title, url, category, description, active.
   - Criar seed com links oficiais listados abaixo.

14. `transparency_snapshots`
   - id, fiscal_year, program_id, school_unit_id, total_received, total_spent, available_balance, generated_at.
   - Deve permitir gerar transparencia por programa e por unidade.

Criar indices para campos de busca e chaves estrangeiras. Criar triggers `updated_at`.

## Links oficiais FNDE/PDDE para cadastrar

Use estes links oficiais como seeds em `fnde_links` e cards clicaveis na area FNDE/PDDE:

- FNDE: https://www.gov.br/fnde
- PDDE - pagina oficial: https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde
- Acoes Integradas do PDDE: https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pdde/acoes-integradas
- PDDEWeb: https://www.fnde.gov.br/pdde/brasilcidadao.do
- Sistema PDDE: https://www.fnde.gov.br/pdde/manterexecutora.do
- Consulta Escola PDDE: https://www.fnde.gov.br/pddeinfo/pddeinfo/escola/consultar
- SiGPC / Contas Online: https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/acoes/prestacao-de-contas/como-acessar-o-sigpc
- SiGPC sistema: https://www.fnde.gov.br/sigpc
- Manual SiGPC: https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/acoes/prestacao-de-contas/materiais-de-apoio-sigpc

Se algum link tiver mudado, manter o link acima e adicionar fallback para a pagina oficial do FNDE.

## Telas e funcionalidades

### Dashboard

Melhorar visual e dinamica:
- Cards reais com:
  - total de unidades
  - unidades com prestacao nao entregue
  - conselhos vencidos/vencendo
  - saldo total por programa
  - documentos vencidos
  - alertas criticos
  - chamados abertos
- Bloco principal "Unidades pendentes de prestacao de contas" em ordem alfabetica.
- Acoes rapidas: "Alimentar recurso", "Registrar prestacao", "Enviar documento", "Abrir suporte", "Gerar transparencia".
- Graficos simples e elegantes sem depender de biblioteca pesada, usando CSS/SVG/HTML se necessario.

### Escolas e creches

Ao clicar em `/escolas`:
- Mostrar todas as unidades em seus lugares, com filtros por tipo, bairro/distrito, status de conselho e status financeiro.
- Cada unidade deve ter pagina de detalhes com abas:
  - Visao geral
  - Financeiro
  - Conselho
  - Prestacao de contas
  - Documentos
  - Alertas
  - Suporte
- Permitir editar dados basicos conforme perfil.

### Controle de recursos financeiros

Em `/recursos`:
- Criar formulario para tecnico GPPE alimentar valores por unidade e programa:
  - programa
  - ano
  - valor recebido
  - valor gasto
  - saldo
  - categoria custeio/capital
  - data
  - documento/protocolo
  - observacao
- Mostrar tabela filtravel por unidade, programa, ano e status.
- Gerar saldo automaticamente a partir dos movimentos.
- Criar botao "Exportar Excel" e "Gerar PDF".

### Organizacao financeira

Criar uma area surpreendente e util, podendo ser `/organizacao-financeira` ou integrada em `/recursos`:
- "Mapa financeiro da rede": matriz unidade x programa com cores para saldo zerado, saldo alto, gasto acima do esperado, sem alimentacao.
- "Linha do tempo do recurso": recebimento, empenho/gasto, documento, prestacao, analise.
- "Radar de risco": alerta para unidade com saldo parado, prestacao atrasada, documento ausente, conselho vencido.
- "Conciliacao rapida": campo para comparar saldo informado x saldo calculado.

Adicionar o menu se criar rota nova.

### Conselhos Escolares

Em `/conselhos`:
- Exibir dados ja existentes dos conselhos por unidade.
- Ao clicar em uma unidade/conselho, mostrar:
  - presidente, vice, membros
  - mandato
  - documentos exigidos
  - status de regularidade
  - alertas de vencimento
  - historico de alteracoes
- Criar formulario para atualizar dados do conselho.

### Prestacao de contas

Em `/prestacao-contas` e tambem no dashboard:
- Listar primeiro, em ordem alfabetica, todas as unidades pendentes ou que nao entregaram.
- Filtros por programa, ano, status e prazo.
- Formulario para registrar entrega:
  - unidade
  - programa
  - periodo
  - data de entrega
  - protocolo
  - status de analise
  - observacoes
- Quando registrar entrega, atualizar alertas automaticamente.

### Alertas e prazos

Em `/central-prazos`:
- Mostrar alertas reais do banco:
  - prestacao atrasada
  - conselho vencendo/vencido
  - documento vencido
  - saldo sem movimentacao
  - pendencia de suporte
- Permitir marcar como resolvido.
- Criar visual por prioridade, prazo e unidade.

### Regularidade documental

Criar rota/menu "Regularidade documental" ou integrar a `/documentos`:
- Checklist por unidade.
- Status por documento: pendente, valido, vencendo, vencido.
- Upload de arquivo.
- Data de validade.
- Alertas automaticos.
- Visao em matriz por unidade para o GPPE identificar rapidamente quem esta irregular.

### Arquivos

Em `/arquivos`:
- Upload real para Supabase Storage.
- Associar arquivo a unidade, conselho, recurso ou prestacao.
- Categorias: financeiro, conselho, prestacao, oficio, parecer, ata, comprovante, outros.
- Busca por unidade, categoria e data.
- Visualizacao/baixar arquivo.

### Transparencia

Em `/transparencia`:
- Criar campo para gerar saldo separado por programa.
- Filtros:
  - ano
  - programa
  - unidade
  - tipo de unidade
- Cards:
  - recebido
  - gasto
  - saldo
  - percentual executado
- Quando os dados financeiros forem atualizados, a transparencia deve refletir automaticamente.
- Botao "Gerar relatorio publico" com PDF/Excel.

### Analytics

Em `/analytics`:
- Registrar dados reais de acesso e acoes em `analytics_events`.
- Mostrar:
  - acessos por modulo
  - usuarios ativos
  - unidades mais consultadas
  - acoes realizadas
  - eventos por dia
- Implementar um helper simples para registrar eventos nos principais cliques e paginas.

### Suporte as unidades

Criar rota/menu "Suporte as unidades":
- Abrir chamado vinculado a unidade.
- Prioridade, status e responsavel.
- Historico de atendimento.
- Cards: abertos, urgentes, respondidos, resolvidos.
- Filtro por unidade.

### IA Educacional

Em `/ia-educacional`, criar algo marcante para o municipio:

"Assistente GPPE Inteligente"
- Gera checklist automatico para uma unidade com base em:
  - conselho
  - prestacao de contas
  - documentos
  - saldo financeiro
  - alertas
- Gera minuta de oficio, despacho, parecer ou notificacao usando os dados do sistema.
- Gera "Diagnostico da Unidade" com semaforo:
  - financeiro
  - documental
  - conselho
  - prestacao
  - suporte
- Se nao houver API de IA configurada, criar geracao deterministica por templates, ja funcionando.
- Se houver `OPENAI_API_KEY` ou outra chave no ambiente, deixar arquitetura opcional para chamada futura, sem quebrar quando nao existir chave.

### FNDE/PDDE

Em `/fnde-pdde`:
- Criar central com links oficiais.
- Cards para PDDE, PDDEWeb, Consulta Escola, SiGPC, manuais, resolucoes e prestacao.
- Campo de anotacoes por unidade sobre situacao FNDE/PDDE.
- Botao para abrir link oficial em nova aba.
- Nao fazer scraping nem login automatico em sistemas oficiais.

## UX e visual

Melhorar sem perder sobriedade:
- Interface administrativa moderna, densa e clara.
- Evitar telas vazias. Cada menu deve mostrar informacao util ou formulario funcional.
- Usar cards apenas para itens repetidos ou paines pequenos; evitar excesso visual.
- Usar icones lucide nos botoes.
- Garantir mobile e desktop.
- Nao usar texto explicando "como usar" em excesso; a tela deve ser intuitiva.
- Usar estados vazios elegantes quando nao houver dados.

## Regras de implementacao

- Preferir Server Components para leitura inicial e Client Components para formularios.
- Criar componentes reutilizaveis para:
  - filtros
  - status badges
  - cards financeiros
  - formularios de unidade/programa
  - tabelas com acoes
- Nao criar dependencias novas sem necessidade.
- Se precisar de graficos, primeiro tentar HTML/CSS/SVG simples.
- Validar TypeScript.
- Preservar os nomes de rotas existentes.
- Adicionar novas rotas ao menu lateral quando fizer sentido:
  - Organizacao financeira
  - Regularidade documental
  - Suporte as unidades

## Entrega esperada

1. Migration SQL criada em `supabase/updates`.
2. Seeds basicos criados ou incorporados.
3. Queries Supabase organizadas em `src/lib/supabase/queries.ts` ou arquivos separados.
4. Telas funcionando para alimentar dados reais.
5. Dashboard melhorado.
6. Notificacoes/alertas funcionando com dados do banco.
7. Transparencia recalculando saldos por programa.
8. IA Educacional com gerador de diagnostico/checklists/minutas mesmo sem API externa.
9. Build passando com `npm run build`.
10. Commit e push em `main`.

## Ordem sugerida para nao estourar creditos

Se os creditos acabarem, priorize nesta ordem:

1. Banco de dados + migrations + RLS.
2. Dashboard com pendencias alfabeticas.
3. Recursos financeiros alimentaveis por tecnico GPPE.
4. Prestacao de contas e alertas.
5. Escolas/creches com detalhes.
6. Conselhos Escolares.
7. Transparencia por programa.
8. Arquivos com upload.
9. Regularidade documental.
10. Suporte as unidades.
11. Analytics real.
12. IA Educacional marco.
13. Melhorias visuais finais.

Ao final de cada etapa, deixe o sistema em estado executavel.
