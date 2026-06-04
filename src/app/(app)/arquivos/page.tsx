import type { Metadata } from "next";
import { FileArchive, FileCheck, FileText, FolderOpen, Upload } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

export const metadata: Metadata = {
  title: "Arquivos",
  description: "Organização e consulta de arquivos administrativos do GPPE por unidade e categoria."
};

export const revalidate = 60;

type CategoriaArquivo = {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ElementType;
  cor: string;
  arquivos: Array<{ nome: string; tipo: string; data: string; tamanho: string }>;
};

const CATEGORIAS: CategoriaArquivo[] = [
  {
    id: "prestacao",
    nome: "Prestação de Contas",
    descricao: "Relatórios, extratos, notas fiscais e comprovantes de despesas",
    icone: FileCheck,
    cor: "bg-sme-blue-soft border-sme-blue/20 text-sme-blue",
    arquivos: [
      { nome: "Prestacao_PDDE_2025_EM-01.pdf", tipo: "PDF", data: "2026-01-10", tamanho: "2.4 MB" },
      { nome: "Extrato_Bancario_DEZ2025.pdf", tipo: "PDF", data: "2026-01-05", tamanho: "0.8 MB" },
      { nome: "Planilha_Execucao_2025.xlsx", tipo: "Excel", data: "2025-12-20", tamanho: "1.2 MB" }
    ]
  },
  {
    id: "conselhos",
    nome: "Documentos do Conselho",
    descricao: "Atas, editais de eleição, listas de membros e registros",
    icone: FileText,
    cor: "bg-emerald-50 border-sme-green/20 text-sme-green",
    arquivos: [
      { nome: "Ata_Posse_Conselho_2025.pdf", tipo: "PDF", data: "2025-03-15", tamanho: "0.5 MB" },
      { nome: "Ata_Reuniao_NOV2025.pdf", tipo: "PDF", data: "2025-11-20", tamanho: "0.3 MB" },
      { nome: "Lista_Membros_Conselho_2025.pdf", tipo: "PDF", data: "2025-03-15", tamanho: "0.2 MB" }
    ]
  },
  {
    id: "financeiro",
    nome: "Documentos Financeiros",
    descricao: "Planos de aplicação, notas fiscais e comprovantes bancários",
    icone: FileArchive,
    cor: "bg-amber-50 border-sme-gold/20 text-sme-gold",
    arquivos: [
      { nome: "Plano_Aplicacao_PDDE_2026.pdf", tipo: "PDF", data: "2026-01-20", tamanho: "0.6 MB" },
      { nome: "NF_Reforma_Banheiro_001.pdf", tipo: "PDF", data: "2025-10-05", tamanho: "1.1 MB" },
      { nome: "Cotacao_Precos_Material.pdf", tipo: "PDF", data: "2025-09-15", tamanho: "0.4 MB" }
    ]
  }
];

function ArquivoItem({ arquivo }: { arquivo: CategoriaArquivo["arquivos"][0] }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sme-line bg-sme-surface px-4 py-3">
      <FileText className="h-5 w-5 shrink-0 text-sme-blue" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-sme-ink">{arquivo.nome}</p>
        <p className="text-xs text-sme-muted">{arquivo.tipo} · {arquivo.tamanho} · {new Intl.DateTimeFormat("pt-BR").format(new Date(arquivo.data + "T12:00:00"))}</p>
      </div>
      <span className="rounded-lg bg-sme-navy px-2 py-1 text-xs font-semibold text-white">{arquivo.tipo}</span>
    </div>
  );
}

export default function ArquivosPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Gestão de Arquivos"
        description="Organização e consulta de arquivos administrativos por categoria. Em breve: upload direto pelo portal."
        icon={FolderOpen}
      />

      <div className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sme-blue-soft text-sme-blue">
            <Upload className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display font-bold text-sme-navy">Envio de arquivos</p>
            <p className="text-sm text-sme-muted">Para enviar documentos, utilize o módulo <strong>Documentos</strong> no menu lateral. O upload direto nesta página estará disponível em breve.</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {CATEGORIAS.map((cat) => {
          const Ic = cat.icone;
          return (
            <section key={cat.id} className="rounded-2xl border border-sme-line bg-white p-5 shadow-soft-sm">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cat.cor}`}>
                  <Ic className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display font-bold text-sme-navy">{cat.nome}</h2>
                  <p className="mt-0.5 text-sm text-sme-muted">{cat.descricao}</p>
                </div>
                <span className="rounded-full bg-sme-surface px-2 py-1 text-xs font-semibold text-sme-muted">
                  {cat.arquivos.length} arquivo{cat.arquivos.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {cat.arquivos.map((a) => <ArquivoItem key={a.nome} arquivo={a} />)}
              </div>
            </section>
          );
        })}
      </div>

      <div className="rounded-2xl border border-sme-line bg-sme-surface p-5">
        <p className="text-sm font-semibold text-sme-muted">
          <strong className="text-sme-navy">Importante:</strong> Mantenha todos os documentos físicos organizados por ano e categoria. O sistema digital não substitui a guarda física obrigatória por no mínimo 5 anos.
        </p>
      </div>
    </div>
  );
}
