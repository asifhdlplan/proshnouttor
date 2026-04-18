// =============================================================
//  src/lib/prisma.ts
//  Prisma Client Singleton
//
//  NOTE: Run `npx prisma generate` once after cloning so that
//  @prisma/client types are generated into node_modules.
//
//  Prevents multiple PrismaClient instances during hot-reload
//  in development (the global caching pattern).
//
//  Usage (server / Node context only):
//    import { prisma } from '@/lib/prisma'
//    const users = await prisma.user.findMany()
// =============================================================

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

type PrismaClientType = InstanceType<typeof PrismaClient>

// Extend the Node.js global type to hold the cached client
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClientType | undefined
}

// ── Singleton factory ─────────────────────────────────────────
function createPrismaClient(): PrismaClientType {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  }) as PrismaClientType
}

// In production always create a fresh client.
// In development reuse the global instance across HMR reloads.
export const prisma: PrismaClientType =
  globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export default prisma
