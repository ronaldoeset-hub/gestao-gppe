"use client";

import { useRouter } from "next/navigation";
import type { SchoolUnit } from "@/lib/types";

const YEARS = [2024, 2025, 2026];

type Props = {
  schools: SchoolUnit[];
  selectedSchoolId?: string;
  year: number;
};

export function SchoolYearSelector({ schools, selectedSchoolId, year }: Props) {
  const router = useRouter();

  function navigate(schoolId: string, y: number) {
    if (schoolId) {
      router.push(`/pdde-controle?escola=${schoolId}&ano=${y}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-48">
        <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Escola</label>
        <select
          value={selectedSchoolId || ""}
          onChange={(e) => navigate(e.target.value, year)}
          className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Selecione uma escola...</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="w-36">
        <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Exercicio</label>
        <select
          value={year}
          onChange={(e) => navigate(selectedSchoolId || "", parseInt(e.target.value))}
          className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
