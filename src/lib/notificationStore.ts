// =============================================================
//  src/lib/notificationStore.ts
//  Local storage zustand notification tracking
// =============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string; // recipient
  senderName: string;
  questionId: string;
  questionTitle: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (data) => set((state) => ({
        notifications: [
          {
            id: `notif_${Date.now()}`,
            read: false,
            createdAt: new Date().toISOString(),
            ...data,
          },
          ...state.notifications,
        ],
      })),

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),

      markAllAsRead: (userId) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.userId === userId ? { ...n, read: true } : n
        ),
      })),
    }),
    {
      name: 'proshnouttor-notifications',
    }
  )
);
