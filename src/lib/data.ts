import type { Accountability, Alert, Council, FinancialControl, ResourceTransfer, SchoolUnit, UserRole } from "@/lib/types";

export const roleLabels: Record<UserRole, string> = {
  admin_sme: "Administrador SME",
  tecnico_gppe: "Técnico GPPE",
  gestor_escolar: "Gestor Escolar",
  conselho_escolar: "Conselho Escolar",
  funcionario_escola: "Funcionário Escolar"
};

export const rolePermissions = [
  {
    role: "Administrador SME",
    permissions: ["Gerenciar usuários", "Configurar sistema", "Acessar todos os módulos", "Exportar relatórios"]
  },
  {
    role: "Técnico GPPE",
    permissions: ["Validar prestações", "Cadastrar recursos", "Acompanhar conselhos", "Emitir alertas"]
  },
  {
    role: "Gestor Escolar",
    permissions: ["Atualizar dados da unidade", "Enviar documentos", "Acompanhar recursos da escola"]
  },
  {
    role: "Funcionário Escolar",
    permissions: ["Alimentar dados da própria unidade", "Enviar documentos", "Consultar prazos e comunicados"]
  },
  {
    role: "Conselho Escolar",
    permissions: ["Consultar repasses", "Anexar atas", "Acompanhar pendências do conselho"]
  }
];

