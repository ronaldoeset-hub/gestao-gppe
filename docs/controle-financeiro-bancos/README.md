# Controle financeiro - mapa dos bancos de dados

Esta pasta organiza os dados que precisam ser alimentados para criar um controle financeiro parecido com a planilha original:

`outputs/dashboard_recursos_unidade_gppe.xlsx`

A planilha de referencia tem as abas:

- `Dashboard`
- `Base Recursos`
- `Como alimentar`

A base original usa principalmente estes campos:

- Unidade escolar
- Tipo de recurso (`CUSTEIO` ou `CAPITAL`)
- Item
- Quantidade
- Unidade
- Valor unitario
- Valor total
- Observacao

## Estrutura sugerida

1. `01_unidades_escolares`
   - Cadastro das escolas, creches, CEMEIs e conveniadas.

2. `02_periodos_programas`
   - Periodos financeiros e programas de recurso.

3. `03_repasses_alocacoes`
   - Valor planejado, recebido e saldo por unidade, programa e tipo de recurso.

4. `04_planejamento_itens`
   - Itens de custeio/capital, quantidades e valores unitarios.

5. `05_fornecedores`
   - Fornecedores, prestadores e dados de pagamento.

6. `06_movimentacoes_pagamentos`
   - Compras, pagamentos, devolucoes e ajustes.

7. `07_documentos_comprovantes`
   - Notas fiscais, comprovantes, extratos, pareceres e documentos anexos.

8. `08_prestacao_contas_alertas`
   - Situacao da prestacao de contas, prazos e alertas financeiros.

## SQL do banco

O arquivo principal para criar as tabelas no Supabase esta em:

`supabase/updates/2026-05-31-controle-financeiro.sql`

Ele cria uma estrutura parecida com a planilha original, mas mais forte para sistema:

- Tabelas normalizadas
- Indices
- RLS por perfil/unidade
- View `v_controle_financeiro_original_like`, que entrega os dados em formato parecido com a planilha

## Ordem recomendada de alimentacao

1. Alimentar ou revisar `school_units`.
2. Alimentar periodos financeiros.
3. Alimentar programas.
4. Alimentar repasses/alocacoes.
5. Alimentar itens planejados.
6. Alimentar fornecedores.
7. Alimentar movimentacoes/pagamentos.
8. Alimentar documentos.
9. Alimentar prestacoes e alertas.

## Observacao importante

Os CSVs desta pasta sao modelos de alimentacao. O banco real deve usar IDs internos do Supabase, mas os modelos usam nomes/codigos legiveis para facilitar a importacao.

