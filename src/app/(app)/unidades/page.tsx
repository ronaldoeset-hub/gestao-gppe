import type { Metadata } from "next";
import { Building2, Plus } from "lucide-react";
import { ExportButtons } from "@/components/export-buttons";
import { ModuleHeader } from "@/components/module-header";
import { SchoolUnitForm } from "@/components/school-unit-form";
import { SchoolUnitsTable } from "@/components/school-units-table";
import { getSchoolUnits } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Unidades escolares",
  description: "Cadastro e consulta das unidades escolares acompanhadas pelo GPPE."
};

export default async function SchoolUnitsPage() {
  const schoolUnits = await getSchoolUnits();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Cadastro das 55 unidades escolares"
        description="Base com 55 unidades reais da rede municipal, incluindo escolas, CEMEI e creches municipais."
        icon={Building2}
        action={
          <a href="#nova-unidade" className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white hover:bg-sme-navy">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova unidade
          </a>
        }
      />
      <section id="nova-unidade">
        <SchoolUnitForm />
      </section>
      <ExportButtons
        filename="unidades-escolares-gppe"
        rows={schoolUnits.map((unit) => ({
          Codigo: unit.id,
          Nome: unit.name,
          INEP: unit.inep,
          Tipo: unit.type,
          Bairro: unit.district,
          Gestor: unit.manager,
          Conselho: unit.councilStatus
        }))}
      />
      <SchoolUnitsTable rows={schoolUnits} />
    </div>
  );
}
