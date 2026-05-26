# Registro de Decisoes e Conflitos

## 2026-05-26

- O prompt `PROMPT_CLAUDE_IMPLEMENTAR_GPPE_COMPLETO.md` pedia commit e push direto para `main`.
- A instrucao mais recente pediu criar a branch `feat/implementacao-gppe-completo` e nao fazer merge automatico em `main`.
- Decisao: prevalece a instrucao mais recente. A entrega deve ser feita em branch de feature para abertura de PR.

## Preservacao

- O fluxo de aprovacao de usuarios em `/perfis` foi preservado.
- As rotas existentes foram mantidas.
- A migration nova foi criada em `supabase/migrations` sem apagar SQLs antigos em `supabase/updates`.
