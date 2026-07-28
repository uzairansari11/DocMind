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
        "absolute w-full h-full max-w-sm origin-bottom",
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
            "absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center",
            "bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
            "dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
          )}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-6 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Question
          </div>
          <p className="text-xl sm:text-2xl font-medium text-foreground">{card.front}</p>
          <div className="absolute bottom-6 text-xs text-muted-foreground animate-pulse">
            Tap to flip
          </div>
        </div>
        
        {/* Back */}
        <div 
          className={cn(
            "absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center",
            "bg-primary/5 backdrop-blur-xl border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
            "dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
          )}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-6 text-xs font-semibold text-primary uppercase tracking-widest">
            Answer
          </div>
          <p className="text-xl sm:text-2xl font-medium text-primary leading-relaxed overflow-y-auto max-h-[70%] no-scrollbar">{card.back}</p>
          <div className="absolute bottom-6 flex gap-4 w-full px-4 justify-between text-xs text-muted-foreground">
            <span>← Needs Review</span>
            <span>Got it →</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
