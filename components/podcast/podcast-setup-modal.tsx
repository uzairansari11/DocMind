import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, BookOpen, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomModal } from '@/components/ui/custom-modal';

interface PodcastSetupModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;
  collections: any[];
  documents: any[];
  selectedDocs: Set<string>;
  toggleSelection: (id: string) => void;
  handleGenerate: () => void;
  status: string;
}

export function PodcastSetupModal({
  isOpen,
  setIsOpen,
  topic,
  setTopic,
  collections,
  documents,
  selectedDocs,
  toggleSelection,
  handleGenerate,
  status
}: PodcastSetupModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={setIsOpen}
      title="Create a New Podcast"
      description="Select source documents and optionally provide a topic to generate a multi-host AI podcast."
      icon={Sparkles}
      footer={
        <Button 
          className="w-full py-6 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
          onClick={handleGenerate}
          disabled={status === 'generating_script' || status === 'generating_audio' || (selectedDocs.size === 0 && !topic)}
        >
          {(status === 'generating_script' || status === 'generating_audio') ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="mr-2 h-5 w-5" /> Generate Podcast</>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold tracking-tight">1. What's the topic? (Optional)</label>
          <Textarea 
            placeholder="E.g., Discuss the implications of AI on healthcare from these documents..."
            className="resize-none h-24 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold tracking-tight">2. Select Sources</label>
          
          <div className="space-y-4">
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
