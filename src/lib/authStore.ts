// =============================================================
//  src/lib/authStore.ts
//  Zustand-powered auth store — simulates NextAuth session API.
//  Supports: Google OAuth (simulated), Email/Password login,
//  registration, logout, and localStorage persistence.
// =============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  reputation: number;
  provider: 'google' | 'email' | 'github';
  createdAt: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  // Actions
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  updateReputation: (delta: number) => void;
}

// ── Simulated "DB" stored in localStorage ─────────────────────
const USERS_DB_KEY = 'proshnouttor_users_db';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain for demo — in prod use bcrypt
  image: string | null;
  reputation: number;
  provider: 'email';
  createdAt: string;
}

function getUsersDb(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsersDb(users: StoredUser[]) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

// ── Google OAuth profiles (simulated) ─────────────────────────
const GOOGLE_PROFILES: AuthUser[] = [
  {
    id: 'google_user_1',
    name: 'Rafiq Islam',
    email: 'rafiq.islam@gmail.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rafiq&backgroundColor=b6e3f4',
    reputation: 1250,
    provider: 'google',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'google_user_2',
    name: 'Nadia Haque',
    email: 'nadia.haque@gmail.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=nadia&backgroundColor=ffd5dc',
    reputation: 890,
    provider: 'google',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'google_user_3',
    name: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@gmail.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=tanvir&backgroundColor=c0aede',
    reputation: 2100,
    provider: 'google',
    createdAt: new Date().toISOString(),
  },
];

// ── Zustand store ──────────────────────────────────────────────
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      status: 'unauthenticated',

      // ── Google OAuth (simulated popup) ─────────────────────
      signInWithGoogle: async () => {
        set({ status: 'loading' });
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 1200));
        // Pick a random Google profile to simulate OAuth selection
        const profile = GOOGLE_PROFILES[Math.floor(Math.random() * GOOGLE_PROFILES.length)];
        set({ user: profile, status: 'authenticated' });
      },

      // ── Email/Password sign-in ─────────────────────────────
      signInWithEmail: async (email: string, password: string) => {
        set({ status: 'loading' });
        await new Promise((r) => setTimeout(r, 800));

        const users = getUsersDb();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
          set({ status: 'unauthenticated' });
          return { error: 'Invalid email or password. Please try again.' };
        }

        const authUser: AuthUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          image: found.image,
          reputation: found.reputation,
          provider: 'email',
          createdAt: found.createdAt,
        };
        set({ user: authUser, status: 'authenticated' });
        return {};
      },

      // ── Email registration ─────────────────────────────────
      signUp: async (name: string, email: string, password: string) => {
        set({ status: 'loading' });
        await new Promise((r) => setTimeout(r, 900));

        const users = getUsersDb();
        const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          set({ status: 'unauthenticated' });
          return { error: 'An account with this email already exists.' };
        }

        const newUser: StoredUser = {
          id: `email_user_${Date.now()}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          image: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
          reputation: 1,
          provider: 'email',
          createdAt: new Date().toISOString(),
        };

        saveUsersDb([...users, newUser]);

        const authUser: AuthUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          reputation: newUser.reputation,
          provider: 'email',
          createdAt: newUser.createdAt,
        };
        set({ user: authUser, status: 'authenticated' });
        return {};
      },

      // ── Sign out ───────────────────────────────────────────
      signOut: () => {
        set({ user: null, status: 'unauthenticated' });
      },

      // ── Update reputation ──────────────────────────────────
      updateReputation: (delta: number) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, reputation: Math.max(1, user.reputation + delta) } });
      },
    }),
    {
      name: 'proshnouttor_auth',
      // Only persist user + status
      partialize: (state) => ({ user: state.user, status: state.status }),
    }
  )
);
