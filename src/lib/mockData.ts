// =============================================================
//  src/lib/mockData.ts
//  Browser-safe mock data — mirrors exactly what Prisma returns.
//  Used by the UI components when no API layer is available.
//  Matches the seed data in prisma/seed.ts.
// =============================================================

import type { User, Tag, Question, Answer, Announcement } from './types'

// ── Users ─────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: 'user_alice',
    name: 'Alice Rahman',
    email: 'alice@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=alice',
    reputation: 4820,
    banned: false,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user_bob',
    name: 'Bob Karim',
    email: 'bob@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=bob',
    reputation: 3140,
    banned: false,
    createdAt: '2023-03-10T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user_clara',
    name: 'Clara Singh',
    email: 'clara@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=clara',
    reputation: 2560,
    banned: false,
    createdAt: '2023-06-20T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user_dawood',
    name: 'Dawood Hossain',
    email: 'dawood@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=dawood',
    reputation: 1890,
    banned: false,
    createdAt: '2023-08-05T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user_eva',
    name: 'Eva Chen',
    email: 'eva@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=eva',
    reputation: 975,
    banned: false,
    createdAt: '2023-10-12T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user_farhan',
    name: 'Farhan Malik',
    email: 'farhan@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=farhan',
    reputation: 520,
    banned: true,
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'user_gita',
    name: 'Gita Patel',
    email: 'gita@proshnouttor.com',
    image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=gita',
    reputation: 340,
    banned: false,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
]

// ── Tags ──────────────────────────────────────────────────────
export const MOCK_TAGS: (Tag & { _count: { questions: number } })[] = [
  { id: 'tag_js',   name: 'javascript', color: '#f7df1e', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 128 } },
  { id: 'tag_react',name: 'react',      color: '#61dafb', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 95  } },
  { id: 'tag_ts',   name: 'typescript', color: '#3178c6', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 87  } },
  { id: 'tag_node', name: 'node.js',    color: '#339933', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 74  } },
  { id: 'tag_pg',   name: 'postgresql', color: '#336791', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 61  } },
  { id: 'tag_prm',  name: 'prisma',     color: '#2d3748', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 43  } },
  { id: 'tag_tw',   name: 'tailwind',   color: '#38bdf8', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 38  } },
  { id: 'tag_next', name: 'next.js',    color: '#6366f1', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 33  } },
  { id: 'tag_css',  name: 'css',        color: '#264de4', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 29  } },
  { id: 'tag_py',   name: 'python',     color: '#3572A5', createdAt: '2023-01-01T00:00:00Z', _count: { questions: 21  } },
]

// ── Answers ───────────────────────────────────────────────────
export const MOCK_ANSWERS: Answer[] = [
  {
    id: 'ans_1a',
    content: `Great question! Here's the standard workflow:\n\n**1. \`prisma generate\`** — Generates the TypeScript client from your schema.prisma. Run this every time you change the schema.\n\n**2. \`prisma migrate dev\`** — Creates a migration SQL file AND runs generate automatically. Use this during development.\n\nFor the singleton pattern in src/lib/prisma.ts:\n\`\`\`ts\nimport { PrismaClient } from '@prisma/client'\nconst globalForPrisma = globalThis as { prisma?: PrismaClient }\nexport const prisma = globalForPrisma.prisma ?? new PrismaClient()\nif (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma\n\`\`\`\n\nFor production connection pooling, use **PgBouncer** or Prisma Accelerate.`,
    userId: 'user_alice',
    questionId: 'q_1',
    votes: 38,
    isAccepted: true,
    createdAt: '2024-03-22T10:00:00Z',
    updatedAt: '2024-03-22T10:00:00Z',
    user: MOCK_USERS[0],
  },
  {
    id: 'ans_1b',
    content: `Adding to Alice's answer — if you're on Vercel or serverless, set \`connection_limit=1\` in your DATABASE_URL:\n\`\`\`\npostgresql://user:pass@host/db?connection_limit=1&pool_timeout=0\n\`\`\`\nThis prevents connection exhaustion on serverless functions.`,
    userId: 'user_bob',
    questionId: 'q_1',
    votes: 14,
    isAccepted: false,
    createdAt: '2024-03-23T08:00:00Z',
    updatedAt: '2024-03-23T08:00:00Z',
    user: MOCK_USERS[1],
  },
  {
    id: 'ans_2a',
    content: `The mental model I use:\n\n- **useState** — independent pieces of state, simple updates\n- **useReducer** — when state values depend on each other or transitions are complex\n\nYour 8-field form is a perfect useReducer candidate:\n✅ One place for all form logic\n✅ Easy to unit-test the reducer\n✅ Clear action names (FIELD_CHANGE, SUBMIT_START, etc.)`,
    userId: 'user_alice',
    questionId: 'q_2',
    votes: 52,
    isAccepted: true,
    createdAt: '2024-03-26T12:00:00Z',
    updatedAt: '2024-03-26T12:00:00Z',
    user: MOCK_USERS[0],
  },
  {
    id: 'ans_3a',
    content: `The \`as Promise<T>\` cast is technically unsafe. The gold standard is **Zod**:\n\n\`\`\`ts\nimport { z } from 'zod'\nasync function api<T>(url: string, schema: z.ZodType<T>): Promise<T> {\n  const res = await fetch(url)\n  const json = await res.json()\n  return schema.parse(json) // throws ZodError on mismatch\n}\n\`\`\`\n\nThis gives you compile-time AND runtime safety.`,
    userId: 'user_clara',
    questionId: 'q_3',
    votes: 44,
    isAccepted: true,
    createdAt: '2024-03-28T14:00:00Z',
    updatedAt: '2024-03-28T14:00:00Z',
    user: MOCK_USERS[2],
  },
]

