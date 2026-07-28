import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useFlashcardSets() {
  return useQuery({
    queryKey: ['flashcardSets'],
    queryFn: async () => {
      const response = await api.get(`/flashcards`);
      return response.data?.data || [];
    },
  });
}

export function useFlashcardSet(flashcardSetId: string | null) {
  return useQuery({
    queryKey: ['flashcardSet', flashcardSetId],
    queryFn: async () => {
      if (!flashcardSetId) return null;
      const response = await api.get(`/flashcards/${flashcardSetId}`);
      return response.data?.data || null;
    },
    enabled: !!flashcardSetId,
  });
}
