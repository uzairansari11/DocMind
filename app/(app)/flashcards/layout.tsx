'use client';

import { SectionShell } from '@/components/workspace/section-shell';
import { FlashcardSidebar } from '@/components/flashcards/flashcard-sidebar';

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SectionShell eyebrow="Study Mode" title="Flashcards" className="h-full min-h-[calc(100vh-8rem)]">
      <div className="flex h-full min-h-[600px] w-full flex-col md:flex-row gap-4">
        <FlashcardSidebar />
        <div className="flex-1 flex flex-col relative bg-card rounded-2xl border-transparent shadow-none overflow-hidden">
          {children}
        </div>
      </div>
    </SectionShell>
  );
}
