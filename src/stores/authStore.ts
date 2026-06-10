import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '@/types/system';

type AuthState = {
  token?: string;
  user?: AppUser;
  setAuth: (token: string, user: AppUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: undefined, user: undefined }),
    }),
    {
      name: 'assets-manager-auth',
    },
  ),
);
