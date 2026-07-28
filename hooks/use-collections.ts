import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchCollections,
  fetchCollectionById,
  createCollectionRequest,
  updateCollectionRequest,
  deleteCollectionRequest,
} from '@/lib/collections';

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });
}

export function useCollectionDetails(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: () => fetchCollectionById(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollectionRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create collection');
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCollectionRequest,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['collections'] }),
        queryClient.invalidateQueries({ queryKey: ['collections', variables.id] }),
      ]);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update collection');
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollectionRequest,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.removeQueries({ queryKey: ['collections', id] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete collection');
    },
  });
}
