// =============================================================
//  src/lib/announcementStore.ts
//  Zustand store for the announcement system.
//  - Admin creates / toggles / deletes announcements
//  - Public site reads active announcements for the top bar
//  - Dismissed IDs tracked per-user in localStorage
//  - Full state persisted to localStorage
// =============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_ANNOUNCEMENTS } from './mockData';
import type { Announcement, AnnouncementType } from './types';

// ── Dismissed announcements (separate localStorage key) ──
const DISMISS_KEY = 'proshnouttor_dismissed_announcements';

function getDismissedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveDismissedIds(ids: Set<string>) {
  localStorage.setItem(DISMISS_KEY, JSON.stringify([...ids]));
}

// ── Store interface ──
interface AnnouncementState {
  // data
  announcements: Announcement[];

  // read helpers
  getActiveAnnouncements: () => Announcement[];
  getAnnouncementCount: () => number;
  getActiveCount: () => number;
  isDismissed: (id: string) => boolean;

  // admin actions
  createAnnouncement: (data: { title: string; body: string; type: AnnouncementType }) => Announcement;
  updateAnnouncement: (id: string, data: Partial<Pick<Announcement, 'title' | 'body' | 'type' | 'active'>>) => boolean;
  toggleAnnouncement: (id: string) => boolean;
  deleteAnnouncement: (id: string) => boolean;
  deleteMultipleAnnouncements: (ids: string[]) => number;

  // public actions
  dismissAnnouncement: (id: string) => void;
  dismissAllActive: () => void;
  resetDismissed: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      // ── Initialise from mock data ──
      announcements: JSON.parse(JSON.stringify(MOCK_ANNOUNCEMENTS)),

      // ── Read helpers ──
      getActiveAnnouncements: () => {
        const dismissed = getDismissedIds();
        return get().announcements.filter((a) => a.active && !dismissed.has(a.id));
      },

      getAnnouncementCount: () => get().announcements.length,

      getActiveCount: () => get().announcements.filter((a) => a.active).length,

      isDismissed: (id: string) => getDismissedIds().has(id),

      // ── Admin: Create announcement ──
      createAnnouncement: (data) => {
        const newAnn: Announcement = {
          id: `ann_${Date.now()}`,
          title: data.title.trim(),
          body: data.body.trim(),
          type: data.type,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ announcements: [newAnn, ...state.announcements] }));
        console.log(`[AnnouncementStore] Created: "${newAnn.title}" (${newAnn.type})`);
        return newAnn;
      },

      // ── Admin: Update announcement ──
      updateAnnouncement: (id, data) => {
        const prev = get().announcements;
        const exists = prev.some((a) => a.id === id);
        if (!exists) return false;

        set({
          announcements: prev.map((a) =>
            a.id === id
              ? { ...a, ...data, updatedAt: new Date().toISOString() }
              : a
          ),
        });
        console.log(`[AnnouncementStore] Updated: ${id}`);
        return true;
      },

      // ── Admin: Toggle active/inactive ──
      toggleAnnouncement: (id) => {
        const prev = get().announcements;
        const ann = prev.find((a) => a.id === id);
        if (!ann) return false;

        set({
          announcements: prev.map((a) =>
            a.id === id
              ? { ...a, active: !a.active, updatedAt: new Date().toISOString() }
              : a
          ),
        });
        console.log(`[AnnouncementStore] Toggled ${id}: active=${!ann.active}`);
        return true;
      },

      // ── Admin: Delete permanently ──
      deleteAnnouncement: (id) => {
        const prev = get().announcements;
        const exists = prev.some((a) => a.id === id);
        if (!exists) return false;

        set({ announcements: prev.filter((a) => a.id !== id) });
        console.log(`[AnnouncementStore] Deleted: ${id}`);
        return true;
      },

      // ── Admin: Bulk delete ──
      deleteMultipleAnnouncements: (ids) => {
        const idSet = new Set(ids);
        let count = 0;
        set((state) => {
          const before = state.announcements.length;
          const filtered = state.announcements.filter((a) => !idSet.has(a.id));
          count = before - filtered.length;
          return { announcements: filtered };
        });
        console.log(`[AnnouncementStore] Bulk deleted ${count} announcements`);
        return count;
      },

      // ── Public: Dismiss (close bar) ──
      dismissAnnouncement: (id) => {
        const dismissed = getDismissedIds();
        dismissed.add(id);
        saveDismissedIds(dismissed);
        console.log(`[AnnouncementStore] Dismissed: ${id}`);
      },

      // ── Public: Dismiss all active ──
      dismissAllActive: () => {
        const dismissed = getDismissedIds();
        get().announcements.forEach((a) => {
          if (a.active) dismissed.add(a.id);
        });
        saveDismissedIds(dismissed);
        console.log(`[AnnouncementStore] Dismissed all active`);
      },

      // ── Public: Reset dismissed (show all again) ──
      resetDismissed: () => {
        localStorage.removeItem(DISMISS_KEY);
        console.log(`[AnnouncementStore] Reset all dismissed`);
      },
    }),
    {
      name: 'proshnouttor_announcements',
      // Only persist the announcements array, not the functions
      partialize: (state) => ({ announcements: state.announcements }),
    }
  )
);
