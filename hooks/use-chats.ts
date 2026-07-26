import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchChats,
  fetchChatDetails,
  createChatRequest,
  updateChatRequest,
  deleteChatRequest,
  type Chat,
} from '@/lib/chats';

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });
}

export function useChatDetails(chatId: string) {
  return useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => fetchChatDetails(chatId),
    enabled: !!chatId,
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChatRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create chat');
    },
  });
}

export function useUpdateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, payload }: { chatId: string; payload: { title?: string; isPinned?: boolean } }) =>
      updateChatRequest(chatId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chats', variables.chatId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update chat');
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChatRequest,
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.removeQueries({ queryKey: ['chats', chatId] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete chat');
    },
  });
}
