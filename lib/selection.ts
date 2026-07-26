const SELECTED_DOCUMENTS_KEY = 'rag-selected-documents';

export function getSelectedDocumentIds() {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(SELECTED_DOCUMENTS_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function setSelectedDocumentIds(documentIds: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SELECTED_DOCUMENTS_KEY, JSON.stringify(documentIds));
}

export function clearSelectedDocumentIds() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SELECTED_DOCUMENTS_KEY);
}
