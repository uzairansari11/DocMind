import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface CollectionCreateFormProps {
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  newTitle: string;
  setNewTitle: (value: string) => void;
  handleCreate: (e: React.FormEvent) => void;
  isCreatingPending: boolean;
}

export function CollectionCreateForm({
  isCreating,
  setIsCreating,
  newTitle,
  setNewTitle,
  handleCreate,
  isCreatingPending
}: CollectionCreateFormProps) {
  if (!isCreating) return null;

  return (
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
  );
}
