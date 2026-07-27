import { useState } from 'react';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';
import { PodcastData } from './types';

interface PodcastPlayerControlsProps {
  podcastData: PodcastData;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  currentDuration: number;
  totalDuration: number;
  audioRef: any;
  currentAudioUrl: string | null;
  handleTimeUpdate: () => void;
  currentSegmentIndex: number;
  setCurrentSegmentIndex: (index: number) => void;
}

export function PodcastPlayerControls({
  podcastData,
  isPlaying,
  setIsPlaying,
  progress,
  setProgress,
  currentDuration,
  totalDuration,
  audioRef,
  currentAudioUrl,
  handleTimeUpdate,
  currentSegmentIndex,
  setCurrentSegmentIndex,
}: PodcastPlayerControlsProps) {

  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const [actualCurrent, setActualCurrent] = useState<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdateLocal = () => {
    if (audioRef.current) {
      setActualCurrent(audioRef.current.currentTime);
    }
    handleTimeUpdate();
  };

  const displayTotal = actualDuration || totalDuration;
  const displayCurrent = actualDuration ? actualCurrent : currentDuration;

  return (
    <div className="absolute bottom-6 left-6 right-6 shrink-0 rounded-xl border border-border bg-card z-20 overflow-hidden shadow-sm">
      <audio 
        ref={audioRef}
        src={currentAudioUrl || undefined}
        onTimeUpdate={handleTimeUpdateLocal}
        onLoadedMetadata={(e) => {
          setActualDuration(e.currentTarget.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(100);
        }}
        className="hidden"
      />
      
      {/* Scrub bar Top */}
      <div className="h-1.5 w-full bg-muted/50 cursor-pointer group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const p = (e.clientX - rect.left) / rect.width;
        setProgress(p * 100);
        if (audioRef.current && audioRef.current.duration) {
          audioRef.current.currentTime = p * audioRef.current.duration;
        }
      }}>
        <div 
          className="h-full bg-foreground transition-all duration-300 ease-linear relative group-hover:bg-foreground/90"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="p-4 sm:px-6 flex items-center gap-4 sm:gap-6">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-12 w-12 shrink-0 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base tracking-tight truncate text-foreground">{podcastData.title || 'DocuMind Podcast'}</h3>
          <p className="text-xs text-muted-foreground truncate">{podcastData.description || 'Generated from your sources'}</p>
        </div>
        
        <div className="text-xs font-mono font-medium text-muted-foreground shrink-0 bg-muted/30 px-2.5 py-1 rounded-md tracking-wider">
          {formatTime(displayCurrent)} / {formatTime(displayTotal)}
        </div>
        
        <div className="hidden sm:flex items-center gap-4 ml-2">
          <button 
            className="text-muted-foreground/60 hover:text-foreground transition-colors hover:scale-110"
            onClick={() => {
               const newIndex = Math.max(0, currentSegmentIndex - 1);
               setCurrentSegmentIndex(newIndex);
               if (audioRef.current) {
                 audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
               }
            }}
          ><Rewind className="h-4 w-4" /></button>
          <button 
            className="text-muted-foreground/60 hover:text-foreground transition-colors hover:scale-110"
            onClick={() => {
               const newIndex = currentSegmentIndex + 1;
               setCurrentSegmentIndex(newIndex);
               if (audioRef.current) {
                 audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
               }
            }}
          ><FastForward className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
