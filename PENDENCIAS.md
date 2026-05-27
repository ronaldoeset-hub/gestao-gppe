# Pendências Técnicas Mapeadas

Data: 2026-05-26

- Refatorar telas públicas antigas para remover hex literais remanescentes em `className`, especialmente `/recursos-educacionais` e `/aviso-institucional`.
- Trocar inputs antigos com `outline-none` por componentes de `src/components/ui` em formulários legados.
- Padronizar tabelas mobile-card em módulos legados que ainda usam composição própria.
- Ampliar registro de `analytics_events` para todos os principais cliques e páginas.
- Validar visualmente upload/download no Supabase real depois de aplicar a migration `20260526213000_auditoria_rls_profiles_storage.sql`.
