# Bloqueios da Auditoria

Data: 2026-05-26

## 1. CRUD completo em todos os módulos

O prompt exige CRUD completo com criar, listar, editar, excluir e confirmação para todos os módulos. O projeto já tem criação/listagem para os módulos centrais, mas padronizar edição/exclusão em todas as entidades exige decisões de produto:

- Quais perfis podem excluir registros financeiros, documentos e prestações já protocoladas?
- Exclusão deve ser física ou apenas cancelamento/inativação com trilha de auditoria?
- Documentos enviados podem ser removidos do Storage ou devem ficar preservados?

Pergunta objetiva: registros administrativos devem ter exclusão real ou status de cancelamento/inativação com histórico?

## 2. Validação com zod

O prompt de auditoria pede validação com `zod`, mas o projeto não tem essa dependência. Para evitar mudança de dependência durante a auditoria sem necessidade absoluta, mantive validações manuais e registrei a pendência.

Pergunta objetiva: posso adicionar `zod` ao `package.json` e migrar os formulários principais para validação schema-based?

## 3. Alertas automáticos

Existem telas, tabelas e campos para alertas. Porém, regras automáticas completas exigem política de negócio:

- Quantos dias antes um conselho entra como "vencendo"?
- Qual prazo define saldo parado?
- Documento vencendo é 15, 30 ou 60 dias antes?

Pergunta objetiva: quais prazos padrão o GPPE deseja usar para alertas automáticos?

## 4. Dados reais de unidades e conselhos

O prompt pede consolidar todas as unidades e conselhos a partir de imports/seeds. A auditoria não encontrou fonte única confiável com schema final validado para substituir dados existentes sem risco.

Pergunta objetiva: qual arquivo oficial deve ser tratado como fonte única de unidades e conselhos?
