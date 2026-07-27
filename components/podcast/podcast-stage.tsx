import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PodcastData, Segment } from './types';

interface PodcastStageProps {
  podcastData: PodcastData | null;
  flattenedSegments: Segment[];
  currentSegmentIndex: number;
  isPlaying: boolean;
}

export function PodcastStage({
  podcastData,
  flattenedSegments,
  currentSegmentIndex,
  isPlaying,
}: PodcastStageProps) {
  const activeSegment = flattenedSegments[currentSegmentIndex];
  const activeParticipant = podcastData?.participants.find(p => p.id === activeSegment?.speaker);
  const isHostActive = activeParticipant?.role === 'host';
  const isExpertActive = activeParticipant?.role !== 'host';
  
  return (
    <div className="shrink-0 pt-28 pb-12 relative flex items-center justify-center gap-16 sm:gap-48 bg-gradient-to-b from-background via-muted/10 to-background border-b border-border/10 hidden sm:flex overflow-hidden">
      
      {/* Background glow for active speaker */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r transition-all duration-1000 ease-out opacity-20 blur-3xl pointer-events-none",
        isHostActive ? "from-primary/40 via-transparent to-transparent" : "from-transparent via-transparent to-primary/40"
      )} />

      {/* Central Teleprompter (Replaces individual bubbles) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30">
        <AnimatePresence mode="wait">
          {isPlaying && activeSegment && (
            <motion.div 
              key={activeSegment.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-card/80 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-2xl p-5 text-center flex flex-col items-center gap-3 relative overflow-hidden group"
            >
              <div className={cn(
                "absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r transition-all duration-700",
                isHostActive ? "from-primary via-primary/50 to-transparent" : "from-transparent via-primary/50 to-primary"
              )} />
              
              <div className="flex items-center gap-2 mb-1">
                 <div className={cn(
                   "w-2 h-2 rounded-full animate-pulse",
                   "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                 )} />
                 <span className="text-xs font-bold uppercase tracking-widest text-primary drop-shadow-sm">
                   {activeParticipant?.name || (isHostActive ? 'Host' : 'Expert')}
                 </span>
              </div>
              
              <p className="text-base sm:text-lg font-medium leading-relaxed text-foreground line-clamp-2">
                "{activeSegment.text}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Host */}
      <div className="flex flex-col items-center gap-6 relative z-20">
        {/* Pulsing rings */}
        {isPlaying && isHostActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 mt-[-20px]">
            <div className="absolute w-40 h-40 border-2 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-56 h-56 border border-primary/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          </div>
        )}

        <div className="relative">
          <div className={cn("transition-all duration-500 ease-in-out relative z-10", !(isPlaying && isHostActive) && "opacity-70 scale-95")}>
            {isPlaying && isHostActive && <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 -z-10" />}
            <div className={cn(
              "w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg transition-all duration-500 border border-white/10",
              "bg-gradient-to-br from-indigo-500 to-purple-600",
              isPlaying && isHostActive && "ring-2 ring-primary/50 shadow-xl shadow-primary/20 scale-105"
            )}>
              {podcastData?.participants.find(p => p.role === 'host')?.name?.charAt(0) || 'H'}
            </div>
          </div>
        </div>

        <div className={cn(
          "font-bold text-sm px-5 py-1.5 rounded-full transition-all duration-500 shadow-sm",
          isPlaying && isHostActive ? "bg-primary text-primary-foreground shadow-primary/25 shadow-lg scale-110" : "bg-muted text-muted-foreground"
        )}>
          {podcastData?.participants.find(p => p.role === 'host')?.name || 'Host'}
        </div>
      </div>

      {/* Expert */}
      <div className="flex flex-col items-center gap-6 relative z-20">
        {/* Pulsing rings */}
        {isPlaying && isExpertActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 mt-[-20px]">
            <div className="absolute w-40 h-40 border-2 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-56 h-56 border border-primary/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          </div>
        )}

        <div className="relative">
          <div className={cn("transition-all duration-500 ease-in-out relative z-10", !(isPlaying && isExpertActive) && "opacity-70 scale-95")}>
            {isPlaying && isExpertActive && <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 -z-10" />}
            <div className={cn(
              "w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg transition-all duration-500 border border-white/10",
              "bg-gradient-to-br from-emerald-400 to-cyan-500",
              isPlaying && isExpertActive && "ring-2 ring-primary/50 shadow-xl shadow-primary/20 scale-105"
            )}>
              {podcastData?.participants.find(p => p.role !== 'host')?.name?.charAt(0) || 'E'}
            </div>
          </div>
        </div>

        <div className={cn(
          "font-bold text-sm px-5 py-1.5 rounded-full transition-all duration-500 shadow-sm",
          isPlaying && isExpertActive ? "bg-primary text-primary-foreground shadow-primary/25 shadow-lg scale-110" : "bg-muted text-muted-foreground"
        )}>
          {podcastData?.participants.find(p => p.role !== 'host')?.name || 'Expert'}
        </div>
      </div>
    </div>
  );
}
