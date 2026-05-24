# Organização dos dados do GPPE

Este documento orienta onde alimentar cada informação do sistema.

## Unidades escolares

Tabela: `school_units`

Use para cadastrar escolas, creches, CEMEI e unidades conveniadas.

Campos principais:

- `name`: nome oficial da unidade
- `inep`: código INEP
- `type`: `escola`, `creche`, `cemei` ou `conveniada`
- `district`: bairro/setor
- `address`: endereço completo
- `manager_name`: gestor(a)
- `phone`: telefone
- `email`: e-mail institucional

## Conselhos escolares

Tabela: `school_councils`

Use para registrar o conselho vinculado a cada unidade.

Campos principais:

- `school_unit_id`: unidade escolar
- `president_name`: presidente
- `vice_president_name`: vice-presidente
- `mandate_start`: início do mandato
- `mandate_end`: fim do mandato
- `members_count`: quantidade de membros
- `status`: `regular`, `atencao`, `pendente` ou `vencido`
- `notes`: observações

## Recursos

Tabela: `resource_transfers`

Use para registrar repasses e recursos por unidade.

Campos principais:

- `school_unit_id`: unidade escolar
- `program`: programa ou ação
- `source`: fonte do recurso
- `amount`: valor recebido
- `released_at`: data de liberação
- `balance`: saldo atual
- `status`: situação do recurso

## Prestação de contas

Tabela: `accountabilities`

Use para controlar prazos, envios e pareceres.

Campos principais:

- `school_unit_id`: unidade escolar
- `resource_transfer_id`: recurso relacionado, quando houver
- `reference_period`: período de referência
- `due_date`: prazo final
- `submitted_at`: data de envio
- `approved_at`: data de aprovação
- `status`: situação
- `technical_opinion`: parecer técnico

## Documentos

Tabela: `documents`

Arquivos ficam no Supabase Storage, bucket `documentos-gppe`. O registro fica na tabela `documents`.

Campos principais:

- `school_unit_id`: unidade escolar
- `accountability_id`: prestação relacionada, quando houver
- `uploaded_by`: usuário que enviou
- `title`: título do documento
- `category`: categoria
- `storage_path`: caminho do arquivo no Storage
- `mime_type`: tipo do arquivo
- `file_size`: tamanho do arquivo

## Alertas

Tabela: `alerts`

Use para pendências, prazos e avisos.

Campos principais:

- `school_unit_id`: unidade escolar, opcional
- `title`: título
- `description`: descrição
- `severity`: `alta`, `media` ou `baixa`
- `due_date`: prazo
- `resolved_at`: preenchido quando resolvido

## Usuários e perfis

Tabela: `profiles`

Cada usuário nasce no Supabase Auth e recebe um perfil na tabela `profiles`.

Perfis:

- `admin_sme`: Administrador SME
- `tecnico_gppe`: Técnico GPPE
- `gestor_escolar`: Gestor Escolar
- `conselho_escolar`: Conselho Escolar

## Ordem recomendada para alimentação

1. Conferir e completar unidades escolares
2. Criar usuários e perfis
3. Vincular gestores às unidades
4. Cadastrar conselhos escolares
5. Cadastrar recursos
6. Cadastrar prestações de contas
7. Enviar documentos
8. Criar alertas e acompanhar pendências
