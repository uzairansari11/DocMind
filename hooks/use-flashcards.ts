import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useFlashcards(documentId: string | null) {
  return useQuery({
    queryKey: ['flashcards', documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const response = await api.get(`/documents/${documentId}/flashcards`);
      return response.data?.data || null;
    },
    enabled: !!documentId,
  });
}
