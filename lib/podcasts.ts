import { api } from './api';

export type PodcastItem = {
  id: string;
  documentId: string;
  title: string | null;
  description: string | null;
  language: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  scriptUrl: string | null;
  audioUrl: string | null;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
  document: {
    id: string;
    title: string;
  };
};

export async function fetchPodcasts() {
  const response = await api.get('/documents/podcasts');
  return response.data.data as PodcastItem[];
}

export async function fetchPodcast(id: string) {
  const response = await api.get(`/documents/podcasts/${id}`);
  return response.data.data;
}

export async function generatePodcast(documentId: string, topic?: string) {
  const response = await api.post(`/documents/${documentId}/podcast`, { topic });
  return response.data;
}

export async function updatePodcast(id: string, data: { title?: string; description?: string }) {
  const response = await api.patch(`/documents/podcasts/${id}`, data);
  return response.data;
}

export async function deletePodcast(id: string) {
  const response = await api.delete(`/documents/podcasts/${id}`);
  return response.data;
}