// ── Questions ─────────────────────────────────────────────────
export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q_1',
    title: 'How do I use Prisma with PostgreSQL in a Node.js project?',
    description: "I'm setting up a new Node.js project and want to use Prisma as my ORM with PostgreSQL. I've installed prisma and @prisma/client but I'm confused about the workflow: when do I run prisma generate vs prisma migrate dev? How do I handle the client singleton pattern properly? Are there any gotchas with connection pooling in production?",
    userId: 'user_eva',
    votes: 42,
    views: 1230,
    createdAt: '2024-03-21T09:00:00Z',
    updatedAt: '2024-03-23T08:00:00Z',
    user: MOCK_USERS[4],
    tags: [
      { tag: MOCK_TAGS[5] }, // prisma
      { tag: MOCK_TAGS[4] }, // postgresql
      { tag: MOCK_TAGS[3] }, // node.js
    ],
    answers: [MOCK_ANSWERS[0], MOCK_ANSWERS[1]],
    _count: { answers: 2 },
  },
  {
    id: 'q_2',
    title: 'React useState vs useReducer — when to use which?',
    description: "I keep going back and forth on this. I have a form with about 8 fields plus validation state and submission state. When does it make sense to switch from useState to useReducer? Is there a rule of thumb or a clear boundary?",
    userId: 'user_dawood',
    votes: 87,
    views: 3410,
    createdAt: '2024-03-26T11:00:00Z',
    updatedAt: '2024-03-27T09:00:00Z',
    user: MOCK_USERS[3],
    tags: [
      { tag: MOCK_TAGS[1] }, // react
      { tag: MOCK_TAGS[0] }, // javascript
      { tag: MOCK_TAGS[2] }, // typescript
    ],
    answers: [MOCK_ANSWERS[2]],
    _count: { answers: 2 },
  },
  {
    id: 'q_3',
    title: 'TypeScript: How to type a generic fetch wrapper correctly?',
    description: "I'm writing a utility function that wraps fetch and returns typed JSON. Is casting with as safe? Are there better patterns like using Zod for runtime validation?",
    userId: 'user_bob',
    votes: 65,
    views: 2870,
    createdAt: '2024-03-28T13:00:00Z',
    updatedAt: '2024-03-28T15:00:00Z',
    user: MOCK_USERS[1],
    tags: [
      { tag: MOCK_TAGS[2] }, // typescript
      { tag: MOCK_TAGS[0] }, // javascript
    ],
    answers: [MOCK_ANSWERS[3]],
    _count: { answers: 1 },
  },
  {
    id: 'q_4',
    title: 'Tailwind CSS v4 — how is it different from v3?',
    description: "I see Tailwind v4 is out. What are the biggest changes before migrating? Specifically around config files, JIT, and the new @theme directive.",
    userId: 'user_clara',
    votes: 34,
    views: 1540,
    createdAt: '2024-03-29T10:00:00Z',
    updatedAt: '2024-03-29T10:00:00Z',
    user: MOCK_USERS[2],
    tags: [
      { tag: MOCK_TAGS[6] }, // tailwind
      { tag: MOCK_TAGS[8] }, // css
    ],
    answers: [],
    _count: { answers: 1 },
  },
  {
    id: 'q_5',
    title: 'Next.js App Router: Server Components vs Client Components confusion',
    description: "I'm migrating a Next.js pages/ app to the App Router. I'm confused about when a component must be \"use client\". Can a Server Component render a Client Component? How do I pass server data down without prop drilling?",
    userId: 'user_alice',
    votes: 120,
    views: 5600,
    createdAt: '2024-03-30T08:00:00Z',
    updatedAt: '2024-03-30T10:00:00Z',
    user: MOCK_USERS[0],
    tags: [
      { tag: MOCK_TAGS[7] }, // next.js
      { tag: MOCK_TAGS[1] }, // react
      { tag: MOCK_TAGS[2] }, // typescript
    ],
    answers: [],
    _count: { answers: 2 },
  },
]

// ── Announcements ─────────────────────────────────────────────
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Welcome to Proshnouttor!',
    body: 'We are excited to launch our new Q&A platform. Start asking and answering questions today. Join our growing community of developers!',
    type: 'success',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ann_2',
    title: 'Scheduled Maintenance',
    body: 'The platform will undergo maintenance on Jan 15th from 2-4 AM UTC. Expect brief downtime during this window.',
    type: 'warning',
    active: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'ann_3',
    title: 'New Feature: Dark Mode',
    body: 'You can now switch between multiple themes including dark mode. Visit Theme Settings to customize your experience.',
    type: 'info',
    active: false,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
]

// ── Platform stats ────────────────────────────────────────────
export const MOCK_STATS = {
  questions: 1_284,
  answers:   3_917,
  users:     892,
  tags:      147,
}
