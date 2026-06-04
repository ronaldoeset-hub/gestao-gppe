export type UserRole = "admin_sme" | "tecnico_gppe" | "gestor_escolar" | "conselho_escolar" | "funcionario_escola";

export type Status = "regular" | "atencao" | "pendente" | "vencido";

export type SchoolUnit = {
  id: string;
  name: string;
  inep: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  zip_code?: string;
  type: "Escola" | "Creche" | "CEMEI" | "Conveniada";
  district: string;
  manager: string;
  councilStatus: Status;
};

export type Council = {
  id: string;
  school: string;
  president: string;
  vicePresident?: string;
  mandateStart?: string;
  mandateEnd: string;
  members: number;
  expectedMembers?: number;
  studentCount?: number;
  electionDate?: string;
  possessionDate?: string;
  registryDate?: string;
  status: Status;
};

export type ResourceTransfer = {
  id: string;
  program: string;
  school: string;
  amount: number;
  releasedAt: string;
  balance: number;
  status: Status;
  category?: "Custeio" | "Capital" | "Outros";
};

export type Accountability = {
  id: string;
  school: string;
  reference: string;
  dueDate: string;
  submittedAt?: string;
  status: Status;
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: "alta" | "media" | "baixa";
  dueDate: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  category: string;
  school: string;
  storagePath: string;
  downloadUrl?: string;
  createdAt: string;
};

export type ProfileRecord = {
  id: string;
  fullName: string;
  role: UserRole;
  school: string;
  schoolUnitId?: string;
  phone: string;
  createdAt: string;
  accessStatus?: "pendente" | "aprovado" | "bloqueado";
};

export type FinancialAllocation = {
  id: string;
  school: string;
  program: string;
  period: string;
  resourceType: "Custeio" | "Capital" | "Outros";
  plannedAmount: number;
  receivedAmount: number;
  releasedAt?: string;
  currentBalance: number;
  status: Status | "encerrado";
  notes?: string;
};

export type FinancialPlanItem = {
  id: string;
  school: string;
  program: string;
  itemName: string;
  category?: string;
  quantity: number;
  unitLabel?: string;
  unitPrice: number;
  plannedTotal: number;
  priority?: string;
  status: "planejado" | "aprovado" | "comprado" | "cancelado";
  observation?: string;
};

export type FinancialMovement = {
  id: string;
  school: string;
  program: string;
  supplier?: string;
  type: "compra" | "pagamento" | "devolucao" | "ajuste" | "cancelamento";
  documentNumber?: string;
  issuedAt?: string;
  paidAt?: string;
  amount: number;
  paymentMethod?: string;
  status: string;
  description?: string;
};

export type FinancialDocument = {
  id: string;
  school: string;
  title: string;
  category: string;
  documentNumber?: string;
  storagePath?: string;
  documentDate?: string;
  competence?: string;
};

export type FinancialAccountabilityReport = {
  id: string;
  school: string;
  program: string;
  reference: string;
  dueDate: string;
  submittedAt?: string;
  status: "pendente" | "em_analise" | "aprovado" | "reprovado" | "vencido";
  plannedAmount: number;
  executedAmount: number;
  balance: number;
};

export type FinancialAlert = {
  id: string;
  school: string;
  title: string;
  description: string;
  severity: Alert["severity"];
  dueDate?: string;
  status: string;
};

export type FinancialControl = {
  allocations: FinancialAllocation[];
  planItems: FinancialPlanItem[];
  movements: FinancialMovement[];
  documents: FinancialDocument[];
  reports: FinancialAccountabilityReport[];
  alerts: FinancialAlert[];
};
