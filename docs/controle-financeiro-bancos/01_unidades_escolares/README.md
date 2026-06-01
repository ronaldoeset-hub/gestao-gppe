# 01 - Unidades escolares

Banco base das unidades atendidas pelo controle financeiro.

Tabela Supabase relacionada:

- `school_units`

Use este cadastro antes de importar repasses, planejamento, pagamentos e documentos.

Campos principais:

- `external_id`: codigo interno opcional.
- `nome`: nome completo da unidade.
- `inep`: codigo INEP.
- `tipo`: `escola`, `creche`, `cemei` ou `conveniada`.
- `bairro`: bairro ou regiao.
- `ativo`: `true` ou `false`.

