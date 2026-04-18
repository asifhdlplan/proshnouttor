// =============================================================
//  src/lib/types.ts
//  Shared TypeScript types mirroring the Prisma schema.
//  Used across the UI (no Prisma import needed in browser code).
// =============================================================

// ── User ──────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  reputation: number
  banned?: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

// ── Tag ───────────────────────────────────────────────────────
export interface Tag {
  id: string
  name: string
  color: string
  createdAt: Date | string
}

// ── Question ──────────────────────────────────────────────────
export interface Question {
  id: string
  title: string
  description: string
  votes: number
  views: number
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
  user?: User
  answers?: Answer[]
  tags?: { tag: Tag }[]
  _count?: {
    answers: number
  }
}

// ── Answer ────────────────────────────────────────────────────
export interface Answer {
  id: string
  content: string
  votes: number
  isAccepted: boolean
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
  questionId: string
  user?: User
}

// ── Announcement ──────────────────────────────────────────────
export type AnnouncementType = 'info' | 'warning' | 'success' | 'urgent'

export interface Announcement {
  id: string
  title: string
  body: string
  type: AnnouncementType
  active: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

// ── API response wrappers ─────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type SortOrder = 'newest' | 'active' | 'hot' | 'week' | 'month'
