# Requisitos do módulo Conselhos Escolares

Base analisada:

- Resolução Nº 005-CME, 10/02/2023, Conselho Escolar
- Modelo de edital de convocação
- Modelo de edital de revogação
- Modelo de requerimento da eleição dos membros
- Modelo de requerimento da revogação do estatuto
- Encaminhamento da quantidade de alunos
- Modelo de ata de eleição e posse
- Modelo de comissão eleitoral
- Modelo de ata de alteração/revogação do estatuto
- Controle de vencimentos dos conselhos/FNDE

## O que serve para o sistema

Os arquivos servem para estruturar o módulo de Conselhos em quatro blocos:

1. Cadastro do mandato do conselho
2. Composição dos membros
3. Controle de documentos obrigatórios
4. Alertas de vencimento e regularidade

## Campos recomendados para Conselho Escolar

Além dos campos já existentes, o sistema deve prever:

- CNPJ da unidade executora
- Código INEP
- Data da assembleia
- Data de início do mandato
- Data de vencimento do mandato
- Situação do conselho: regular, atenção, vencido, pendente
- Quantidade de alunos
- Quantidade de turmas
- Quantidade prevista de membros: 11 ou 13
- Presidente
- Vice-presidente
- Secretários
- Membro nato/gestor
- Comissão de execução financeira
- Conselho fiscal
- Comissão eleitoral
- Data de registro em cartório
- Número do registro em cartório
- Observações técnicas

## Documentos obrigatórios/recomendados

Categorias recomendadas para upload:

- Edital de convocação
- Documento da comissão eleitoral
- Ata de eleição e posse
- Requerimento de registro da eleição
- Encaminhamento da quantidade de alunos
- Estatuto social
- Ata de alteração/revogação do estatuto
- Edital de revogação do estatuto
- Requerimento de revogação do estatuto
- Comprovante/registro em cartório
- Consulta FNDE/PDDE

## Regras práticas extraídas

- O conselho precisa ter controle de mandato com início e vencimento.
- A resolução analisada é a Resolução nº 005-CME, de 10/02/2023, publicada para regulamentar Conselhos Escolares da rede municipal.
- O Conselho Escolar é tratado como órgão colegiado permanente de debate e articulação da comunidade escolar.
- Nas escolas onde ainda não existir Conselho Escolar, deve haver autorização para constituição do conselho.
- O primeiro mandato previsto pela resolução era de 3 anos, com possibilidade de reeleição uma única vez.
- A eleição deve ocorrer por chapa, em assembleia geral, por aclamação ou voto, respeitando os segmentos da comunidade escolar.
- O edital de convocação deve ser publicado com antecedência de 30 dias do fim do mandato vigente.
- A eleição deve ser feita até 30 dias antes do vencimento do mandato em vigor.
- Em chapa única, a eleição pode ocorrer por aclamação, se não houver quórum.
- A quantidade de membros depende da quantidade de alunos matriculados na unidade.
- Unidade com até 600 alunos: 11 membros titulares.
- Unidade com mais de 601 alunos: 13 membros titulares.
- A composição mínima identificada inclui presidente, vice-presidente, secretários, membro nato, membros de comissão financeira, conselho fiscal e comissão de execução financeira.
- O diretor escolar participa como membro nato, mas não pode exercer o cargo de presidente.
- A planilha de controle FNDE informa se o conselho está vigente, vencido ou vence em até 90 dias.
- A quantidade de alunos influencia a quantidade de membros do Conselho Escolar, podendo indicar composição com 11 ou 13 membros.
- O processo eleitoral exige comissão eleitoral local.
- A eleição e posse devem constar em ata própria.
- Edital de convocação deve informar data, horário, local e finalidade da assembleia.
- Registro em cartório é parte do fluxo documental.
- Alteração ou revogação de estatuto exige documentos próprios.
- A prestação de contas deve ser aprovada pelo Conselho Escolar e encaminhada à SME para análise.
- A SME deve analisar documentação e resultado em até 10 dias úteis, remetendo ao CME quando necessário.
- O CME possui competência para recomendar alterações e criação de grupo de fortalecimento/suporte aos conselheiros.

## Composição do Conselho conforme a resolução

Para parametrizar o sistema:

- Até 600 alunos: 11 titulares.
- Mais de 601 alunos: 13 titulares.
- Mandato padrão: 3 anos.
- Reeleição: permitida uma única vez.
- Presidente: eleito entre os conselheiros, mas não pode ser o diretor/membro nato.
- Vice-presidente: substitui o presidente e pode ocupar função na comissão financeira.
- Secretaria do conselho: deve controlar documentação, registros, atas e comunicações.
- Comissão de execução financeira: vinculada ao controle dos recursos financeiros.
- Conselho fiscal: acompanha receitas, despesas e comprovações.

## Funções e controles citados na resolução

O sistema deve permitir registrar ou acompanhar:

- Planejamento e aplicação de recursos federais, estaduais, municipais e próprios.
- Acompanhamento da execução financeira.
- Aprovação de programação anual, relatórios e prestações de contas.
- Pareceres sobre planos, projetos e prioridades pedagógicas.
- Registro de atas, resoluções, correspondências e documentos encaminhados.
- Encaminhamento de irregularidades à SME, TCM, Ministério Público ou Conselho Municipal, quando couber.
- Acompanhamento da aplicação do regimento interno, estatuto e regras de funcionamento.

## Documentos e prazos identificados na resolução

- Edital de convocação da eleição.
- Ata da assembleia/elegição/aclamação.
- Ata de posse.
- Estatuto e regimento interno.
- Documentos de identificação de membros.
- Cartão magnético/identificação bancária quando houver movimentação financeira.
- Cheques nominais ou comprovantes eletrônicos de pagamento.
- Comprovantes de despesas e prestação de contas.
- Relatórios de aplicação de recursos.
- Encaminhamento à SME para análise.
- Encaminhamento ao CME quando houver necessidade de regularização ou deliberação.

## Alertas automáticos recomendados

- Conselho vencido
- Conselho vencendo em até 90 dias
- Conselho sem ata de eleição
- Conselho sem edital de convocação
- Conselho sem requerimento ao cartório
- Conselho sem registro em cartório
- Conselho sem quantidade de alunos informada
- Conselho com quantidade de membros incompatível com quantidade de alunos

## Ajustes recomendados no banco

Criar tabelas futuras:

- `council_members`: membros do conselho
- `council_committees`: comissão eleitoral, comissão financeira e conselho fiscal
- `council_required_documents`: checklist de documentos por conselho

Campos futuros em `school_councils`:

- `cnpj`
- `assembly_date`
- `student_count`
- `class_count`
- `expected_members_count`
- `registry_date`
- `registry_number`

## Ajustes recomendados na interface

No módulo Conselhos:

- Mostrar cards de status: vigente, vencido, vence em até 90 dias
- Criar aba de documentos do conselho
- Criar checklist de regularidade
- Criar formulário de membros
- Criar alerta visual para vencimentos
- Permitir exportar relatório de conselhos vencidos

## Observação sobre a resolução em PDF

O arquivo PDF da resolução foi copiado, mas o texto não foi extraído pelo leitor simples porque parece estar em formato de imagem/digitalização. Para análise jurídica detalhada da resolução, será útil fazer OCR ou enviar uma versão pesquisável do PDF.
