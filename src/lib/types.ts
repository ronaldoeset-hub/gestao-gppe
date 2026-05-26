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
  phone: string;
  createdAt: string;
  accessStatus?: "pendente" | "aprovado" | "bloqueado";
};
