import { api } from './api';

export type DocumentPreview = {
  id: string;
  title: string;
  fileName: string;
  status: string;
  collectionId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DocumentDetail = {
  id: string;
  title: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  errorMessage: string | null;
  status: string;
  processedAt: string | null;
  createdAt: string;
  collection: {
    title: string;
  };
};

export async function fetchAllDocuments() {
  const response = await api.get('/documents');
  return response.data.data as DocumentDetail[];
}

export async function uploadDocumentRequest(payload: {
  title: string;
  collectionId: string;
  document: File;
}) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('collectionId', payload.collectionId);
  formData.append('document', payload.document);

  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data as DocumentPreview;
}

export async function fetchDocument(documentId: string) {
  const response = await api.get(`/documents/${documentId}`);
  return response.data.data as DocumentDetail;
}

export async function updateDocument({ id, title }: { id: string; title: string }) {
  const response = await api.patch(`/documents/${id}`, { title });
  return response.data.data as DocumentDetail;
}

export async function deleteDocument(documentId: string) {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
}
