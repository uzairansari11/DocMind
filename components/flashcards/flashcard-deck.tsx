'use client';

import { useState } from 'react';
import { Flashcard } from './flashcard';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface CardData {
  id: string;
  front: string;
  back: string;
}

interface FlashcardDeckProps {
  cards: CardData[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [deck, setDeck] = useState<CardData[]>(cards);
  const [known, setKnown] = useState<CardData[]>([]);
  const [learning, setLearning] = useState<CardData[]>([]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (deck.length === 0) return;
    
    const [current, ...rest] = deck;
    
    if (direction === 'right') {
      setKnown([...known, current]);
    } else {
      setLearning([...learning, current]);
    }
    
    setDeck(rest);
  };

  const resetDeck = () => {
    // Optionally mix in learning cards again, but for now just reset all
    setDeck(cards);
    setKnown([]);
    setLearning([]);
  };

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Check className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">You're all caught up!</h2>
        <div className="flex gap-8 text-center text-muted-foreground mt-4">
          <div>
            <p className="text-4xl font-bold text-green-500">{known.length}</p>
            <p className="text-sm mt-1">Mastered</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-orange-500">{learning.length}</p>
            <p className="text-sm mt-1">Reviewing</p>
          </div>
        </div>
        <Button onClick={resetDeck} size="lg" className="mt-8 rounded-full shadow-lg">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Study Again
        </Button>
      </div>
    );
  }

  const progress = ((cards.length - deck.length) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full flex-1 justify-center py-4">
      <div className="w-full mb-6 space-y-2 px-4 shrink-0">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>{deck.length} remaining</span>
          <span>{known.length + learning.length} / {cards.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="relative w-full h-[450px] max-w-md flex justify-center perspective-[1200px] shrink-0 mt-4">
        {deck.slice(0, 3).map((card, index) => (
          <Flashcard 
            key={card.id} 
            card={card} 
            index={index} 
            onSwipe={handleSwipe} 
          />
        )).reverse()}
      </div>

      <div className="flex gap-8 mt-8 sm:mt-12 shrink-0 z-20">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-16 w-16 rounded-full border-2 border-red-500/30 text-red-500 bg-background hover:bg-red-500 hover:border-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/25 hover:scale-110 active:scale-95"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-16 w-16 rounded-full border-2 border-green-500/30 text-green-500 bg-background hover:bg-green-500 hover:border-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/25 hover:scale-110 active:scale-95"
          onClick={() => handleSwipe('right')}
        >
          <Check className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
