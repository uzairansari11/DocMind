'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { fetchProxyUrl } from '@/app/actions';
import { PodcastData, Segment } from '@/components/podcast/types';
import { PodcastLoadingState } from '@/components/podcast/podcast-loading-state';
import { PodcastTranscript } from '@/components/podcast/podcast-transcript';
import { PodcastPlayerControls } from '@/components/podcast/podcast-player-controls';
import { AnimatePresence, motion } from 'framer-motion';

export function PodcastPlayer({ id }: { id: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [flattenedSegments, setFlattenedSegments] = useState<Segment[]>([]);
  
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadPodcast() {
      setStatus('loading');
      try {
        const detailRes = await api.get(`documents/podcasts/${id}`);
        const fullPodcast = detailRes.data?.data || detailRes.data;

        if (!fullPodcast) throw new Error('Podcast not found');

        let audioUrl = fullPodcast.audioUrl;
        let data = null;

        if (fullPodcast.scriptUrl) {
          if (fullPodcast.scriptUrl.includes('.mp3') || fullPodcast.scriptUrl.includes('audio')) {
            audioUrl = audioUrl || fullPodcast.scriptUrl;
          } else {
            const result = await fetchProxyUrl(fullPodcast.scriptUrl);
            if (result.success && result.data) {
              data = result.data;
            }
          }
        }

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
        data.estimatedDurationSeconds = fullPodcast.durationSeconds || totalTime;

        if (isMounted) {
          setPodcastData({ ...data, title: fullPodcast.title || data.title });
          
          const flatSegments = data.chapters.flatMap((c: any) => c.segments);
          setFlattenedSegments(flatSegments);
          
          if (audioUrl) {
            setCurrentAudioUrl(audioUrl);
          }
          
          setStatus('ready');
        }
      } catch (err) {
        console.error('Failed to load podcast:', err);
        if (isMounted) setStatus('error');
      }
    }

    loadPodcast();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

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
    <div className="flex-1 flex flex-col relative bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full">
      <AnimatePresence mode="wait">
        
        {status === 'loading' && (
          <PodcastLoadingState key="loading" status="generating_script" />
        )}

        {status === 'error' && (
          <div key="error" className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-xl font-bold mb-2">Podcast Not Found</h2>
            <p className="text-muted-foreground">We couldn't load this podcast. It may have been deleted or there was a network error.</p>
          </div>
        )}

        {status === 'ready' && podcastData && (
          <motion.div 
            key="ready"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col overflow-hidden h-full"
          >
            
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
  );
}
