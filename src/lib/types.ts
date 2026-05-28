export type UserRole = "admin_sme" | "tecnico_gppe" | "gestor_escolar" | "conselho_escolar";

export type Status = "regular" | "atencao" | "pendente" | "vencido";

export type SchoolUnit = {
  id: string;
  name: string;
  inep: string;
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
  createdAt: string;
};

export type ProfileRecord = {
  id: string;
  fullName: string;
  role: UserRole;
  school: string;
  schoolUnitId?: string | null;
  phone: string;
  createdAt: string;
  accessRequestedAt?: string | null;
  accessStatus?: "pendente" | "aprovado" | "bloqueado";
};

export type FndeLink = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
};

export type SupportTicket = {
  id: string;
  school: string;
  title: string;
  description: string;
  priority: "baixa" | "media" | "alta" | "critica";
  status: "aberto" | "em_atendimento" | "respondido" | "resolvido" | "cancelado";
  createdAt: string;
};

export type PddeProgram = {
  id: string;
  groupName: string;
  programName: string;
  sortOrder: number;
};

export type PddeBalance = {
  id?: string;
  schoolUnitId: string;
  programId: string;
  exerciseYear: number;
  saldoAnteriorC: number;
  saldoAnteriorK: number;
  valorCreditadoC: number;
  valorCreditadoK: number;
  rendimentoC: number;
  rendimentoK: number;
  valorGastoC: number;
  valorGastoK: number;
};

export type EducationalResourceStatus = "publico" | "rascunho" | "arquivado";

export type EducationalResource = {
  id: string;
  title: string;
  category: string;
  stage?: string;
  modality?: string;
  type: string;
  description?: string;
  tags: string[];
  filePath?: string;
  externalUrl?: string;
  status: EducationalResourceStatus;
  createdAt: string;
};
