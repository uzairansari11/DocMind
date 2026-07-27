import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

export function PodcastLoadingState({ status }: { status: 'generating_script' | 'generating_audio' }) {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20"
    >
      <div className="relative h-32 w-32 mb-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute inset-0 border-[3px] border-primary/20 rounded-full animate-pulse" />
        <div className="absolute inset-2 border-[3px] border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-6 border-[3px] border-b-primary border-l-primary border-t-transparent border-r-transparent rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
        <div className="h-16 w-16 bg-card rounded-full flex items-center justify-center shadow-inner relative z-10">
          <Mic className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-3xl font-extrabold tracking-tight mb-3 animate-pulse bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
        {status === 'generating_script' ? 'Writing the script...' : 'Synthesizing voices...'}
      </h2>
      <p className="text-muted-foreground text-lg">This usually takes about a minute. Sit tight!</p>
    </motion.div>
  );
}
