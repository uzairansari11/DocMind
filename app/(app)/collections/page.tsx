'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionShell } from '@/components/workspace/section-shell';
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from '@/hooks/use-collections';
import { cn } from '@/lib/utils';
import {
  Loader2,
  Plus,
  FolderOpen,
  FileText,
  ChevronRight,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CollectionsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const { data: collections = [], isLoading } = useCollections();
  const { mutate: create, isPending: isCreatingPending } = useCreateCollection();
  const { mutate: update, isPending: isUpdating } = useUpdateCollection();
  const { mutate: remove, isPending: isDeleting } = useDeleteCollection();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    create({ title: newTitle.trim(), description: '' }, {
      onSuccess: () => {
        toast.success('Collection created');
        setIsCreating(false);
        setNewTitle('');
      }
    });
  };

  const handleUpdate = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim() || editTitle.trim() === collections.find(c => c.id === id)?.title) {
      setEditingId(null);
      return;
    }
    update({ id, payload: { title: editTitle.trim() } }, {
      onSuccess: () => {
        toast.success('Collection updated');
        setEditingId(null);
      }
    });
  };

  const startEditing = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <SectionShell
      eyebrow="Organization"
      title="Collections"
      action={
        <Button onClick={() => setIsCreating(true)} className="gap-2 shadow-sm rounded-lg" disabled={isCreating}>
          <Plus className="h-4 w-4" />
          New Collection
        </Button>
      }
    >
      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
          <Input
            autoFocus
            placeholder="Collection title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="max-w-sm shadow-sm rounded-lg border-border/40"
            disabled={isCreatingPending}
          />
          <Button type="submit" disabled={!newTitle.trim() || isCreatingPending} className="shadow-sm rounded-lg">
            {isCreatingPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsCreating(false)}
            disabled={isCreatingPending}
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : collections.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center animate-in fade-in duration-500">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted shadow-sm">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-normal tracking-tight text-foreground">No collections yet</h3>
          <p className="mb-8 max-w-sm text-sm text-muted-foreground">
            Collections help you organize your documents. Create one to get started.
          </p>
          <Button onClick={() => setIsCreating(true)} className="gap-2 shadow-sm rounded-lg">
            <Plus className="h-4 w-4" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={cn(
                "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30",
                index !== collections.length - 1 && "border-b border-border/40"
              )}
            >
              <Link href={`/collections/${collection.id}`} className="absolute inset-0 z-0" aria-label={`View collection ${collection.title}`} />
              
              <div className="relative z-10 flex items-center gap-4 flex-1 pointer-events-none">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <FolderOpen className="h-6 w-6" />
                </div>
                
                {editingId === collection.id ? (
                  <form 
                    onSubmit={(e) => handleUpdate(e, collection.id)} 
                    className="flex items-center gap-2 flex-1 max-w-sm pointer-events-auto"
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
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100/50"
                      disabled={isUpdating || !editTitle.trim()}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={cancelEditing}
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <div>
                    <h3 className="text-base font-normal tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {collection._count?.documents || 0} document{(collection._count?.documents || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              <div className="relative z-10 flex items-center justify-between sm:justify-end gap-4 sm:w-1/2 lg:w-2/3 pointer-events-none">
                {/* Document count horizontally */}
                <div className="hidden sm:flex flex-wrap items-center gap-2 flex-1 justify-end mr-4">
                  {collection._count && collection._count.documents > 0 ? (
                    <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors group-hover:bg-background/80 group-hover:shadow-sm">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">{collection._count.documents} Document{collection._count.documents !== 1 && 's'}</span>
                    </div>
                  ) : (
                    <span className="text-sm italic text-muted-foreground/60">Empty</span>
                  )}
                </div>

                {/* Actions that appear on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 backdrop-blur-sm p-1 rounded-lg pointer-events-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={(e) => startEditing(e, collection.id, collection.title)}
                    disabled={isDeleting || editingId === collection.id}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger 
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }), 
                        "h-8 w-8 text-red-500/80 hover:text-red-600 hover:bg-red-100/50"
                      )}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isDeleting || editingId === collection.id}
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      <span className="sr-only">Delete</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this collection? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={(e) => { e.stopPropagation(); remove(collection.id, { onSuccess: () => toast.success('Collection deleted') }); }}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all group-hover:bg-background group-hover:text-foreground group-hover:shadow-sm pointer-events-none">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
