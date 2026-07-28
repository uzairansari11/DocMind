'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Layers, BookOpen, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomModal } from '@/components/ui/custom-modal';
import { useCollections } from '@/hooks/use-collections';
import { useDocuments } from '@/hooks/use-documents';
import { api } from '@/lib/api';

interface FlashcardSetupModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function FlashcardSetupModal({ isOpen, setIsOpen }: FlashcardSetupModalProps) {
  const router = useRouter();
  const { data: collections } = useCollections();
  const { data: documents } = useDocuments();
  
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<'idle' | 'generating'>('idle');

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedDocs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedDocs(newSet);
  };

  const handleGenerate = async () => {
    if (selectedDocs.size === 0) return;
    
    setStatus('generating');
    
    try {
      // Get the first selected doc for now
      const docId = Array.from(selectedDocs)[0];
      const res = await api.post(`/documents/${docId}/flashcards`, { topic });
      
      if (res.data?.success) {
        setStatus('idle');
        setIsOpen(false);
        router.push(`/flashcards?deck=${docId}`);
      } else {
        setStatus('idle');
        console.error('Failed to generate flashcards');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setStatus('idle');
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={setIsOpen}
      title="Create Flashcards"
      description="Select source documents and optionally provide a topic to generate an interactive flashcard deck."
      icon={Layers}
      footer={
        <Button 
          className="w-full py-6 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
          onClick={handleGenerate}
          disabled={status === 'generating' || (selectedDocs.size === 0 && !topic)}
        >
          {status === 'generating' ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
          ) : (
            <><Layers className="mr-2 h-5 w-5" /> Generate Deck</>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold tracking-tight">1. What's the focus? (Optional)</label>
          <Textarea 
            placeholder="E.g., Focus on dates and key terms from these documents..."
            className="resize-none h-24 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold tracking-tight">2. Select Sources</label>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {collections && collections.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Collections</p>
                <div className="grid gap-2">
                  {collections.map((col: any) => (
                    <div 
                      key={col.id}
                      onClick={() => toggleSelection(col.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
                        selectedDocs.has(col.id) 
                          ? "bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                          : "bg-background/50 border-border/50 hover:border-border hover:bg-muted/50"
                      )}
                    >
                      <BookOpen className={cn("h-4 w-4 shrink-0", selectedDocs.has(col.id) ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium truncate">{col.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documents && documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</p>
                <div className="grid gap-2">
                  {documents.map((doc: any) => (
                    <div 
                      key={doc.id}
                      onClick={() => toggleSelection(doc.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
                        selectedDocs.has(doc.id) 
                          ? "bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                          : "bg-background/50 border-border/50 hover:border-border hover:bg-muted/50"
                      )}
                    >
                      <FileText className={cn("h-4 w-4 shrink-0", selectedDocs.has(doc.id) ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium truncate">{doc.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
