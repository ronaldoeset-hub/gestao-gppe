import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

type DataTableProps<T> = {
  columns: Array<{
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    className?: string;
  }>;
  rows: T[];
  emptyDescription?: string;
  rowClassName?: (row: T, index: number) => string | undefined;
};

export function DataTable<T>({ columns, rows, emptyDescription = "A consulta nao retornou registros para exibicao.", rowClassName }: DataTableProps<T>) {
  if (!rows.length) {
    return <EmptyState description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-sme-line bg-white shadow-soft-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-sme-line">
          <thead className="bg-sme-surface">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-sme-muted",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sme-line bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={cn("transition hover:bg-sme-surface/70", rowClassName?.(row, rowIndex))}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("whitespace-nowrap px-4 py-3 text-sm text-sme-ink", column.className)}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
