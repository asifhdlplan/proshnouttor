// =============================================================
//  src/lib/adminDataStore.ts
//  Zustand store for admin content management.
//  Wraps mock data arrays with reactive CRUD operations.
//  In production, these would call API endpoints that use
//  the real Prisma delete functions from db.ts.
// =============================================================

import { create } from 'zustand';
import { MOCK_QUESTIONS, MOCK_ANSWERS, MOCK_USERS } from './mockData';
import type { Question, Answer, User } from './types';

interface AdminDataState {
  // ── Data ──
  questions: Question[];
  answers: Answer[];
  users: User[];

  // ── Question actions ──
  deleteQuestion: (id: string) => boolean;
  getQuestionCount: () => number;

  // ── Answer actions ──
  deleteAnswer: (id: string) => boolean;
  getAnswerCount: () => number;

  // ── User actions ──
  deleteUser: (id: string) => boolean;
  banUser: (id: string) => boolean;
  unbanUser: (id: string) => boolean;
  getUserCount: () => number;
  getBannedCount: () => number;

  // ── Bulk actions ──
  deleteMultipleQuestions: (ids: string[]) => number;
  deleteMultipleAnswers: (ids: string[]) => number;
  deleteMultipleUsers: (ids: string[]) => number;
  banMultipleUsers: (ids: string[]) => number;
  unbanMultipleUsers: (ids: string[]) => number;
}

export const useAdminDataStore = create<AdminDataState>((set, get) => ({
  // ── Initialise from mock data (deep clone to avoid mutation) ──
  questions: JSON.parse(JSON.stringify(MOCK_QUESTIONS)),
  answers: JSON.parse(JSON.stringify(MOCK_ANSWERS)),
  users: JSON.parse(JSON.stringify(MOCK_USERS)),

  // ── Delete a single question permanently ──
  deleteQuestion: (id: string) => {
    const prev = get().questions;
    const exists = prev.some((q) => q.id === id);
    if (!exists) return false;

    const orphanedAnswerIds = get()
      .answers.filter((a) => a.questionId === id)
      .map((a) => a.id);

    set({
      questions: prev.filter((q) => q.id !== id),
      answers: get().answers.filter((a) => a.questionId !== id),
    });

    console.log(
      `[AdminDB] Deleted question ${id} + ${orphanedAnswerIds.length} linked answers`
    );
    return true;
  },

  getQuestionCount: () => get().questions.length,

  // ── Delete a single answer permanently ──
  deleteAnswer: (id: string) => {
    const prev = get().answers;
    const exists = prev.some((a) => a.id === id);
    if (!exists) return false;

    set({ answers: prev.filter((a) => a.id !== id) });

    console.log(`[AdminDB] Deleted answer ${id}`);
    return true;
  },

  getAnswerCount: () => get().answers.length,

  // ── Delete a single user permanently ──
  deleteUser: (id: string) => {
    const prev = get().users;
    const exists = prev.some((u) => u.id === id);
    if (!exists) return false;

    // Cascade: remove user's questions and answers
    const userQuestionIds = new Set(
      get().questions.filter((q) => q.userId === id).map((q) => q.id)
    );

    set({
      users: prev.filter((u) => u.id !== id),
      questions: get().questions.filter((q) => q.userId !== id),
      answers: get().answers.filter(
        (a) => a.userId !== id && !userQuestionIds.has(a.questionId)
      ),
    });

    console.log(
      `[AdminDB] Deleted user ${id} + ${userQuestionIds.size} questions + linked answers`
    );
    return true;
  },

  // ── Ban a user ──
  banUser: (id: string) => {
    const prev = get().users;
    const user = prev.find((u) => u.id === id);
    if (!user || user.banned) return false;

    set({
      users: prev.map((u) => (u.id === id ? { ...u, banned: true } : u)),
    });

    console.log(`[AdminDB] Banned user ${id} (${user.name})`);
    return true;
  },

  // ── Unban a user ──
  unbanUser: (id: string) => {
    const prev = get().users;
    const user = prev.find((u) => u.id === id);
    if (!user || !user.banned) return false;

    set({
      users: prev.map((u) => (u.id === id ? { ...u, banned: false } : u)),
    });

    console.log(`[AdminDB] Unbanned user ${id} (${user.name})`);
    return true;
  },

  getUserCount: () => get().users.length,
  getBannedCount: () => get().users.filter((u) => u.banned).length,

  // ── Bulk delete questions ──
  deleteMultipleQuestions: (ids: string[]) => {
    const idSet = new Set(ids);
    let count = 0;
    set((state) => {
      const before = state.questions.length;
      const filtered = state.questions.filter((q) => !idSet.has(q.id));
      count = before - filtered.length;
      return {
        questions: filtered,
        answers: state.answers.filter((a) => !idSet.has(a.questionId)),
      };
    });
    return count;
  },

  // ── Bulk delete answers ──
  deleteMultipleAnswers: (ids: string[]) => {
    const idSet = new Set(ids);
    let count = 0;
    set((state) => {
      const before = state.answers.length;
      const filtered = state.answers.filter((a) => !idSet.has(a.id));
      count = before - filtered.length;
      return { answers: filtered };
    });
    return count;
  },

  // ── Bulk delete users ──
  deleteMultipleUsers: (ids: string[]) => {
    const idSet = new Set(ids);
    let count = 0;
    set((state) => {
      const before = state.users.length;
      const filteredUsers = state.users.filter((u) => !idSet.has(u.id));
      count = before - filteredUsers.length;
      // Cascade: remove linked questions + answers
      const filteredQuestions = state.questions.filter((q) => !idSet.has(q.userId));
      const remainingQIds = new Set(filteredQuestions.map((q) => q.id));
      const filteredAnswers = state.answers.filter(
        (a) => !idSet.has(a.userId) && remainingQIds.has(a.questionId)
      );
      return {
        users: filteredUsers,
        questions: filteredQuestions,
        answers: filteredAnswers,
      };
    });
    return count;
  },

  // ── Bulk ban users ──
  banMultipleUsers: (ids: string[]) => {
    const idSet = new Set(ids);
    let count = 0;
    set((state) => {
      const updated = state.users.map((u) => {
        if (idSet.has(u.id) && !u.banned) {
          count++;
          return { ...u, banned: true };
        }
        return u;
      });
      return { users: updated };
    });
    return count;
  },

  // ── Bulk unban users ──
  unbanMultipleUsers: (ids: string[]) => {
    const idSet = new Set(ids);
    let count = 0;
    set((state) => {
      const updated = state.users.map((u) => {
        if (idSet.has(u.id) && u.banned) {
          count++;
          return { ...u, banned: false };
        }
        return u;
      });
      return { users: updated };
    });
    return count;
  },
}));
