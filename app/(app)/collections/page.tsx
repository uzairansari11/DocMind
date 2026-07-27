'use client';

import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/workspace/section-shell';
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from '@/hooks/use-collections';
import { Plus, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CollectionCreateForm } from '@/components/collections/collection-create-form';
import { CollectionTable } from '@/components/collections/collection-table';
import { DataState } from '@/components/ui/data-state';

export default function CollectionsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const { data: collections = [], isLoading, error } = useCollections();
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
    if (!editTitle.trim() || editTitle.trim() === collections.find((c: any) => c.id === id)?.title) {
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

  const handleDelete = (id: string) => {
    remove(id, { onSuccess: () => toast.success('Collection deleted') });
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
      <CollectionCreateForm 
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        handleCreate={handleCreate}
        isCreatingPending={isCreatingPending}
      />

      <DataState
        isLoading={isLoading}
        isError={!!error}
        error={error as Error}
        isEmpty={collections.length === 0}
        emptyIcon={FolderOpen}
        emptyTitle="No collections yet"
        emptyDescription="Collections help you organize your documents. Create one to get started."
        emptyAction={
          <Button onClick={() => setIsCreating(true)} className="gap-2 shadow-sm rounded-lg mt-4">
            <Plus className="h-4 w-4" />
            Create Collection
          </Button>
        }
      >
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CollectionTable
            collections={collections}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
          />
        </div>
      </DataState>
    </SectionShell>
  );
}
