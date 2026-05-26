# Design System GPPE/EduConecta

## Principios

- Clareza antes de impacto visual: usuarios administrativos precisam encontrar, conferir e alimentar informacoes com seguranca.
- Visual institucional: sobrio, confiavel e moderno, sem aparencia de painel generico.
- Densidade responsavel: informacao suficiente por tela, mas com respiro e agrupamento consistente.
- Mobile-first: todas as tarefas essenciais devem funcionar em celular.
- Acessibilidade AA como padrao minimo.

## Paleta

Tokens em CSS devem usar HSL para ajuste fino e consistencia com Tailwind.

### Primaria

- `--color-primary-50`: `210 100% 97%`
- `--color-primary-100`: `210 95% 92%`
- `--color-primary-200`: `210 90% 84%`
- `--color-primary-300`: `210 88% 72%`
- `--color-primary-400`: `211 86% 58%`
- `--color-primary-500`: `217 91% 35%`
- `--color-primary-600`: `219 82% 30%`
- `--color-primary-700`: `221 74% 24%`
- `--color-primary-800`: `222 64% 18%`
- `--color-primary-900`: `224 58% 13%`

Uso: botoes principais, navegacao ativa, foco, links e elementos de confianca.

### Secundaria

- `--color-secondary-50`: `173 60% 96%`
- `--color-secondary-100`: `173 58% 88%`
- `--color-secondary-500`: `174 72% 32%`
- `--color-secondary-700`: `176 70% 22%`

Uso: informacao operacional, destaques secundarios e graficos.

### Neutros

- `--color-neutral-50`: `210 40% 98%`
- `--color-neutral-100`: `210 40% 96%`
- `--color-neutral-200`: `214 32% 91%`
- `--color-neutral-300`: `213 27% 84%`
- `--color-neutral-400`: `215 20% 65%`
- `--color-neutral-500`: `215 16% 47%`
- `--color-neutral-600`: `215 19% 35%`
- `--color-neutral-700`: `215 25% 27%`
- `--color-neutral-800`: `217 33% 17%`
- `--color-neutral-900`: `222 47% 11%`

Uso: fundo, bordas, textos, tabelas e superficies.

### Semanticas

- `--color-success`: `153 72% 30%`
- `--color-warning`: `40 96% 48%`
- `--color-danger`: `0 72% 47%`
- `--color-info`: `199 89% 42%`

Uso: status, badges, alertas, validacoes e indicadores.

## Tipografia

- Familia: `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`.
- Escala:
  - 12px: metadados, badges, captions.
  - 14px: texto de tabela, labels, menu.
  - 16px: corpo padrao.
  - 18px: subtitulos e titulos de card.
  - 20px: titulos de secao.
  - 24px: h2 de pagina.
  - 30px: h1 desktop compacto.
  - 36px: metricas principais ou h1 especial.
- Pesos: 400, 500, 600, 700.
- Line-height: 1.5 para corpo; 1.2 para titulos.
- Letter spacing: 0 por padrao; usar uppercase apenas em labels curtos.

## Espacamento

- Base: multiplos de 4px.
- Tela:
  - mobile: `px-4 py-4`;
  - desktop: `px-6 lg:px-8 py-6`.
- Secoes: `space-y-6` ou `gap-6`.
- Cards: `p-5` em mobile, `p-6` em desktop.
- Formularios: `gap-4`, grupos com `space-y-2`.

## Raios

- `--radius-sm`: `6px`
- `--radius-md`: `10px`
- `--radius-lg`: `14px`

Padrao:
- botao: md;
- input: md;
- card: md;
- modal: lg.

## Sombras

- `--shadow-card`: `0 1px 2px hsl(222 47% 11% / 0.06), 0 8px 24px hsl(222 47% 11% / 0.05)`
- `--shadow-card-hover`: `0 2px 4px hsl(222 47% 11% / 0.08), 0 12px 32px hsl(222 47% 11% / 0.08)`
- Evitar sombras dramaticas e fundos decorativos.

## Estados

### Botoes

- Default: contraste alto, altura minima 44px em mobile.
- Hover: leve escurecimento ou fundo neutro.
- Active: translate-y minimo ou sombra menor.
- Focus-visible: outline 2px primary + offset 2px.
- Disabled: opacidade 60%, cursor not-allowed.
- Loading: spinner inline, texto preservado quando possivel.

### Inputs

- Label sempre visivel.
- Borda neutra, fundo branco.
- Focus-visible: outline/ring primary.
- Erro: borda danger e mensagem abaixo com `role="alert"`.
- Helper: texto neutro 12/14px.

### Tabelas

- Desktop: tabela com header neutro e linhas hover sutis.
- Mobile: cards empilhados com pares label/valor.
- Acoes sempre com icone + texto ou aria-label.

## Componentes Base

Criar em `src/components/ui`:

- `Button`: variants `primary`, `secondary`, `outline`, `ghost`, `destructive`; sizes `sm`, `md`, `lg`; loading.
- `Input`: campo padrao com foco acessivel.
- `Label`: associacao `htmlFor`.
- `Select`: visual consistente com input.
- `Textarea`: mensagens e observacoes.
- `Card`: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- `Badge`: status semanticos.
- `Dialog`: acessivel com ESC, overlay e foco.
- `Toast`: mensagens curtas.
- `Tabs`: abas por detalhes de unidade.
- `Table`: responsiva com fallback mobile.
- `EmptyState`: icone/SVG simples, titulo, descricao, CTA.
- `LoadingSpinner`: spinner acessivel.
- `PageHeader`: titulo, subtitulo, breadcrumb e acoes.
- `Breadcrumb`: navegacao contextual.

## Padroes por Tela

- Todas as paginas privadas iniciam com `PageHeader`.
- Dashboard: metricas no topo, pendencias priorizadas, acoes rapidas e graficos simples.
- CRUD: filtros, busca, tabela/lista responsiva, paginacao, acoes por linha.
- Formularios longos: cards por secao e botoes no rodape.
- Detalhes: cabecalho de registro, abas e coluna lateral de metadados.
- Portal publico: hero discreto com busca e grid de recursos educacionais.

## Acessibilidade

- Contraste AA obrigatorio.
- Um `h1` por pagina.
- Icones decorativos com `aria-hidden="true"`.
- Icones interativos com `aria-label`.
- Dialog com foco inicial, ESC e retorno de foco.
- Mensagens de erro com `role="alert"` ou `aria-live`.
- Elementos interativos com area minima de toque de 44x44px no mobile.
