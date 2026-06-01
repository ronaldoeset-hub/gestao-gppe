# Checklist de validacao RLS e perfis

Use este roteiro com usuarios reais criados no Supabase Auth. O objetivo e confirmar o contrato entre UI, policies e dados reais antes de uso oficial.

## Perfis minimos

- admin_sme: ve administracao, perfis, todas as unidades e aprova/bloqueia usuarios.
- tecnico_gppe: ve acompanhamento geral, unidades, conselhos, documentos, recursos e prestacoes vinculadas ao trabalho da GPPE.
- gestor_escolar: ve e altera apenas dados da propria unidade quando a policy permitir.
- conselho_escolar: ve conselhos, documentos e pendencias da unidade vinculada.
- funcionario_escola: ve apenas areas operacionais permitidas para a unidade vinculada.

## Fluxos para validar

- Login aprovado, pendente e bloqueado.
- Criacao de unidade por usuario autorizado.
- Criacao de conselho, recurso, prestacao e alerta.
- Upload de documento no bucket `documentos-gppe`.
- Bloqueio de usuario e tentativa de novo acesso.
- Exportacao CSV/PDF sem dados de unidades indevidas.

## Evidencias esperadas

- Nenhum perfil acessa dados de outra unidade fora das policies.
- Inserts e updates negados pela RLS aparecem como erro amigavel no formulario.
- Rotas protegidas redirecionam para login quando nao ha sessao.
- Storage respeita usuario autenticado e vinculo de unidade.
