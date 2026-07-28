'use client';

import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CardData } from './flashcard-deck';

interface FlashcardProps {
  card: CardData;
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
}

export function Flashcard({ card, onSwipe, index }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset > 100 || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('right');
    } else if (offset < -100 || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  // Only the top card is draggable
  const isTop = index === 0;

  return (
    <motion.div
      className={cn(
        "absolute w-full h-[380px] sm:h-[420px] max-w-md origin-bottom",
        isTop ? "cursor-grab active:cursor-grabbing z-10" : "pointer-events-none z-0"
      )}
      style={{ x, rotate, opacity }}
      animate={controls}
      initial={{ scale: 1 - index * 0.05, y: index * 20 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => isTop && setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div 
          className={cn(
            "absolute inset-0 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center",
            "bg-card border border-border/60 shadow-xl",
            "dark:bg-[#1a1a1a] dark:border-white/10 dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          )}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-8 bg-muted text-muted-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Question
          </div>
          <p className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">{card.front}</p>
          <div className="absolute bottom-8 text-xs font-medium text-muted-foreground/60 animate-pulse">
            Tap to flip
          </div>
        </div>
        
        {/* Back */}
        <div 
          className={cn(
            "absolute inset-0 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center",
            "bg-card border-2 border-primary/20 shadow-xl",
            "dark:bg-[#1a1a1a] dark:border-primary/30 dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          )}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-8 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Answer
          </div>
          <p className="text-xl sm:text-2xl font-medium text-primary/90 leading-relaxed overflow-y-auto max-h-[60%] no-scrollbar">{card.back}</p>
          <div className="absolute bottom-8 flex gap-4 w-full px-6 justify-between text-xs font-semibold text-muted-foreground/50">
            <span>← Needs Review</span>
            <span>Got it →</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
