import { api } from './api';

export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    firstName: string;
    lastName?: string | null;
    email: string;
  };
};

export async function loginRequest(payload: { email: string; password: string }) {
  const response = await api.post('/auth/login', payload);
  return response.data.data as AuthResponse;
}

export async function registerRequest(payload: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}) {
  const response = await api.post('/auth/register', payload);
  return response.data.data as { id: string };
}
