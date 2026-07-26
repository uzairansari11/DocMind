import { api } from './api';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchProfile() {
  const response = await api.get('/auth/profile');
  return response.data.data as UserProfile;
}

export async function updateProfile(data: { firstName: string; lastName?: string }) {
  const response = await api.patch('/auth/profile', data);
  return response.data.data as UserProfile;
}
