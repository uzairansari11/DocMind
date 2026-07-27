import { DataTable } from '@/components/ui/data-table';
// wait we need ColumnDef from @tanstack/react-table
import { FolderOpen, MoreHorizontal, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import Link from 'next/link';

interface CollectionTableProps {
  collections: any[];
  isUpdating: boolean;
  isDeleting: boolean;
  handleUpdate: (e: React.FormEvent, id: string) => void;
  handleDelete: (id: string) => void;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  startEditing: (e: React.MouseEvent, id: string, title: string) => void;
  cancelEditing: (e: React.MouseEvent) => void;
}

export function CollectionTable({
  collections,
  isUpdating,
  isDeleting,
  handleUpdate,
  handleDelete,
  editingId,
  editTitle,
  setEditTitle,
  startEditing,
  cancelEditing,
}: CollectionTableProps) {
  // We need to define columns inside to have access to props
  const columns: any[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (collection: any) => {
        const isEditing = editingId === collection.id;

        if (isEditing) {
          return (
            <form
              onSubmit={(e) => handleUpdate(e, collection.id)}
              className="flex items-center gap-2 max-w-sm pointer-events-auto"
            >
              <Input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 shadow-none"
                disabled={isUpdating}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100/50 shrink-0"
                disabled={isUpdating || !editTitle.trim()}
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                onClick={cancelEditing}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          );
        }

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderOpen className="h-4 w-4" />
            </div>
            <Link
              href={`/collections/${collection.id}`}
              className="font-medium hover:underline decoration-primary/50 underline-offset-4"
            >
              {collection.title}
            </Link>
          </div>
        );
      },
    },
    {
      id: "documents",
      header: "Documents",
      cell: (collection: any) => {
        const count = collection._count?.documents || 0;
        return (
          <div className="text-muted-foreground">
            {count} document{count !== 1 ? 's' : ''}
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: (collection: any) => {
        const [showDeleteAlert, setShowDeleteAlert] = useState(false);

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-8 w-8 p-0 outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={(e) => startEditing(e as any, collection.id, collection.title)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the collection
                    and all associated documents.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(collection.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Delete Collection
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={collections} keyExtractor={(c) => c.id} />;
}
