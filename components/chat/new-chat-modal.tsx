'use client';

import { useState } from 'react';
import { Loader2, Plus, CheckCircle2, Circle, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchAllDocuments } from '@/lib/documents';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type NewChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (title: string, documentIds: string[]) => Promise<void>;
};

export function NewChatModal({ isOpen, onClose, onCreateChat }: NewChatModalProps) {
  const [title, setTitle] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, setIsPending] = useState(false);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchAllDocuments,
    enabled: isOpen, // Only fetch when modal is open
  });

  const filteredDocuments = documents.filter(doc => 
    (doc.title || doc.fileName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await onCreateChat(title.trim() || 'New Chat', selectedDocuments);
      setTitle('');
      setSelectedDocuments([]);
      onClose();
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Select a document or collection to start chatting with.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="chat-title" className="text-sm font-medium text-foreground">
              Chat Title (Optional)
            </label>
            <Input
              id="chat-title"
              placeholder="e.g. Analysis of Q3 Reports"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Target Documents
              </label>
              <button 
                type="button" 
                onClick={() => {
                  if (selectedDocuments.length === documents.length) {
                    setSelectedDocuments([]);
                  } else {
                    setSelectedDocuments(documents.map(d => d.id));
                  }
                }}
                disabled={isPending || documents.length === 0}
                className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
              >
                {selectedDocuments.length === documents.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-lg bg-background"
                disabled={isPending || documents.length === 0}
              />
            </div>

            <div className="max-h-[280px] overflow-y-auto space-y-2 px-1 pb-1">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted/50 p-3 mb-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {searchQuery ? 'No matching documents.' : 'No documents found.'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery ? 'Try a different search term.' : 'Upload documents to get started.'}
                  </p>
                </div>
              ) : (
                filteredDocuments.map((doc) => {
                  const isSelected = selectedDocuments.includes(doc.id);
                  return (
                    <div 
                      key={doc.id}
                      onClick={() => {
                        if (isPending) return;
                        if (isSelected) {
                          setSelectedDocuments(prev => prev.filter(id => id !== doc.id));
                        } else {
                          setSelectedDocuments(prev => [...prev, doc.id]);
                        }
                      }}
                      className={cn(
                        "group flex items-center gap-3.5 rounded-xl p-3.5 transition-all cursor-pointer select-none border",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                          : "border-border/60 bg-card hover:bg-accent/50 hover:border-primary/30 shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "flex shrink-0 items-center justify-center transition-colors",
                        isSelected ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60"
                      )}>
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors",
                        isSelected && "bg-primary/10 text-primary"
                      )}>
                        <FileText className="h-4 w-4" />
                      </div>

                      <span className={cn(
                        "text-sm font-medium truncate flex-1",
                        isSelected ? "text-foreground" : "text-foreground/80"
                      )}>
                        {doc.title || doc.fileName}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-11" disabled={isPending || selectedDocuments.length === 0 || isLoading}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Chat
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
