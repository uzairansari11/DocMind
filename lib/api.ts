import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const stored = window.localStorage.getItem('rag-auth');
  if (!stored) return config;

  try {
    const parsed = JSON.parse(stored);
    if (parsed?.token && config.headers) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch {
    // Ignore malformed auth storage
  }

  return config;
});

export function isApiError(
  error: unknown,
): error is { response?: { data?: { message?: string } } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
