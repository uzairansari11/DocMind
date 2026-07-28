'use client';

import { DocumentUploaderModal } from '@/components/documents/document-uploader-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionShell } from '@/components/workspace/section-shell';
import { fetchCollectionById, updateCollectionRequest, deleteCollectionRequest, type Collection } from '@/lib/collections';
import type { DocumentPreview } from '@/lib/documents';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2, ArrowLeft, FolderOpen, Pencil, Trash2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DocumentTable } from '@/components/documents/document-table';
import { DataState } from '@/components/ui/data-state';
import { cn } from '@/lib/utils';
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

export default function CollectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => fetchCollectionById(id as string),
  });

  useEffect(() => {
    if (collection && !isEditing) {
      setEditTitle(collection.title);
    }
  }, [collection, isEditing]);

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (title: string) => updateCollectionRequest({ id, payload: { title } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection updated');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update collection');
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteCollectionRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection deleted');
      router.push('/collections');
    },
    onError: () => {
      toast.error('Failed to delete collection');
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || editTitle.trim() === collection?.title) {
      setIsEditing(false);
      return;
    }
    update(editTitle.trim());
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <FolderOpen className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-lg font-normal text-foreground">Collection not found</p>
        <Link href="/collections">
          <Button variant="outline" className="gap-2 shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <SectionShell
      eyebrow="Collection Details"
      title={
        isEditing ? (
          <form onSubmit={handleUpdate} className="flex items-center gap-2 max-w-sm mt-1">
            <Input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-8 text-base shadow-sm font-normal"
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
              onClick={() => setIsEditing(false)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          collection.title
        )
      }
      action={
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsEditing(true)}
                title="Edit Collection Name"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger 
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "text-red-500/80 hover:text-red-600 hover:bg-red-100/50"
                  )}
                  disabled={isDeleting}
                  title="Delete Collection"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this collection? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => remove()}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Link href="/collections">
            <Button variant="outline" className="gap-2 shadow-sm rounded-lg ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <DocumentUploaderModal defaultCollectionId={id}>
             <Button className="gap-2 shadow-sm rounded-lg">
                <FileText className="h-4 w-4" />
                Add Document
             </Button>
          </DocumentUploaderModal>
        </div>
      }
    >
      <div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-base font-normal tracking-tight text-foreground">Documents</h2>
             <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-normal text-muted-foreground">
               {collection.documents?.length || 0} Files
             </span>
          </div>

          <DataState
            isEmpty={!collection.documents?.length}
            emptyIcon={FileText}
            emptyTitle="No documents"
            emptyDescription="Upload some documents to this collection to start chatting with them."
            emptyAction={
              <DocumentUploaderModal defaultCollectionId={id as string}>
                 <Button className="gap-2 shadow-sm rounded-lg mt-4">
                    <FileText className="h-4 w-4" />
                    Upload Document
                 </Button>
              </DocumentUploaderModal>
            }
          >
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DocumentTable documents={collection.documents || []} hideCollection={true} />
            </div>
          </DataState>
        </div>
      </div>
    </SectionShell>
  );
}
