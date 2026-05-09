import client from './client';
import { Secret } from '../types';

export const listSecrets = (category?: string) =>
  client.get<Secret[]>('/secrets', { params: category ? { category } : {} }).then((r) => r.data);

export const getSecret = (id: string) =>
  client.get<Secret>(`/secrets/${id}`).then((r) => r.data);

export const createSecret = (data: { name: string; category: string; value: string; expiresAt?: string }) =>
  client.post<Secret>('/secrets', data).then((r) => r.data);

export const updateSecret = (id: string, value: string) =>
  client.put<Secret>(`/secrets/${id}`, { value }).then((r) => r.data);

export const deleteSecret = (id: string) =>
  client.delete(`/secrets/${id}`);
