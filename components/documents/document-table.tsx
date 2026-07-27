import { FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, ColumnDef } from '@/components/ui/data-table';


export function DocumentTable({ documents, hideCollection }: { documents: any[], hideCollection?: boolean }) {
  const columns: ColumnDef<any>[] = [
    {
      header: 'Document',
      cell: (doc) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-[300px]">
            {doc.title || doc.fileName}
          </span>
        </div>
      )
    },
    ...(hideCollection ? [] : [{
      header: 'Collection',
      cell: (doc: any) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Folder className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[150px]">{doc.collection?.title || 'Unknown'}</span>
        </div>
      )
    }]),
    {
      header: 'Status',
      cell: (doc) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
          doc.status === 'COMPLETED' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          doc.status === 'FAILED' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        )}>
          {doc.status}
        </span>
      )
    },
    {
      header: 'Added',
      className: 'text-muted-foreground',
      cell: (doc) => doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'
    }
  ];

  return (
    <DataTable 
      data={documents}
      columns={columns}
      keyExtractor={(doc) => doc.id}
    />
  );
}
