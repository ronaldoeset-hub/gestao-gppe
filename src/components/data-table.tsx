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
};

export function DataTable<T>({ columns, rows, emptyDescription = "A consulta nao retornou registros para exibicao." }: DataTableProps<T>) {
  if (!rows.length) {
    return <EmptyState description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn("whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className={cn("whitespace-nowrap px-4 py-3 text-sm text-slate-700", column.className)}>
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