const schoolUnitSeed: Array<Pick<SchoolUnit, "name" | "type" | "district">> = [
  { name: "Escola M. Acelina Alves de Araújo", type: "Escola", district: "Camping Clube" },
  { name: "Escola M. Ana Lúcia Oliveira da Silva", type: "Escola", district: "Jardim América II" },
  { name: "Escola M. Antônio Cícero Araújo da Costa", type: "Escola", district: "Mansões Odisséia" },
  { name: "Escola Municipal Antônio de Jesus Leite", type: "Escola", district: "Jardim Querência" },
  { name: "Escola Municipal Antônio Luiz Gonzaga", type: "Escola", district: "Parque da Barragem Setor 11" },
  { name: "Escola Municipal Camargo II", type: "Escola", district: "Zona Rural" },
  { name: "Escola Municipal Darci Ribeiro", type: "Escola", district: "Parque da Barragem Setor 08" },
  { name: "Escola M. Domingos Simão de Oliveira", type: "Escola", district: "Jardim América IV" },
  { name: "Escola Municipal Edinaldo Pereira", type: "Escola", district: "Mansões Coimbra" },
  { name: "Escola M. Ednalda Guedes de Souza", type: "Escola", district: "Parque Águas Bonitas I" },
  { name: "Escola M. Ednalva Valdevino dos Santos", type: "Escola", district: "Jardim Santa Lúcia" },
  { name: "Escola M. Emília Ferreira de Souza", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal Erotides Dias da Costa", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Fernando Cunha Junior", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Francisca Ferreira da Silva", type: "Escola", district: "Jardim Barragem V" },
  { name: "Escola M. Geracina Pereira da Silva", type: "Escola", district: "Parque da Barragem Setor 02" },
  { name: "Escola M. Inácio Carneiro da Costa", type: "Escola", district: "Jardim Barragem II" },
  { name: "Escola Municipal Jardim das Oliveiras", type: "Escola", district: "Jardim das Oliveiras" },
  { name: "Escola M. João Elízio Lima Pessoa", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. José A. de Araújo - Zé Chevrolet", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal José Vitorino de Souza", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal Juliana Eloy da Silva", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal Luiza Tereza", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal Maria de Fátima Alves", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Maria do Livramento Felipe", type: "Escola", district: "Quinta das Angélicas" },
  { name: "Escola Municipal Maria José Costa Lima", type: "Escola", district: "Recreio Águas Lindas III" },
  { name: "Escola M. Maria Machado de Matos", type: "Escola", district: "Jardim Guaíra" },
  { name: "Escola Municipal Maristela Regina Neris", type: "Escola", district: "Jardim Pérola I" },
  { name: "Escola M. Joaquim Pedro Gomes da Cruz", type: "Escola", district: "Mansões Village" },
  { name: "Escola Municipal MEG-LUZ", type: "Escola", district: "Parque da Barragem Setor 03" },
  { name: "Escola Municipal Mestre Zezito", type: "Escola", district: "Águas Bonitas I" },
  { name: "Escola Municipal Milena Barbosa Gama", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Nilzon Periquito de Lima", type: "Escola", district: "Mansões Olinda" },
  { name: "Escola M. Orlando Soares de Sousa", type: "Escola", district: "Camping Clube" },
  { name: "Escola M. P. Edileuza de A. Cavalcante", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Profª. Erika Flávia Vieira de Souza", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal Roberto Alves da Silva", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal Rui Barbosa", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola Municipal São Bartolomeu", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Senador Emival Ramos Caiado", type: "Escola", district: "Águas Lindas de Goiás" },
  { name: "Escola M. Vereador Érico Souza Ferreira", type: "Escola", district: "Jardim Brasília" },
  { name: "Escola M. Vicente de Paula Lisboa", type: "Escola", district: "Jardim Águas Lindas II" },
  { name: "Escola Municipal Zélia Correa Cotrim", type: "Escola", district: "Recreio da Barragem" },
  { name: "CEMEI - Centro Municipal de Educação Inclusiva", type: "CEMEI", district: "Jardim Brasília" },
  { name: "Creche M. Dona Mª Pires Perillo", type: "Creche", district: "Parque da Barragem Setor 08" },
  { name: "Creche M. Indiara Carneiro Machado Lisboa", type: "Creche", district: "Jardim Santa Lúcia" },
  { name: "Creche Municipal Prof. Fátima Enes Muniz", type: "Creche", district: "Jardim América II" },
  { name: "Creche M. Jardim Brasília II", type: "Creche", district: "Jardim Brasília II" },
  { name: "Creche Municipal Profª. Vilma Maria da Costa Araújo", type: "Creche", district: "Jardim Guaíra I" },
  { name: "Creche Municipal Eliene Martins Braga", type: "Creche", district: "Residencial Jardim Paraíso" },
  { name: "Creche Municipal Prof. Ivaldo Rodrigues Lima", type: "Creche", district: "Jardim Pérola I" },
  { name: "Creche M. José Rodrigues Bezerra", type: "Creche", district: "Jardim Barragem VI" },
  { name: "Creche M. Mundo Encantado", type: "Creche", district: "Jardim Brasília" },
  { name: "Creche Municipal Prof. Luiz Antônio Gonçalves de Oliveira", type: "Creche", district: "Parque Águas Bonitas I" },
  { name: "Creche M. Pr. Geraldo Evaristo dos Santos", type: "Creche", district: "Mansões Pôr do Sol" }
];

export const schoolUnits: SchoolUnit[] = schoolUnitSeed.map((unit, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: `UE-${number}`,
    name: unit.name,
    inep: `52${String(100000 + index)}`,
    type: unit.type,
    district: unit.district,
    manager: `Gestor(a) da Unidade ${number}`,
    councilStatus: index % 8 === 0 ? "pendente" : index % 6 === 0 ? "atencao" : "regular"
  };
});

export const councils: Council[] = schoolUnits.slice(0, 8).map((school, index) => ({
  id: `CE-${String(index + 1).padStart(3, "0")}`,
  school: school.name,
  president: `Presidente ${index + 1}`,
  vicePresident: `Vice-presidente ${index + 1}`,
  mandateStart: `202${index % 2 === 0 ? "3" : "4"}-${String((index % 9) + 3).padStart(2, "0")}-15`,
  mandateEnd: `202${index % 2 === 0 ? "6" : "7"}-${String((index % 9) + 3).padStart(2, "0")}-15`,
  members: index % 3 === 0 ? 9 : index % 2 === 0 ? 11 : 13,
  expectedMembers: index % 2 === 0 ? 11 : 13,
  studentCount: index % 2 === 0 ? 480 + index * 8 : 650 + index * 12,
  electionDate: `202${index % 2 === 0 ? "3" : "4"}-${String((index % 9) + 2).padStart(2, "0")}-20`,
  possessionDate: `202${index % 2 === 0 ? "3" : "4"}-${String((index % 9) + 3).padStart(2, "0")}-15`,
  registryDate: index % 3 === 0 ? undefined : `202${index % 2 === 0 ? "3" : "4"}-${String((index % 9) + 4).padStart(2, "0")}-10`,
  status: index % 4 === 0 ? "atencao" : "regular"
}));

export const resources: ResourceTransfer[] = [
  {
    id: "REC-001",
    program: "PDDE Básico",
    school: "Escola M. Acelina Alves de Araújo",
    amount: 42850,
    releasedAt: "2026-02-12",
    balance: 12840,
    status: "regular",
    category: "Custeio"
  },
  {
    id: "REC-002",
    program: "Educação Conectada",
    school: "Creche Municipal Eliene Martins Braga",
    amount: 18900,
    releasedAt: "2026-03-20",
    balance: 18900,
    status: "pendente",
    category: "Capital"
  },
  {
    id: "REC-003",
    program: "Manutenção Escolar",
    school: "Escola Municipal Erotides Dias da Costa",
    amount: 61200,
    releasedAt: "2026-01-30",
    balance: 8920,
    status: "atencao",
    category: "Custeio"
  },
  {
    id: "REC-004",
    program: "Planejamento Jardim das Oliveiras",
    school: "Escola Municipal Jardim das Oliveiras",
    amount: 2049,
    releasedAt: "2026-05-23",
    balance: 2049,
    status: "regular",
    category: "Custeio"
  },
  {
    id: "REC-005",
    program: "Planejamento Jardim das Oliveiras",
    school: "Escola Municipal Jardim das Oliveiras",
    amount: 19902,
    releasedAt: "2026-05-23",
    balance: 19902,
    status: "regular",
    category: "Capital"
  }
];

export const accountabilities: Accountability[] = [
  {
    id: "PC-2026-001",
    school: "Escola M. Acelina Alves de Araújo",
    reference: "1º quadrimestre de 2026",
    dueDate: "2026-05-30",
    submittedAt: "2026-05-16",
    status: "regular"
  },
  {
    id: "PC-2026-002",
    school: "Creche Municipal Eliene Martins Braga",
    reference: "1º quadrimestre de 2026",
    dueDate: "2026-05-30",
    status: "pendente"
  },
  {
    id: "PC-2026-003",
    school: "Escola Municipal Erotides Dias da Costa",
    reference: "Saldo reprogramado 2025",
    dueDate: "2026-05-24",
    status: "atencao"
  }
];

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    title: "Prestação próxima do prazo",
    description: "12 unidades possuem prestação de contas com vencimento nos próximos 10 dias.",
    severity: "alta",
    dueDate: "2026-05-30"
  },
  {
    id: "ALT-002",
    title: "Mandatos de conselho a renovar",
    description: "5 conselhos escolares encerram mandato neste semestre.",
    severity: "media",
    dueDate: "2026-06-15"
  },
  {
    id: "ALT-003",
    title: "Documentos aguardando validação",
    description: "18 anexos enviados por gestores aguardam análise técnica do GPPE.",
    severity: "baixa",
    dueDate: "2026-05-27"
  }
];

