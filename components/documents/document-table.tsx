import { useState } from 'react';
import { FileText, Folder, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useDeleteDocument, useUpdateDocument } from '@/hooks/use-documents';


function DocumentRowActions({ doc }: { doc: any }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(doc.title || doc.fileName);
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();

  const handleUpdate = () => {
    if (!editTitle.trim()) return toast.error('Title is required');
    updateMutation.mutate({ id: doc.id, title: editTitle }, {
      onSuccess: () => setIsEditDialogOpen(false)
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(doc.id);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        } />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              placeholder="Enter new title..."
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
    },
    {
      header: '',
      className: 'w-[50px] text-right',
      cell: (doc) => <DocumentRowActions doc={doc} />
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
