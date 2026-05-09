import client from './client';
import { AuthResponse } from '../types';

export const login = (username: string, password: string) =>
  client.post<AuthResponse>('/auth/login', { username, password }).then((r) => r.data);

export const register = (username: string, password: string) =>
  client.post<AuthResponse>('/auth/register', { username, password }).then((r) => r.data);

export const setupTotp = () =>
  client.post<{ secret: string; qrUri: string }>('/auth/totp/setup').then((r) => r.data);

export const verifyTotp = (code: string) =>
  client.post('/auth/totp/verify', null, { params: { code } });
