# EDUCONECTA - Gestao Educacional Inteligente

Slogan: **Transformando informacao educacional em gestao inteligente**

Plataforma SaaS em prototipo para organizar informacoes educacionais, com foco em escolas, conselhos, recursos, prazos, documentos, relatorios, analytics, feedback, mural, arquivos e administracao.

## Aviso de independencia

O EduConecta e uma plataforma independente de orgaos publicos. Este prototipo usa dados simulados e nao deve receber dados sensiveis ate validacao tecnica e administrativa.

Nao ha indicacao de fornecedores, comissao, credenciamento, exclusividade, intermediacao de contratacao publica ou favorecimento.

Na area de parceiros, a regra e:

> A presenca da empresa possui finalidade exclusivamente publicitaria e nao representa recomendacao oficial, credenciamento, preferencia ou garantia de contratacao.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth preparado
- Supabase Database/Storage preparados
- Dados mockados em `src/data/educonecta.ts`

## Modulos

- Dashboard
- Escolas
- Conselhos
- Recursos
- Biblioteca SEI
- FNDE/PDDE
- Central de Prazos
- IA Educacional
- Parceiros
- Analytics
- Relatorios
- Mural
- Feedback
- Redes Sociais
- Arquivos
- Administracao

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Variaveis de ambiente

Para login com Supabase em producao:

```bash
NEXT_PUBLIC_GPPE_DATA_MODE=real
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_DB_URL=
NEXT_PUBLIC_APP_URL=https://gestao-gppe.vercel.app
```

Para aplicar migrations e policies automaticamente no Supabase, defina `SUPABASE_DB_URL` com a URL PostgreSQL administrativa do projeto e rode:

```bash
npm run supabase:apply
```

Veja tambem `docs/aplicacao-automatica-supabase.md`.

## Publicacao

O projeto esta preparado para Vercel e pode usar:

- `https://gestao-gppe.vercel.app`
- dominio proprio futuro, como `gppeaguaslindassme.com.br`

Depois de alterar arquivos, suba ao GitHub a pasta preparada:

```text
C:\Users\Admin\Documents\SITE - GPPE\PUBLICAR_GITHUB_GESTAO_GPPE
```
