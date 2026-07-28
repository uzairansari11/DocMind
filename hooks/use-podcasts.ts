import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPodcasts, fetchPodcast, generatePodcast, updatePodcast, deletePodcast } from '@/lib/podcasts';

export function usePodcasts() {
  return useQuery({
    queryKey: ['podcasts'],
    queryFn: fetchPodcasts,
  });
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: ['podcasts', id],
    queryFn: () => fetchPodcast(id),
    enabled: !!id,
  });
}

export function useGeneratePodcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, topic }: { documentId: string; topic?: string }) => 
      generatePodcast(documentId, topic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
  });
}

export function useUpdatePodcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string } }) => 
      updatePodcast(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.invalidateQueries({ queryKey: ['podcasts', variables.id] });
    },
  });
}

export function useDeletePodcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePodcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
  });
}
