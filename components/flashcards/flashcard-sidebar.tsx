'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFlashcardSets } from '@/hooks/use-flashcards';
import { Loader2, Layers, Plus } from 'lucide-react';
import { FlashcardSetupModal } from '@/components/flashcards/flashcard-setup-modal';
import { cn } from '@/lib/utils';

function FlashcardSidebarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDeck = searchParams.get('deck');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: recentDecks, isLoading } = useFlashcardSets();

  return (
    <div className="w-full h-full md:w-[320px] lg:w-[360px] flex flex-col bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden shrink-0">
      <div className="p-5 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-foreground/5 rounded-xl flex items-center justify-center border border-border">
            <Layers className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Flashcards</h1>
            <p className="text-xs text-muted-foreground">Master your documents</p>
          </div>
        </div>
        
        <Button 
          className="w-full py-5 rounded-xl text-sm font-bold shadow-sm bg-foreground text-background transition-all hover:shadow-md hover:bg-foreground/90 hover:-translate-y-0.5"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Deck
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-4">Recent Decks</p>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        )}
        
        {!isLoading && recentDecks?.length === 0 && (
          <div className="text-sm text-center py-8 text-muted-foreground">
            No flashcard decks yet.
          </div>
        )}

        {!isLoading && recentDecks && recentDecks.length > 0 && (
          <div className="space-y-1.5">
            {recentDecks.map((deck: any) => (
              <div 
                key={deck.id}
                onClick={() => router.push(`/flashcards?deck=${deck.id}`)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all duration-200 text-left",
                  currentDeck === deck.id 
                    ? "bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                    : "bg-background/50 border-transparent hover:border-border hover:bg-muted/50"
                )}
              >
                <h4 className="font-medium text-sm text-foreground line-clamp-1">{deck.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{deck.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <FlashcardSetupModal 
        isOpen={isModalOpen} 
        setIsOpen={setIsModalOpen} 
      />
    </div>
  );
}

export function FlashcardSidebar() {
  return (
    <Suspense fallback={
      <div className="w-full h-full md:w-[320px] lg:w-[360px] flex flex-col bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden shrink-0" />
    }>
      <FlashcardSidebarContent />
    </Suspense>
  )
}
