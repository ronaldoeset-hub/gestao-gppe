"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

type ExportButtonsProps = {
  filename: string;
  rows: Record<string, string | number | undefined>[];
};

export function ExportButtons({ filename, rows }: ExportButtonsProps) {
  async function exportExcel() {
    const XLSX = await import("xlsx");
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Relatório");
    XLSX.writeFile(book, `${filename}.xlsx`);
  }

  async function exportPdf() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Gestão de Recursos e Conselhos - GPPE", 14, 18);
    doc.setFontSize(10);
    rows.slice(0, 32).forEach((row, index) => {
      doc.text(Object.values(row).join(" | "), 14, 30 + index * 7);
    });
    doc.save(`${filename}.pdf`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={exportExcel}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-sme-blue px-3 text-sm font-semibold text-white transition hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
      >
        <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
        Excel
      </button>
      <button
        type="button"
        onClick={exportPdf}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-sme-ink transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
      >
        <FileText className="h-4 w-4" aria-hidden="true" />
        PDF
      </button>
      <span className="sr-only">
        <Download className="h-4 w-4" aria-hidden="true" />
      </span>
    </div>
  );
}
