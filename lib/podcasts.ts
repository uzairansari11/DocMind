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
