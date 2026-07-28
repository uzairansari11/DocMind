import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchAllDocuments, uploadDocumentRequest, updateDocument, deleteDocument, type DocumentDetail } from '@/lib/documents';

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: fetchAllDocuments,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadDocumentRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        queryClient.invalidateQueries({ queryKey: ['collections'] }),
      ]);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload document');
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update document');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        queryClient.invalidateQueries({ queryKey: ['collections'] }),
      ]);
      toast.success('Document deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete document');
    },
  });
}
