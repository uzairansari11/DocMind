import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchCollections } from '@/lib/collections';
import { cn } from '@/lib/utils';

export function FlashcardSetup({ onGenerate }: { onGenerate: (collectionId: string) => void }) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });

  const handleGenerate = () => {
    if (!selectedCollection) return;
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      onGenerate(selectedCollection);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <motion.div 
      key="setup"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-background to-muted/10"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border border-primary/20 shadow-xl relative z-10 backdrop-blur-md">
          <Layers className="h-8 w-8 text-primary drop-shadow-sm" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome to Study Mode</h2>
      <p className="text-muted-foreground max-w-sm text-base mb-8">
        Select a collection of documents to instantly generate an interactive flashcard deck.
      </p>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-3 text-left">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
            Source Collection
          </label>
          <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center p-4 text-sm text-muted-foreground border rounded-xl border-dashed">
                No collections found. Create one first!
              </div>
            ) : (
              collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCollection(c.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                    selectedCollection === c.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div>
                    <h4 className="font-medium text-foreground">{c.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description || "No description"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <Button 
          className="w-full h-12 text-base rounded-xl shadow-lg"
          onClick={handleGenerate}
          disabled={!selectedCollection || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Deck...
            </>
          ) : (
            'Generate Flashcards'
          )}
        </Button>
      </div>
    </motion.div>
  );
}
