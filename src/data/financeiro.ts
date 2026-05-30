export type ProgramaCodigo =
  | "pdde_basico_atual"
  | "pdde_basico_velho"
  | "desempenho"
  | "ed_conectada"
  | "cantinho_leitura"
  | "educacao_familia"
  | "escola_comunidade"
  | "tempo_aprender"
  | "mais_alfabetizacao"
  | "emergencial"
  | "estrutura_campo"
  | "sala_recurso"
  | "integral";

export type ProgramaItem = {
  codigo: ProgramaCodigo;
  label: string;
};

export type BlocoPrograma = {
  bloco: string;
  programas: ProgramaItem[];
};

export const catalogoFinanceiro: BlocoPrograma[] = [
  {
    bloco: "PDDE",
    programas: [
      { codigo: "pdde_basico_atual", label: "PDDE Básico (Atual)" },
      { codigo: "pdde_basico_velho", label: "PDDE Básico (Velho)" },
      { codigo: "desempenho",        label: "Desempenho" }
    ]
  },
  {
    bloco: "QUALIDADE",
    programas: [
      { codigo: "ed_conectada",       label: "Educação Conectada" },
      { codigo: "cantinho_leitura",   label: "Cantinho da Leitura" },
      { codigo: "educacao_familia",   label: "Educação e Família" },
      { codigo: "escola_comunidade",  label: "Escola e Comunidade" },
      { codigo: "tempo_aprender",     label: "Tempo de Aprender" },
      { codigo: "mais_alfabetizacao", label: "Mais Alfabetização" },
      { codigo: "emergencial",        label: "Emergencial" }
    ]
  },
  {
    bloco: "PDDE ESTRUTURA",
    programas: [
      { codigo: "estrutura_campo", label: "Campo" },
      { codigo: "sala_recurso",    label: "Sala de Recurso" }
    ]
  },
  {
    bloco: "PDDE INTEGRAL",
    programas: [
      { codigo: "integral", label: "Integral" }
    ]
  }
];

export const BLOCO_COLORS: Record<string, string> = {
  "PDDE":           "bg-blue-700",
  "QUALIDADE":      "bg-emerald-700",
  "PDDE ESTRUTURA": "bg-amber-700",
  "PDDE INTEGRAL":  "bg-purple-700"
};
