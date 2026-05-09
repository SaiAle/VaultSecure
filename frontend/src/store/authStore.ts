import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  totpEnabled: boolean;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, username: string, role: string, totpEnabled: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('vs_token'),
  username: localStorage.getItem('vs_user'),
  role: localStorage.getItem('vs_role'),
  totpEnabled: false,
  isAuthenticated: !!localStorage.getItem('vs_token'),

  login: (token, refreshToken, username, role, totpEnabled) => {
    localStorage.setItem('vs_token', token);
    localStorage.setItem('vs_refresh', refreshToken);
    localStorage.setItem('vs_user', username);
    localStorage.setItem('vs_role', role);
    set({ token, username, role, totpEnabled, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_refresh');
    localStorage.removeItem('vs_user');
    localStorage.removeItem('vs_role');
    set({ token: null, username: null, role: null, isAuthenticated: false });
  },
}));
