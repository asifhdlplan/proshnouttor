// =============================================================
//  prisma/seed.ts
//  Seed script — populates DB with realistic demo data
//
//  Run via:
//    npx tsx prisma/seed.ts
//  or add to package.json:
//    "prisma": { "seed": "npx tsx prisma/seed.ts" }
//  then: npx prisma db seed
// =============================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['warn', 'error'] })

// ─── Helpers ──────────────────────────────────────────────────
function ago(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

// ─── Seed data ────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding database …')

  // ── Wipe existing data (dev only) ──────────────────────────
  await prisma.questionTag.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()
  console.log('   ✓ Cleared old data')

  // ── Tags ───────────────────────────────────────────────────
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'javascript', color: '#f7df1e' } }),
    prisma.tag.create({ data: { name: 'react',      color: '#61dafb' } }),
    prisma.tag.create({ data: { name: 'typescript', color: '#3178c6' } }),
    prisma.tag.create({ data: { name: 'node.js',    color: '#339933' } }),
    prisma.tag.create({ data: { name: 'postgresql', color: '#336791' } }),
    prisma.tag.create({ data: { name: 'prisma',     color: '#2d3748' } }),
    prisma.tag.create({ data: { name: 'tailwind',   color: '#38bdf8' } }),
    prisma.tag.create({ data: { name: 'next.js',    color: '#000000' } }),
    prisma.tag.create({ data: { name: 'css',        color: '#264de4' } }),
    prisma.tag.create({ data: { name: 'python',     color: '#3572A5' } }),
  ])
  console.log(`   ✓ Created ${tags.length} tags`)

  // Map tag name → object for easy lookup
  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t]))

  // ── Users ──────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name:       'Alice Rahman',
        email:      'alice@proshnouttor.com',
        image:      'https://api.dicebear.com/8.x/avataaars/svg?seed=alice',
        reputation: 4_820,
        createdAt:  ago(365),
        updatedAt:  ago(1),
      },
    }),
    prisma.user.create({
      data: {
        name:       'Bob Karim',
        email:      'bob@proshnouttor.com',
        image:      'https://api.dicebear.com/8.x/avataaars/svg?seed=bob',
        reputation: 3_140,
        createdAt:  ago(300),
        updatedAt:  ago(2),
      },
    }),
    prisma.user.create({
      data: {
        name:       'Clara Singh',
        email:      'clara@proshnouttor.com',
        image:      'https://api.dicebear.com/8.x/avataaars/svg?seed=clara',
        reputation: 2_560,
        createdAt:  ago(200),
        updatedAt:  ago(3),
      },
    }),
    prisma.user.create({
      data: {
        name:       'Dawood Hossain',
        email:      'dawood@proshnouttor.com',
        image:      'https://api.dicebear.com/8.x/avataaars/svg?seed=dawood',
        reputation: 1_890,
        createdAt:  ago(150),
        updatedAt:  ago(5),
      },
    }),
    prisma.user.create({
      data: {
        name:       'Eva Chen',
        email:      'eva@proshnouttor.com',
        image:      'https://api.dicebear.com/8.x/avataaars/svg?seed=eva',
        reputation: 975,
        createdAt:  ago(90),
        updatedAt:  ago(1),
      },
    }),
  ])
  console.log(`   ✓ Created ${users.length} users`)

  const [alice, bob, clara, dawood, eva] = users

  // ── Questions + Answers ────────────────────────────────────
  const questionsData = [
    {
      title:       'How do I use Prisma with PostgreSQL in a Node.js project?',
      description: `I'm setting up a new Node.js project and want to use Prisma as my ORM with PostgreSQL.\n\nI've installed \`prisma\` and \`@prisma/client\` but I'm confused about the workflow:\n1. When do I run \`prisma generate\` vs \`prisma migrate dev\`?\n2. How do I handle the client singleton pattern properly?\n3. Are there any gotchas with connection pooling in production?\n\nAny guidance or links to working examples would be appreciated!`,
      userId:      eva.id,
      votes:       42,
      views:       1_230,
      createdAt:   ago(10),
      tagNames:    ['prisma', 'postgresql', 'node.js'],
      answers: [
        {
          content:    `Great question! Here's the standard workflow:\n\n**1. \`prisma generate\`** — Generates the TypeScript client from your \`schema.prisma\`. Run this every time you change the schema.\n\n**2. \`prisma migrate dev\`** — Creates a migration SQL file AND runs \`prisma generate\` automatically. Use this during development.\n\nFor the singleton pattern:\n\`\`\`ts\nimport { PrismaClient } from '@prisma/client'\nconst globalForPrisma = globalThis as unknown as { prisma: PrismaClient }\nexport const prisma = globalForPrisma.prisma ?? new PrismaClient()\nif (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma\n\`\`\`\n\nFor production connection pooling, use **PgBouncer** or Prisma Accelerate.`,
          userId:     alice.id,
          votes:      38,
          isAccepted: true,
          createdAt:  ago(9),
        },
        {
          content:    `Adding to Alice's answer — if you're on Vercel or serverless, set \`connection_limit=1\` in your DATABASE_URL:\n\`postgresql://user:pass@host/db?connection_limit=1&pool_timeout=0\`\n\nThis prevents connection exhaustion on serverless functions.`,
          userId:     bob.id,
          votes:      14,
          isAccepted: false,
          createdAt:  ago(8),
        },
      ],
    },
    {
      title:       'React useState vs useReducer — when to use which?',
      description: `I keep going back and forth on this. I have a form with about 8 fields plus validation state and submission state. When does it make sense to switch from \`useState\` to \`useReducer\`?\n\nIs there a rule of thumb or a clear boundary?`,
      userId:      dawood.id,
      votes:       87,
      views:       3_410,
      createdAt:   ago(5),
      tagNames:    ['react', 'javascript', 'typescript'],
      answers: [
        {
          content:    `The mental model I use:\n\n- **useState** — independent pieces of state, simple updates\n- **useReducer** — state values that depend on each other, complex transitions, or when the next state depends on the previous state in non-trivial ways\n\nYour 8-field form sounds like a perfect \`useReducer\` candidate. You get:\n✅ One place for all form logic\n✅ Easy to unit-test the reducer\n✅ Clear action names (FIELD_CHANGE, SUBMIT_START, SUBMIT_SUCCESS, etc.)\n\nDan Abramov's rule: *"If you find yourself writing \`setSomething(s => ...s, field: value)\` you should probably use useReducer."*`,
          userId:     alice.id,
          votes:      52,
          isAccepted: true,
          createdAt:  ago(4),
        },
        {
          content:    `Also worth considering **Zustand** or **Jotai** for cross-component form state. For fully local form state, \`react-hook-form\` handles the complexity for you and is very performant (uncontrolled inputs by default).`,
          userId:     clara.id,
          votes:      21,
          isAccepted: false,
          createdAt:  ago(3),
        },
      ],
    },
    {
      title:       'TypeScript: How to type a generic fetch wrapper correctly?',
      description: `I'm writing a utility function that wraps \`fetch\` and returns typed JSON. Here's what I have:\n\n\`\`\`ts\nasync function api<T>(url: string): Promise<T> {\n  const res = await fetch(url)\n  return res.json() as Promise<T>\n}\`\`\`\n\nIs casting with \`as\` safe here? Are there better patterns like using Zod for runtime validation?`,
      userId:      bob.id,
      votes:       65,
      views:       2_870,
      createdAt:   ago(3),
      tagNames:    ['typescript', 'javascript'],
      answers: [
        {
          content:    `The \`as Promise<T>\` cast is technically unsafe — TypeScript trusts you but the runtime data could be anything. The gold standard is **Zod**:\n\n\`\`\`ts\nimport { z } from 'zod'\n\nasync function api<T>(url: string, schema: z.ZodType<T>): Promise<T> {\n  const res = await fetch(url)\n  const json = await res.json()\n  return schema.parse(json) // throws on mismatch\n}\n\`\`\`\n\nThis gives you compile-time AND runtime safety. The cost is minimal for most use cases.`,
          userId:     clara.id,
          votes:      44,
          isAccepted: true,
          createdAt:  ago(2),
        },
      ],
    },
    {
      title:       'Tailwind CSS v4 — how is it different from v3?',
      description: `I see Tailwind v4 is out. What are the biggest changes I should know about before migrating? Specifically around config files, JIT, and the new \`@theme\` directive.`,
      userId:      clara.id,
      votes:       34,
      views:       1_540,
      createdAt:   ago(2),
      tagNames:    ['tailwind', 'css'],
      answers: [
        {
          content:    `Key changes in Tailwind v4:\n\n1. **No more \`tailwind.config.js\`** — config lives in CSS via \`@theme { --color-brand: oklch(...) }\`\n2. **Vite plugin** — use \`@tailwindcss/vite\` instead of PostCSS in most setups\n3. **CSS-first** — \`@import "tailwindcss"\` replaces the \`@tailwind base/components/utilities\` directives\n4. **Lightning CSS** — built-in, so no separate autoprefixer needed\n5. **Automatic content detection** — no more \`content: []\` array in most projects\n\nOverall much faster cold starts and a cleaner DX.`,
          userId:     bob.id,
          votes:      28,
          isAccepted: true,
          createdAt:  ago(1),
        },
      ],
    },
    {
      title:       'Next.js App Router: Server Components vs Client Components confusion',
      description: `I'm migrating a Next.js 13 pages/ app to the App Router. I'm confused about when a component must be \`"use client"\`.\n\nSpecifically:\n- If a Server Component renders a Client Component, can the Client Component accept Server Component children?\n- How do I pass server data to a client component without prop drilling?`,
      userId:      alice.id,
      votes:       120,
      views:       5_600,
      createdAt:   ago(1),
      tagNames:    ['next.js', 'react', 'typescript'],
      answers: [
        {
          content:    `This trips everyone up! Key mental model:\n\n**Server Component → Client Component** ✅ Pass as \`children\` prop or regular props (must be serializable)\n**Client Component → Server Component** ❌ Not directly — but you can pass a Server Component as \`children\` to a Client Component!\n\n\`\`\`tsx\n// layout.tsx (Server)\nimport { ClientShell } from './ClientShell'\nexport default function Layout({ children }) {\n  return <ClientShell>{children}</ClientShell>\n}\n\`\`\`\n\nFor data: fetch in a Server Component, pass serializable props down, or use React Context inside a Client boundary.`,
          userId:     dawood.id,
          votes:      88,
          isAccepted: true,
          createdAt:  ago(20),
        },
        {
          content:    `Also check out the \`server-only\` package to guard against accidentally importing server code in client bundles — it throws a build-time error which is super helpful.`,
          userId:     eva.id,
          votes:      31,
          isAccepted: false,
          createdAt:  ago(18),
        },
      ],
    },
  ]

  let qCount = 0
  let aCount = 0

  for (const qData of questionsData) {
    const { answers: answerData, tagNames, ...questionFields } = qData

    // Upsert tags
    const tagIds = await Promise.all(
      tagNames.map((name) =>
        prisma.tag.upsert({
          where: { name },
          create: { name, color: tagMap[name]?.color ?? '#6366f1' },
          update: {},
          select: { id: true },
        }),
      ),
    )

    const question = await prisma.question.create({
      data: {
        ...questionFields,
        updatedAt: questionFields.createdAt,
        tags: { create: tagIds.map((t) => ({ tagId: t.id })) },
      },
    })
    qCount++

    // Create answers
    for (const ans of answerData) {
      await prisma.answer.create({
        data: {
          ...ans,
          questionId: question.id,
          updatedAt: ans.createdAt,
        },
      })
      aCount++
    }
  }

  console.log(`   ✓ Created ${qCount} questions`)
  console.log(`   ✓ Created ${aCount} answers`)
  console.log('🎉  Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
