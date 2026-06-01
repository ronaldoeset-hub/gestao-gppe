# Aplicacao automatica no Supabase

Este projeto agora possui um aplicador automatico para migrations SQL.

## Variavel necessaria

Defina uma URL PostgreSQL administrativa em `.env.local` ou `.env`:

```env
SUPABASE_DB_URL=postgresql://postgres.seu-ref:sua-senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Use a senha do banco do projeto Supabase. A anon key nao tem permissao para criar tabelas, RLS ou policies.

## Comandos

Aplicar somente updates e Storage em banco ja existente:

```bash
npm run supabase:apply
```

Simular sem executar SQL:

```bash
npm run supabase:apply:dry
```

Aplicar tambem `supabase/schema.sql` em banco novo:

```bash
npm run supabase:apply:base
```

## Como funciona

O script executa, em ordem:

1. Arquivos `supabase/updates/*.sql`
2. Arquivo `supabase/storage.sql`

Depois registra cada arquivo em `public.gppe_migration_log`, evitando reaplicacao em proximas execucoes.

## Observacao

Se alguma migration ja foi aplicada manualmente antes da criacao de `public.gppe_migration_log`, o script pode tentar executar esse arquivo uma vez. As migrations novas foram ajustadas para serem idempotentes sempre que possivel.
