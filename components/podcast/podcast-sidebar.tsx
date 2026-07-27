'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCollections } from '@/hooks/use-collections';
import { useDocuments } from '@/hooks/use-documents';
import { usePodcasts } from '@/hooks/use-podcasts';
import { Play, Loader2, Plus, Headphones, Calendar, Volume2 } from 'lucide-react';
import { PodcastSetupModal } from '@/components/podcast/podcast-setup-modal';
import { api } from '@/lib/api';

export function PodcastSidebar() {
  const router = useRouter();
  const params = useParams();
  const currentId = params.id as string;

  const { data: collections } = useCollections();
  const { data: documents } = useDocuments();
  const { data: podcasts, isLoading: isLoadingPodcasts, error: podcastsError } = usePodcasts();
  
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [topic, setTopic] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'generating_script' | 'generating_audio' | 'ready'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedDocs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedDocs(newSet);
  };

  const handleGenerate = async () => {
    if (selectedDocs.size === 0) return;
    
    setStatus('generating_script');
    
    try {
      // Get the first selected doc for now
      const docId = Array.from(selectedDocs)[0];
      const res = await api.post(`documents/${docId}/podcast`, { topic });
      
      if (res.data?.success) {
        const data = res.data.data;
        setIsModalOpen(false);
        setStatus('idle');
        
        if (data && data.id) {
          router.push(`/podcast/${data.id}`);
        }
      }
    } catch (error) {
      console.error('Error generating podcast:', error);
      setStatus('idle');
    }
  };

  const handlePodcastClick = (podcast: any) => {
    if (podcast.status !== 'COMPLETED') return;
    router.push(`/podcast/${podcast.id}`);
  };

  return (
    <div className="w-full h-full md:w-[320px] lg:w-[360px] flex flex-col bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden shrink-0">
      <div className="p-5 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-foreground/5 rounded-xl flex items-center justify-center border border-border">
            <Headphones className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Podcasts</h1>
            <p className="text-xs text-muted-foreground">Your audio knowledge base</p>
          </div>
        </div>
        
        <Button 
          className="w-full py-5 rounded-xl text-sm font-bold shadow-sm bg-foreground text-background transition-all hover:shadow-md hover:bg-foreground/90 hover:-translate-y-0.5"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Podcast
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-4">Recent Podcasts</p>
        {isLoadingPodcasts && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        )}
        {podcastsError && (
          <div className="text-sm text-center py-8 text-destructive px-4 bg-destructive/10 rounded-xl mx-2">
            Failed to load podcasts. <br/>
            <span className="text-xs opacity-80">{(podcastsError as any).message}</span>
          </div>
        )}
        {!isLoadingPodcasts && !podcastsError && (!podcasts || podcasts.length === 0) && (
          <div className="text-sm text-center py-8 text-muted-foreground">
            No podcasts yet. Click "New Podcast" to create one!
          </div>
        )}
        {!isLoadingPodcasts && podcasts?.map((podcast) => {
          const isActive = currentId === podcast.id;
          return (
            <div 
              key={podcast.id} 
              onClick={() => handlePodcastClick(podcast)}
              className={`p-3 rounded-xl hover:bg-muted/80 cursor-pointer border transition-all group flex items-start gap-3 ${
                isActive ? 'bg-muted/80 border-border shadow-sm' : 'border-transparent hover:border-border/50'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                isActive ? 'bg-background border-border shadow-sm' : 'bg-background/50 border-border/50 group-hover:border-border group-hover:bg-muted/50'
              }`}>
                {podcast.status === 'FAILED' ? (
                  <span className="text-destructive font-bold text-xs">ERR</span>
                ) : podcast.status === 'COMPLETED' ? (
                  <Play className={`h-4 w-4 transition-colors ml-0.5 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0 mt-0.5">
                <p className={`text-sm font-medium truncate leading-tight transition-colors ${
                  isActive ? 'text-foreground font-semibold' : 'text-foreground'
                }`}>
                  {podcast.title || podcast.document?.title || 'Generating Podcast...'}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                  {podcast.createdAt && (
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3 opacity-70" /> {new Date(podcast.createdAt).toLocaleDateString()}</span>
                  )}
                  {podcast.durationSeconds && (
                    <span className="flex items-center gap-1"><Volume2 className="h-3 w-3 opacity-70" /> {Math.floor(podcast.durationSeconds / 60)}:{String(podcast.durationSeconds % 60).padStart(2, '0')}</span>
                  )}
                  {podcast.status !== 'COMPLETED' && (
                    <span className={`font-semibold px-1.5 py-0.5 rounded-full ${podcast.status === 'FAILED' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}`}>
                      {podcast.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PodcastSetupModal 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        topic={topic}
        setTopic={setTopic}
        collections={collections || []}
        documents={documents || []}
        selectedDocs={selectedDocs}
        toggleSelection={toggleSelection}
        handleGenerate={handleGenerate}
        status={status}
      />
    </div>
  );
}
