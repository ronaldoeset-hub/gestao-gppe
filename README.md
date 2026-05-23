# Gestão de Recursos e Conselhos - GPPE

Aplicação web independente para a Secretaria Municipal de Educação de Águas Lindas de Goiás, preparada para futura publicação em domínio próprio, como `gppeaguaslindassme.com`, `recursos.smeaguaslindas.com` ou `smeaguaslindas.com/gestao-recursos`.

## Stack

- Next.js App Router
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Exportação Excel/PDF no navegador

## Módulos criados

- Login com Supabase Auth
- Dashboard geral
- Cadastro das 55 unidades escolares com formulário conectado ao Supabase
- Controle de Conselhos Escolares com formulário conectado ao Supabase
- Controle de Recursos com formulário conectado ao Supabase
- Prestação de Contas com formulário conectado ao Supabase
- Upload de Documentos
- Alertas com formulário conectado ao Supabase
- Exportação Excel/PDF
- Perfis de acesso

## Configuração local

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de variáveis:

```bash
cp .env.example .env.local
```

3. Preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://gppeaguaslindassme.com
```

4. No Supabase SQL Editor, execute:

```text
supabase/schema.sql
supabase/storage.sql
```

Opcionalmente, para criar alguns dados de teste em recursos, conselhos, prestações e alertas, execute:

```text
supabase/seed-sample.sql
```

5. Crie usuários no Supabase Auth. Para definir perfil no cadastro, use metadata:

```json
{
  "full_name": "Nome do usuário",
  "role": "admin_sme"
}
```

Perfis aceitos:

- `admin_sme`
- `tecnico_gppe`
- `gestor_escolar`
- `conselho_escolar`

6. Rode a aplicação:

```bash
npm run dev
```

7. Para desenvolvimento local, acesse:

```text
http://localhost:3000
```

Sem `.env.local`, o app mantém dados locais de demonstração para leitura. Com Supabase configurado, o dashboard e as páginas de unidades, conselhos, recursos, prestações e alertas passam a ler as tabelas reais.

## Fontes dos nomes das unidades

- Escolas municipais: https://smeaguaslindas.com/endescolas/
- Creches municipais: https://smeaguaslindas.com/endecreches/

## Observações de implantação

- A aplicação não integra nem altera o site oficial atual.
- `localhost:3000` é apenas o endereço de teste no computador.
- Para usar `gppeaguaslindassme.com`, é necessário registrar o domínio, contratar/configurar uma hospedagem e apontar o DNS para o deploy.
- Para publicar em subdomínio, configure o domínio `recursos.smeaguaslindas.com` no provedor de hospedagem.
- Para publicar em subcaminho, configure o proxy/rewrite para `smeaguaslindas.com/gestao-recursos`.
- O bucket `documentos-gppe` é privado e exige usuário autenticado.
- As 55 unidades foram semeadas com nomes reais a partir das páginas públicas de escolas e creches da SME. INEPs, gestores e endereços completos devem ser conferidos antes do uso em produção.
- Consulte [docs/dados.md](docs/dados.md) para entender onde alimentar cada tipo de informação.
