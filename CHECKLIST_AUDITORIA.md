# Checklist de Auditoria GPPE

Data da auditoria: 2026-05-26

## Cobertura

- Itens avaliados: 72
- Cobertura antes da auditoria: 54/72 = 75%
- Cobertura depois das correcoes desta auditoria: 62/72 = 86%
- Itens corrigidos nesta auditoria: 8
- Itens pendentes com bloqueio/escopo complementar: 10

## Banco de Dados, RLS e Segurança

1. [ok] `school_units` existe e atende campos principais.
2. [ok] `resource_programs` existe em migration operacional.
3. [ok] `unit_financial_balances` existe em migration operacional.
4. [ok] `financial_movements` existe em migration operacional.
5. [ok] `accountabilities` foi estendida com programa, protocolo, observacoes e status operacional.
6. [ok] `school_councils` foi estendida com vice, datas e campos de regularidade.
7. [ok] `council_members` existe.
8. [ok] `required_documents` existe.
9. [ok] `document_records` existe.
10. [ok] `alerts` foi estendida com `source_module`.
11. [ok] `analytics_events` existe.
12. [ok] `support_tickets` existe.
13. [ok] `fnde_links` existe e tem seed.
14. [ok] `transparency_snapshots` existe.
15. [ok] `recursos_educacionais` existe com select publico e escrita restrita.
16. [ok] Migrations usam timestamp em `supabase/migrations`.
17. [ok] `CREATE TABLE IF NOT EXISTS` usado nas tabelas novas.
18. [ok] `CREATE INDEX IF NOT EXISTS` usado nos indices.
19. [ok] `DROP POLICY IF EXISTS` antes das policies novas.
20. [ok] Funcoes usam `CREATE OR REPLACE FUNCTION`.
21. [ok] RLS habilitada nas tabelas operacionais.
22. [ok] Trigger `handle_new_user` restaurado em migration corretiva.
    - corrigido em 2026-05-26: criada `20260526213000_auditoria_rls_profiles_storage.sql`.
23. [ok] `profiles.access_status` e `profiles.access_requested_at` presentes.
    - corrigido em 2026-05-26: migration corretiva garante colunas idempotentes.
24. [ok] Storage `gppe-documentos` preparado para uploads autenticados.
    - corrigido em 2026-05-26: migration corretiva criou bucket e policies.
25. [ok] Nenhuma `SUPABASE_SERVICE_ROLE_KEY` em client component.
26. [ok] `.env`, `.env.local` e variantes estão no `.gitignore`.
27. [ok] Fallback com chave anon real removido do código.
    - corrigido em 2026-05-26: `src/lib/supabase/config.ts`.
28. [parcial] Validação com zod não foi adotada porque a dependência não existe no projeto.
    - ver `BLOQUEIOS.md`.

## Rotas e Funcionalidades

29. [ok] `/dashboard` existe com indicadores e pendências em ordem alfabetica.
30. [ok] `/escolas` existe com listagem e filtros.
31. [ok] `/unidades` existe.
32. [ok] `/unidades/[id]` existe.
33. [parcial] Detalhe de unidade existe, mas nem todas as abas têm edição completa.
34. [ok] `/recursos` existe com formulário de movimentação financeira.
35. [parcial] Exportar Excel/PDF existe em componentes, mas precisa validação visual completa em todos os filtros.
36. [ok] `/organizacao-financeira` existe com mapa, linha do tempo, radar e conciliação.
37. [ok] `/conselhos` existe com dados dos conselhos.
38. [parcial] Formulário de conselho cria registros, mas histórico de alterações completo não foi implementado.
39. [ok] `/prestacao-contas` prioriza pendentes/vencidos.
40. [ok] `/central-prazos` existe.
41. [parcial] Alertas automáticos por evento real ainda dependem de triggers/funções específicas por cenário.
42. [ok] `/regularidade-documental` existe.
43. [ok] `/arquivos` existe com upload.
44. [parcial] Upload real depende da aplicação da migration do bucket no Supabase real.
45. [ok] `/transparencia` existe com saldos por programa.
46. [ok] `/analytics` existe.
47. [parcial] Registro automático de eventos nos principais cliques ainda não cobre todos os módulos.
48. [ok] `/suporte-unidades` existe com abertura de chamado.
49. [ok] `/ia-educacional` existe com geração determinística por templates.
50. [ok] `/fnde-pdde` existe com links oficiais.
51. [ok] `/recursos-educacionais` consome Supabase com fallback.
52. [ok] `/admin/recursos-educacionais` protegido por role no middleware.
53. [parcial] CRUD completo com editar/excluir/confirmar exclusão não está uniforme em todos os módulos.
    - ver `BLOQUEIOS.md`.

## Design, UX e Acessibilidade

54. [ok] Componentes-base existem em `src/components/ui`.
55. [ok] Paleta e tokens existem em `globals.css`.
56. [ok] `sme.*` no Tailwind deixou de usar hex literal.
    - corrigido em 2026-05-26: `tailwind.config.ts`.
57. [ok] Shell autenticado com sidebar/drawer existe.
58. [ok] Middleware protege rotas privadas.
59. [ok] `/admin/*` exige `admin_sme` ou `tecnico_gppe`.
60. [ok] Não autenticado redireciona para `/login`.
61. [ok] Usuário autenticado em `/login` ou `/cadastro` redireciona para `/dashboard`.
62. [ok] `loading.tsx` global para rotas privadas criado.
    - corrigido em 2026-05-26: `src/app/(app)/loading.tsx`.
63. [ok] `error.tsx` global para rotas privadas criado.
    - corrigido em 2026-05-26: `src/app/(app)/error.tsx`.
64. [ok] `loading.tsx` e `error.tsx` criados para `/admin`.
65. [ok] Focus-visible global existe.
66. [parcial] Há classes `outline-none` em inputs antigos, mas com substituto `focus:ring`; refatoração total para componentes UI fica como melhoria.
67. [parcial] Há cores hardcoded em algumas telas públicas/legadas.
    - ver `PENDENCIAS.md`.
68. [ok] Portal público tem busca, filtro e grid responsivo.
69. [ok] Textos principais estão em pt-BR.
70. [ok] Moeda/datas principais usam helpers de formatação brasileira.
71. [parcial] Tabelas mobile/cards não estão uniformes em todos os módulos legados.
72. [ok] `npm run lint` e `npm run build` devem ser executados na fase de verificação.
