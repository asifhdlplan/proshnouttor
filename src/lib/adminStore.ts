// =============================================================
//  src/lib/adminStore.ts
//  Admin authentication state — localStorage persisted
// =============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ADMIN_PASSWORD = '0707';
const SESSION_KEY = 'proshnouttor_admin_session';

interface AdminState {
  isAuthenticated: boolean;
  loginTime: string | null;
  login: (password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      loginTime: null,

      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          const now = new Date().toISOString();
          set({ isAuthenticated: true, loginTime: now });
          localStorage.setItem(SESSION_KEY, JSON.stringify({ authenticated: true, loginTime: now }));
          return { success: true };
        }
        return { success: false, error: 'Invalid password. Access denied.' };
      },

      logout: () => {
        set({ isAuthenticated: false, loginTime: null });
        localStorage.removeItem(SESSION_KEY);
      },
    }),
    {
      name: 'proshnouttor_admin_auth',
    }
  )
);
