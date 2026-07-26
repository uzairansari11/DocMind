import { API_BASE_URL, api } from './api';

export type Chat = {
  id: string;
  title: string | null;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
};

export type ChatDetail = Chat & {
  messages?: Message[];
};

export type Source = {
  fileName?: string;
  page?: number;
};

type StreamHandlers = {
  onToken: (token: string) => void;
  onSources: (sources: Source[]) => void;
  onDone: () => void;
  onError: (message: string) => void;
};

function getStoredToken() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem('rag-auth');
    const parsed = stored ? JSON.parse(stored) : null;
    return typeof parsed?.token === 'string' ? parsed.token : null;
  } catch {
    return null;
  }
}

export async function createChatRequest(payload: { title?: string; documentIds: string[] }) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.message ?? 'Unable to create chat');
  }

  return json.data as Chat;
}

export async function fetchChats() {
  const response = await api.get('/chat');
  return response.data.data as Chat[];
}

export async function updateChatRequest(chatId: string, payload: { title?: string; isPinned?: boolean }) {
  const response = await api.patch(`/chat/${chatId}`, payload);
  return response.data.data as Chat;
}

export async function deleteChatRequest(chatId: string) {
  const response = await api.delete(`/chat/${chatId}`);
  return response.data;
}

export async function fetchChatDetails(chatId: string) {
  const response = await api.get(`/chat/${chatId}`);
  const data = response.data.data;
  if (data.messages) {
    data.messages = data.messages.map((m: any) => ({
      ...m,
      role: m.role?.toLowerCase() || 'user',
    }));
  }
  return data as ChatDetail;
}

export async function sendMessageStream(
  chatId: string,
  message: string,
  handlers: StreamHandlers,
) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok || !response.body) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.message ?? 'Unable to send message');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const line = event
        .split('\n')
        .find((item) => item.startsWith('data:'));

      if (!line) continue;

      try {
        const payload = JSON.parse(line.replace(/^data:\s*/, ''));

        if (payload.type === 'token') {
          handlers.onToken(payload.content ?? '');
        } else if (payload.type === 'sources') {
          handlers.onSources(payload.sources ?? []);
        } else if (payload.type === 'done') {
          handlers.onDone();
        } else if (payload.type === 'error') {
          handlers.onError(payload.message ?? 'Streaming failed');
        }
      } catch {
        handlers.onError('Unable to read a streamed response chunk.');
      }
    }
  }
}
