import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No results.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-normal border-b border-border/40">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={cn("px-6 py-4", col.className)}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-muted/20 transition-colors group">
                  {columns.map((col, i) => (
                    <td key={i} className={cn("px-6 py-4", col.className)}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
