export interface Secret {
  id: string;
  name: string;
  category: string;
  value?: string;
  version: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  eventType: string;
  username: string;
  description: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
  totpEnabled: boolean;
}

export type SecretCategory = 'password' | 'api_key' | 'certificate' | 'token' | 'note' | 'other';
