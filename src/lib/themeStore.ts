// =============================================================
//  themeStore.ts
//  Zustand store — 4 dynamic themes: blue, purple, green, dark
//  Persists to localStorage, applies via data-theme attribute
// =============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'blue' | 'purple' | 'green' | 'dark';

export interface ThemeOption {
  id: ThemeName;
  label: string;
  description: string;
  preview: { primary: string; accent: string; bg: string };
  icon: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'blue',
    label: 'Ocean Blue',
    description: 'Classic tech blue with cyan accents',
    preview: { primary: '#4F46E5', accent: '#06B6D4', bg: '#F8FAFC' },
    icon: '🌊',
  },
  {
    id: 'purple',
    label: 'Royal Purple',
    description: 'Bold purple with fuchsia accents',
    preview: { primary: '#7C3AED', accent: '#D946EF', bg: '#FAFAF9' },
    icon: '👑',
  },
  {
    id: 'green',
    label: 'Emerald',
    description: 'Fresh green with teal accents',
    preview: { primary: '#059669', accent: '#14B8A6', bg: '#F0FDF4' },
    icon: '🌿',
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    description: 'Easy on the eyes, deep slate tones',
    preview: { primary: '#6366F1', accent: '#22D3EE', bg: '#0F172A' },
    icon: '🌙',
  },
];

interface ThemeState {
  theme: ThemeName;
  isDark: boolean;
  changeTheme: (name: ThemeName) => void;
}

function applyTheme(name: ThemeName) {
  const root = document.documentElement;
  root.setAttribute('data-theme', name);

  if (name === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'blue',
      isDark: false,

      changeTheme: (name: ThemeName) => {
        applyTheme(name);
        set({ theme: name, isDark: name === 'dark' });
      },
    }),
    {
      name: 'proshnouttor-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
