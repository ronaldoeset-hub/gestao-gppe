"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

type ExportButtonsProps = {
  filename: string;
  rows: Record<string, string | number | undefined>[];
};

export function ExportButtons({ filename, rows }: ExportButtonsProps) {
  async function exportExcel() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0] ?? {});
    const escapeCell = (value: string | number | undefined) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };
    const csv = [
      headers.map(escapeCell).join(";"),
      ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(";"))
    ].join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function exportPdf() {
    if (!rows.length) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Gestao de Recursos e Conselhos - GPPE", 14, 18);
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
        disabled={!rows.length}
        aria-label={`Exportar ${filename} em CSV`}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-sme-navy px-4 text-sm font-semibold text-white transition hover:bg-sme-blue focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
        CSV
      </button>
      <button
        type="button"
        onClick={exportPdf}
        disabled={!rows.length}
        aria-label={`Exportar ${filename} em PDF`}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-sme-line bg-white px-4 text-sm font-semibold text-sme-ink transition hover:bg-sme-surface focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
