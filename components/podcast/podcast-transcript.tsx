import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PodcastData, Segment } from './types';

const speakerColors = [
  { color: "bg-blue-500/10 text-blue-500", border: "border-blue-500/20" },
  { color: "bg-emerald-500/10 text-emerald-500", border: "border-emerald-500/20" },
  { color: "bg-purple-500/10 text-purple-500", border: "border-purple-500/20" },
  { color: "bg-orange-500/10 text-orange-500", border: "border-orange-500/20" },
];

interface PodcastTranscriptProps {
  podcastData: PodcastData;
  flattenedSegments: Segment[];
  currentSegmentIndex: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setCurrentSegmentIndex: (index: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentAudioUrl: string | null;
}

export function PodcastTranscript({
  podcastData,
  flattenedSegments,
  currentSegmentIndex,
  isPlaying,
  setIsPlaying,
  setCurrentSegmentIndex,
  audioRef,
  currentAudioUrl
}: PodcastTranscriptProps) {
  return (
    <div className="flex-1 overflow-y-auto relative scroll-smooth bg-card">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-center shadow-sm">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Transcript
        </h4>
      </div>

      <div className="max-w-3xl mx-auto pb-32 p-6 sm:p-8 pt-10">
        
        {/* Podcast Title & Description */}
        <div className="mb-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{podcastData.title || 'DocuMind Podcast'}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {podcastData.description || 'An AI-generated audio summary from your uploaded documents.'}
          </p>
        </div>
        
        {podcastData.chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-6 mb-12">
            {/* Chapter Header (only if it has a real title different from the podcast) */}
            {chapter.title && chapter.title !== 'Podcast Audio' && (
              <div className="mb-8 mt-12 text-center">
                <h5 className="text-xl font-bold text-foreground/90 tracking-tight mb-2">{chapter.title}</h5>
                {chapter.summary && <p className="text-sm text-muted-foreground max-w-lg mx-auto">{chapter.summary}</p>}
              </div>
            )}
            
            {chapter.segments.map((segment, i) => {
              const participantIndex = podcastData.participants.findIndex(p => p.id === segment.speaker);
              const participant = podcastData.participants[participantIndex] || { name: segment.speaker, role: 'host' };
              
              const isPlayingSegment = isPlaying && segment.id === flattenedSegments[currentSegmentIndex]?.id;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 1), duration: 0.3 }}
                  key={segment.id}
                  id={`segment-${segment.id}`}
                  onClick={() => {
                    const flatIndex = flattenedSegments.findIndex(s => s.id === segment.id);
                    if (flatIndex !== -1) {
                      setCurrentSegmentIndex(flatIndex);
                      if (!isPlaying) setIsPlaying(true);
                      
                      if (currentAudioUrl && audioRef.current) {
                        const charsBefore = flattenedSegments.slice(0, flatIndex).reduce((acc, seg) => acc + seg.text.length, 0);
                        const totalChars = flattenedSegments.reduce((acc, seg) => acc + seg.text.length, 0);
                        audioRef.current.currentTime = (charsBefore / totalChars) * audioRef.current.duration;
                      }
                    }
                  }}
                  className="group flex gap-4 sm:gap-6 py-3 cursor-pointer"
                >
                  <div className={cn(
                    "mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-opacity bg-foreground text-background",
                    isPlayingSegment ? "opacity-100" : "opacity-30 group-hover:opacity-60"
                  )}>
                    {participant.name[0]}
                  </div>
                  
                  <div className="flex-1">
                    <p className={cn(
                      "text-xs font-semibold mb-1 tracking-wider uppercase transition-colors",
                      isPlayingSegment 
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                    )}>
                      {participant.name}
                    </p>
                    <p className={cn(
                      "text-base sm:text-[1.1rem] leading-[1.7] transition-all duration-300",
                      isPlayingSegment ? "text-foreground font-medium" : "text-muted-foreground/60 group-hover:text-muted-foreground/90"
                    )}>
                      {segment.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
