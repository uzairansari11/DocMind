'use client';

import { useState } from 'react';
import { FlashcardDeck } from '@/components/flashcards/flashcard-deck';
import { FlashcardSetup } from '@/components/flashcards/flashcard-setup';
import { SectionShell } from '@/components/workspace/section-shell';

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

export default function FlashcardsPage() {
  const [hasGenerated, setHasGenerated] = useState(false);

  return (
    <SectionShell
      eyebrow="Study Mode"
      title="Flashcards"
    >
      <div className="w-full flex justify-center py-8">
        {!hasGenerated ? (
          <FlashcardSetup onGenerate={() => setHasGenerated(true)} />
        ) : (
          <FlashcardDeck cards={mockCards} />
        )}
      </div>
    </SectionShell>
  );
}
