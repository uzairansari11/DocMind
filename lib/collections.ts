import { api } from './api';
import type { DocumentPreview } from './documents';

export type Collection = {
  id: string;
  title: string;
  description: string;
  documents?: DocumentPreview[];
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    documents: number;
  };
};

export async function fetchCollections() {
  const response = await api.get('/collection');
  return response.data.data as Collection[];
}

export async function fetchCollectionById(id: string) {
  const response = await api.get(`/collection/${id}`);
  return response.data.data as Collection;
}

export async function createCollectionRequest(payload: { title: string; description: string }) {
  const response = await api.post('/collection', payload);
  return response.data.data as Collection;
}

export async function updateCollectionRequest({
  id,
  payload,
}: {
  id: string;
  payload: { title?: string; description?: string };
}) {
  const response = await api.patch(`/collection/${id}`, payload);
  return response.data.data as Collection;
}

export async function deleteCollectionRequest(id: string) {
  const response = await api.delete(`/collection/${id}`);
  return response.data.data;
}
