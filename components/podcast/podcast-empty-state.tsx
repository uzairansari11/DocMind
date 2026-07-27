import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

export function PodcastEmptyState() {
  return (
    <motion.div 
      key="idle"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-background to-muted/10"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border border-primary/20 shadow-xl relative z-10 backdrop-blur-md">
          <Mic className="h-8 w-8 text-primary drop-shadow-sm" />
        </div>
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome to the Studio</h2>
      <p className="text-muted-foreground max-w-sm text-base">
        Select your source documents and hit generate to create a multi-host AI podcast diving deep into your knowledge base.
      </p>
    </motion.div>
  );
}
