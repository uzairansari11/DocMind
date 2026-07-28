import { FlashcardStudio } from '@/components/flashcards/flashcard-studio';

export default function FlashcardDeckPage({ params }: { params: { id: string } }) {
  return <FlashcardStudio deckId={params.id} />;
}
