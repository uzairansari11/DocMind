'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCollections } from '@/hooks/use-collections';
import { useDocuments } from '@/hooks/use-documents';
import { usePodcasts } from '@/hooks/use-podcasts';
import { Play, Loader2, Plus, Headphones, Calendar, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { api } from '@/lib/api';
import { fetchProxyUrl } from '@/app/actions';
import { PodcastData, Segment } from '@/components/podcast/types';
import { PodcastEmptyState } from '@/components/podcast/podcast-empty-state';
import { PodcastLoadingState } from '@/components/podcast/podcast-loading-state';
import { PodcastStage } from '@/components/podcast/podcast-stage';
import { PodcastTranscript } from '@/components/podcast/podcast-transcript';
import { PodcastPlayerControls } from '@/components/podcast/podcast-player-controls';
import { PodcastSetupModal } from '@/components/podcast/podcast-setup-modal';

export function PodcastStudio() {
  const { data: collections } = useCollections();
  const { data: documents } = useDocuments();
  const { data: podcasts, isLoading: isLoadingPodcasts, error: podcastsError } = usePodcasts();
  
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [topic, setTopic] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'generating_script' | 'generating_audio' | 'ready'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [flattenedSegments, setFlattenedSegments] = useState<Segment[]>([]);
  
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedDocs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedDocs(newSet);
  };

  const handleGenerate = async () => {
    if (selectedDocs.size === 0) return;
    
    setStatus('generating_script');
    setIsModalOpen(false);
    
    try {
      // Get the first selected doc for now
      const docId = Array.from(selectedDocs)[0];
      const res = await api.post(`documents/${docId}/podcast`, { topic });
      
      if (res.data?.success) {
        let data = res.data.data;
        
        // Calculate realistic durations based on actual text length so everything is perfectly synced
        let totalTime = 0;
        data.chapters = data.chapters.map((chapter: any) => {
          const chars = chapter.segments.reduce((acc: any, seg: any) => acc + seg.text.length, 0);
          const duration = Math.max(1, Math.ceil(chars / 12)); // 12 chars per second average reading speed
          totalTime += duration;
          return { ...chapter, estimatedDurationSeconds: duration };
        });
        data.estimatedDurationSeconds = totalTime;

        setPodcastData(data);
        
        const flatSegments = data.chapters.flatMap((c: any) => c.segments);
        setFlattenedSegments(flatSegments);
        setCurrentSegmentIndex(0);
        setProgress(0);
        setIsPlaying(false);

        setStatus('generating_audio');
        setTimeout(() => {
          setStatus('ready');
          setIsPlaying(true);
          
          if (data.audioUrl) {
            setCurrentAudioUrl(data.audioUrl);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error generating podcast:', error);
      setStatus('idle');
    }
  };

  const handlePlayPodcast = async (podcast: any) => {
    if (podcast.status !== 'COMPLETED') return;
    
    setIsPlaying(false);
    setProgress(0);
    setCurrentSegmentIndex(0);
    setStatus('generating_script'); // Show loading while we fetch details
    
    try {
      // Fetch full details from the API
      const detailRes = await api.get(`podcasts/${podcast.id}`);
      const fullPodcast = detailRes.data?.data || detailRes.data || podcast;

      let audioUrl = fullPodcast.audioUrl;
      let data = null;

      if (fullPodcast.scriptUrl) {
        // If the scriptUrl is actually pointing to an audio file
        if (fullPodcast.scriptUrl.includes('.mp3') || fullPodcast.scriptUrl.includes('audio')) {
          audioUrl = audioUrl || fullPodcast.scriptUrl;
        } else {
          const result = await fetchProxyUrl(fullPodcast.scriptUrl);
          if (result.success && result.data) {
            data = result.data;
          }
        }
      }

      // Dummy transcript if none exists
      if (!data) {
        data = { chapters: [{ id: '1', title: 'Podcast Audio', segments: [{ id: '1', speaker: 'System', text: 'Audio playback started. No transcript available.' }] }] };
      }
      
      let totalTime = 0;
      data.chapters = data.chapters.map((chapter: any) => {
        const chars = chapter.segments.reduce((acc: any, seg: any) => acc + (seg.text?.length || 0), 0);
        const duration = Math.max(1, Math.ceil(chars / 12)); 
        totalTime += duration;
        return { ...chapter, estimatedDurationSeconds: duration };
      });
      data.estimatedDurationSeconds = podcast.durationSeconds || totalTime;

      setPodcastData({ ...data, title: podcast.title || data.title });
      
      const flatSegments = data.chapters.flatMap((c: any) => c.segments);
      setFlattenedSegments(flatSegments);
      
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
      }
      
      setStatus('ready');
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing podcast:', error);
    }
  };

  useEffect(() => {
    if (status === 'ready' && isPlaying) {
      if (currentAudioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play error:', e));
      }
    } else {
      if (currentAudioUrl && audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudioUrl, status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && status === 'ready' && !currentAudioUrl) {
      const totalDur = podcastData?.estimatedDurationSeconds || 120;
      interval = setInterval(() => {
        setProgress(p => {
          const increment = (0.1 / totalDur) * 100;
          return Math.min(100, p + increment);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, status, podcastData, currentAudioUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      
      if (flattenedSegments.length > 0 && audioRef.current.duration) {
        const totalChars = flattenedSegments.reduce((acc, seg) => acc + seg.text.length, 0);
        const currentChars = (audioRef.current.currentTime / audioRef.current.duration) * totalChars;
        
        let foundIndex = 0;
        let cumulative = 0;
        for (let i = 0; i < flattenedSegments.length; i++) {
          cumulative += flattenedSegments[i].text.length;
          if (currentChars <= cumulative) {
            foundIndex = i;
            break;
          }
        }
        if (currentSegmentIndex !== foundIndex) {
          setCurrentSegmentIndex(foundIndex);
        }
      }
    }
  };

  useEffect(() => {
    if (isPlaying && flattenedSegments[currentSegmentIndex]) {
      const element = document.getElementById(`segment-${flattenedSegments[currentSegmentIndex].id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSegmentIndex, isPlaying, flattenedSegments]);

  const totalDuration = podcastData?.estimatedDurationSeconds || 120;
  const currentDuration = (progress / 100) * totalDuration;

  return (
    <div className="flex h-full min-h-[600px] w-full flex-col md:flex-row gap-4">
      {/* ── Left Panel: History & Create ── */}
      <div className="w-full h-full md:w-[320px] lg:w-[360px] flex flex-col bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden shrink-0">
        <div className="p-5 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Headphones className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Podcasts</h1>
              <p className="text-xs text-muted-foreground">Your audio knowledge base</p>
            </div>
          </div>
          
          <Button 
            className="w-full py-5 rounded-xl text-sm font-bold shadow-md shadow-primary/10 transition-all hover:shadow-lg hover:-translate-y-0.5"
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
          {!isLoadingPodcasts && podcasts?.map((podcast) => (
            <div 
              key={podcast.id} 
              onClick={() => handlePlayPodcast(podcast)}
              className="p-3 rounded-xl hover:bg-muted/60 cursor-pointer border border-transparent hover:border-border/50 transition-all group flex items-start gap-3"
            >
              <div className="h-10 w-10 bg-background/50 rounded-lg flex items-center justify-center border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 shrink-0 transition-colors">
                {podcast.status === 'FAILED' ? (
                  <span className="text-destructive font-bold text-xs">ERR</span>
                ) : podcast.status === 'COMPLETED' ? (
                  <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0 mt-0.5">
                <p className="text-sm font-medium text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                  {podcast.title || podcast.document?.title || 'Generating Podcast...'}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3 opacity-70" /> {new Date(podcast.createdAt).toLocaleDateString()}</span>
                  {podcast.durationSeconds && (
                    <span className="flex items-center gap-1"><Volume2 className="h-3 w-3 opacity-70" /> {Math.floor(podcast.durationSeconds / 60)}:{String(podcast.durationSeconds % 60).padStart(2, '0')}</span>
                  )}
                  {podcast.status !== 'COMPLETED' && (
                    <span className={`font-semibold px-1.5 py-0.5 rounded-full ${podcast.status === 'FAILED' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      {podcast.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Player & Transcript ── */}
      <div className="flex-1 flex flex-col relative bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Empty State */}
          {status === 'idle' && <PodcastEmptyState key="idle" />}

          {/* Loading State */}
          {(status === 'generating_script' || status === 'generating_audio') && (
            <PodcastLoadingState key="loading" status={status} />
          )}

          {/* Result State */}
          {status === 'ready' && podcastData && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              <PodcastStage 
                podcastData={podcastData}
                flattenedSegments={flattenedSegments}
                currentSegmentIndex={currentSegmentIndex}
                isPlaying={isPlaying}
              />
              
              <PodcastTranscript 
                podcastData={podcastData}
                flattenedSegments={flattenedSegments}
                currentSegmentIndex={currentSegmentIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setCurrentSegmentIndex={setCurrentSegmentIndex}
                audioRef={audioRef}
                currentAudioUrl={currentAudioUrl}
              />

              <PodcastPlayerControls 
                podcastData={podcastData}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                progress={progress}
                setProgress={setProgress}
                currentDuration={currentDuration}
                totalDuration={totalDuration}
                audioRef={audioRef}
                currentAudioUrl={currentAudioUrl}
                handleTimeUpdate={handleTimeUpdate}
                currentSegmentIndex={currentSegmentIndex}
                setCurrentSegmentIndex={setCurrentSegmentIndex}
              />
            </motion.div>
          )}

        </AnimatePresence>
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