export const financialControlMock: FinancialControl = {
  allocations: [
    {
      id: "ALOC-2026-001",
      school: "Escola Municipal Jardim das Oliveiras",
      program: "PDDE Basico",
      period: "Exercicio 2026",
      resourceType: "Custeio",
      plannedAmount: 2049,
      receivedAmount: 2049,
      releasedAt: "2026-05-23",
      currentBalance: 857,
      status: "atencao",
      notes: "Baseada na planilha de controle de recursos da unidade."
    },
    {
      id: "ALOC-2026-002",
      school: "Escola Municipal Jardim das Oliveiras",
      program: "PDDE Basico",
      period: "Exercicio 2026",
      resourceType: "Capital",
      plannedAmount: 19902,
      receivedAmount: 19902,
      releasedAt: "2026-05-23",
      currentBalance: 12900,
      status: "regular",
      notes: "Itens de capital aguardando documentos comprobatorios."
    }
  ],
  planItems: [
    {
      id: "ITEM-001",
      school: "Escola Municipal Jardim das Oliveiras",
      program: "PDDE Basico",
      itemName: "Material de expediente",
      category: "Custeio",
      quantity: 1,
      unitLabel: "lote",
      unitPrice: 1200,
      plannedTotal: 1200,
      priority: "Alta",
      status: "aprovado",
      observation: "Item importado do modelo de alimentacao."
    },
    {
      id: "ITEM-002",
      school: "Escola Municipal Jardim das Oliveiras",
      program: "PDDE Basico",
      itemName: "Computadores administrativos",
      category: "Capital",
      quantity: 3,
      unitLabel: "un",
      unitPrice: 4300,
      plannedTotal: 12900,
      priority: "Media",
      status: "planejado",
      observation: "Compra depende de cotacao e aprovacao."
    }
  ],
  movements: [
    {
      id: "MOV-001",
      school: "Escola Municipal Jardim das Oliveiras",
      program: "PDDE Basico",
      supplier: "Fornecedor Demonstrativo",
      type: "pagamento",
      documentNumber: "NF-2026-001",
      issuedAt: "2026-05-24",
      paidAt: "2026-05-27",
      amount: 1192,
      paymentMethod: "Transferencia",
      status: "pago",
      description: "Compra parcial de material de expediente."
    }
  ],
  documents: [
    {
      id: "DOC-FIN-001",
      school: "Escola Municipal Jardim das Oliveiras",
      title: "Nota fiscal material de expediente",
      category: "Nota fiscal",
      documentNumber: "NF-2026-001",
      storagePath: "jardim-oliveiras/nota-fiscal-material.pdf",
      documentDate: "2026-05-24",
      competence: "2026-05"
    }
  ],
  reports: [
    {
      id: "PC-FIN-001",
      school: "Escola Municipal Jardim das Oliveiras",
      program: "PDDE Basico",
      reference: "Exercicio 2026",
      dueDate: "2026-12-31",
      status: "pendente",
      plannedAmount: 21951,
      executedAmount: 1192,
      balance: 20759
    }
  ],
  alerts: [
    {
      id: "ALT-FIN-001",
      school: "Escola Municipal Jardim das Oliveiras",
      title: "Documento comprobatorio pendente",
      description: "Itens de capital planejados ainda nao possuem cotacao ou documento vinculado.",
      severity: "media",
      dueDate: "2026-06-30",
      status: "aberto"
    }
  ]
};
