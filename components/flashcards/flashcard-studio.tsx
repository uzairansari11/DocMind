'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlashcardDeck } from './flashcard-deck';
import { FlashcardEmptyState } from './flashcard-empty-state';

import { useFlashcardSet } from '@/hooks/use-flashcards';
import { Loader2 } from 'lucide-react';

const mockCards = [
  {
    id: '1',
    front: 'What is the primary purpose of a 1099-INT form?',
    back: 'A 1099-INT form is used to report interest income from banks, brokerages, and other financial institutions to the IRS.',
  },
  {
    id: '2',
    front: 'What does "AGI" stand for on a tax return?',
    back: 'Adjusted Gross Income. It is your total gross income minus specific deductions, and it is used to calculate your taxable income.',
  },
  {
    id: '3',
    front: 'What is the difference between a tax deduction and a tax credit?',
    back: 'A tax deduction reduces your taxable income, while a tax credit directly reduces the amount of tax you owe, dollar for dollar.',
  },
  {
    id: '4',
    front: 'When is the typical deadline to file federal income taxes in the US?',
    back: 'April 15th, unless it falls on a weekend or holiday.',
  },
  {
    id: '5',
    front: 'What is a W-2 form?',
    back: 'A form sent by an employer to an employee and the IRS reporting the employee\'s annual wages and the amount of taxes withheld from their paycheck.',
  },
];

function FlashcardStudioContent() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck');
  
  const { data: deckData, isLoading } = useFlashcardSet(deckId !== 'mock' ? deckId : null);

  if (deckId === 'mock') {
    return (
      <div className="w-full flex justify-center py-8 h-full items-center relative z-10">
        <FlashcardDeck cards={mockCards} />
      </div>
    );
  }
  
  if (deckId && isLoading) {
    return (
      <div className="w-full flex flex-col justify-center py-8 h-full items-center relative z-10 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm">Generating flashcards...</p>
      </div>
    );
  }
  
  if (deckId && deckData) {
    const formattedCards = deckData.flashcards?.map((c: any) => ({
      id: c.id,
      front: c.question,
      back: c.answer
    })) || [];
    
    return (
      <div className="w-full flex justify-center py-8 h-full items-center relative z-10">
        <FlashcardDeck cards={formattedCards} />
      </div>
    );
  }

  return <FlashcardEmptyState />;
}

export function FlashcardStudio() {
  return (
    <Suspense fallback={<FlashcardEmptyState />}>
      <FlashcardStudioContent />
    </Suspense>
  );
}
