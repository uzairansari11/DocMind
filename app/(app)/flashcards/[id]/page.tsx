import { FlashcardStudio } from '@/components/flashcards/flashcard-studio';

export default async function FlashcardDeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FlashcardStudio deckId={id} />;
}
