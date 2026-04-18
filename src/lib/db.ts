// =============================================================
//  src/lib/db.ts
//  Database access layer — thin wrappers around Prisma queries.
//
//  ⚠️  This file runs in Node.js only (server / scripts).
//      The Vite browser bundle never imports this directly.
//
//  Run first:
//    npx prisma generate
//    npx prisma migrate deploy   (or migrate dev locally)
// =============================================================

import prisma from './prisma'
import type { SortOrder } from './types'

// ────────────────────────────────────────────────────────────
//  USERS
// ────────────────────────────────────────────────────────────

/** Fetch a single user by id */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: { questions: true, answers: true },
      },
    },
  })
}

/** Fetch a single user by email */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

/** Top users by reputation */
export async function getTopUsers(limit = 5) {
  return prisma.user.findMany({
    orderBy: { reputation: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      reputation: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

/** Create a new user */
export async function createUser(data: {
  name: string
  email: string
  image?: string
}) {
  return prisma.user.create({ data })
}

// ────────────────────────────────────────────────────────────
//  QUESTIONS
// ────────────────────────────────────────────────────────────

/** Paginated list of questions with sort order */
export async function getQuestions({
  page = 1,
  pageSize = 10,
  sort = 'newest',
  tag,
  search,
}: {
  page?: number
  pageSize?: number
  sort?: SortOrder
  tag?: string
  search?: string
}) {
  const skip = (page - 1) * pageSize

  // Build `where` clause
  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(tag
      ? { tags: { some: { tag: { name: tag } } } }
      : {}),
  }

  // Build `orderBy` clause
  const orderBy = (() => {
    switch (sort) {
      case 'active':
        return { updatedAt: 'desc' as const }
      case 'hot':
        return { votes: 'desc' as const }
      case 'week':
      case 'month':
        return { createdAt: 'desc' as const }
      default: // newest
        return { createdAt: 'desc' as const }
    }
  })()

  const [data, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        user: {
          select: { id: true, name: true, image: true, reputation: true },
        },
        tags: { include: { tag: true } },
        _count: { select: { answers: true } },
      },
    }),
    prisma.question.count({ where }),
  ])

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/** Fetch a single question with all answers */
export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, reputation: true } },
      tags: { include: { tag: true } },
      answers: {
        include: {
          user: { select: { id: true, name: true, image: true, reputation: true } },
        },
        orderBy: [
          { isAccepted: 'desc' },
          { votes: 'desc' },
        ],
      },
      _count: { select: { answers: true } },
    },
  })
}

/** Create a question (with optional tag names) */
export async function createQuestion(data: {
  title: string
  description: string
  userId: string
  tagNames?: string[]
}) {
  const { title, description, userId, tagNames = [] } = data

  // Upsert tags and collect their ids
  const tagIds = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name: name.toLowerCase() },
        create: { name: name.toLowerCase() },
        update: {},
        select: { id: true },
      }),
    ),
  )

  return prisma.question.create({
    data: {
      title,
      description,
      userId,
      tags: {
        create: tagIds.map((t) => ({ tagId: t.id })),
      },
    },
    include: {
      user: true,
      tags: { include: { tag: true } },
    },
  })
}

/** Increment view count */
export async function incrementQuestionViews(id: string) {
  return prisma.question.update({
    where: { id },
    data: { views: { increment: 1 } },
  })
}

/** Vote on a question (+1 or -1) */
export async function voteQuestion(id: string, delta: 1 | -1) {
  return prisma.question.update({
    where: { id },
    data: { votes: { increment: delta } },
  })
}

// ────────────────────────────────────────────────────────────
//  ANSWERS
// ────────────────────────────────────────────────────────────

/** Create an answer */
export async function createAnswer(data: {
  content: string
  userId: string
  questionId: string
}) {
  return prisma.answer.create({
    data,
    include: {
      user: { select: { id: true, name: true, image: true, reputation: true } },
    },
  })
}

/** Accept an answer (un-accepts siblings automatically) */
export async function acceptAnswer(answerId: string, questionId: string) {
  return prisma.$transaction([
    // Clear previous accepted answer for this question
    prisma.answer.updateMany({
      where: { questionId, isAccepted: true },
      data: { isAccepted: false },
    }),
    // Mark the chosen answer as accepted
    prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    }),
  ])
}

/** Vote on an answer (+1 or -1) */
export async function voteAnswer(id: string, delta: 1 | -1) {
  return prisma.answer.update({
    where: { id },
    data: { votes: { increment: delta } },
  })
}

// ────────────────────────────────────────────────────────────
//  TAGS
// ────────────────────────────────────────────────────────────

/** All tags with question count, ordered by popularity */
export async function getTags(limit = 20) {
  return prisma.tag.findMany({
    take: limit,
    include: {
      _count: { select: { questions: true } },
    },
    orderBy: {
      questions: { _count: 'desc' },
    },
  })
}

/** Search tags by name */
export async function searchTags(query: string) {
  return prisma.tag.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    take: 10,
  })
}

// ────────────────────────────────────────────────────────────
//  ADMIN: PERMANENT DELETE OPERATIONS
// ────────────────────────────────────────────────────────────

/** Permanently delete a question and all its linked data.
 *  Schema has ON DELETE CASCADE on answers + QuestionTag rows. */
export async function deleteQuestion(id: string) {
  return prisma.question.delete({
    where: { id },
    include: {
      answers: { select: { id: true } },
      tags: { select: { id: true } },
    },
  })
}

/** Permanently delete a single answer */
export async function deleteAnswer(id: string) {
  return prisma.answer.delete({
    where: { id },
  })
}

/** Bulk delete questions */
export async function deleteManyQuestions(ids: string[]) {
  return prisma.question.deleteMany({
    where: { id: { in: ids } },
  })
}

/** Bulk delete answers */
export async function deleteManyAnswers(ids: string[]) {
  return prisma.answer.deleteMany({
    where: { id: { in: ids } },
  })
}

/** Permanently delete a user and all their content */
export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  })
}
