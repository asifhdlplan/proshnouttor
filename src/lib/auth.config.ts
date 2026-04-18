// =============================================================
//  src/lib/auth.config.ts
//  NextAuth.js v5 configuration (ready for Next.js migration).
//  Providers: Google OAuth + Email/Password (Credentials).
//
//  To activate in a Next.js project:
//    1. npm install next-auth @auth/prisma-adapter bcryptjs
//    2. Set env vars (see .env.example)
//    3. Create app/api/auth/[...nextauth]/route.ts
//    4. Wrap layout.tsx with <SessionProvider>
// =============================================================

/**
 * NEXTAUTH ENVIRONMENT VARIABLES REQUIRED:
 *
 * NEXTAUTH_URL=http://localhost:3000
 * NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
 *
 * GOOGLE_CLIENT_ID=<from Google Cloud Console>
 * GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
 *
 * EMAIL_SERVER_HOST=smtp.gmail.com
 * EMAIL_SERVER_PORT=587
 * EMAIL_SERVER_USER=your@gmail.com
 * EMAIL_SERVER_PASSWORD=<app password>
 * EMAIL_FROM=noreply@proshnouttor.com
 *
 * DATABASE_URL=postgresql://user:password@localhost:5432/proshnouttor
 */

// ── Pseudo-config (cannot import next-auth in Vite) ───────────
// This file documents the NextAuth config structure.
// In a real Next.js project, this would be:
//
// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import EmailProvider from 'next-auth/providers/email'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import { prisma } from './prisma'
// import bcrypt from 'bcryptjs'
//
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: 'jwt' },
//   pages: {
//     signIn: '/auth/signin',
//     error:  '/auth/error',
//   },
//   providers: [
//     // ── Google OAuth ──────────────────────────────────────
//     GoogleProvider({
//       clientId:     process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       profile(profile) {
//         return {
//           id:         profile.sub,
//           name:       profile.name,
//           email:      profile.email,
//           image:      profile.picture,
//           reputation: 1,
//         };
//       },
//     }),
//
//     // ── Magic-link Email ──────────────────────────────────
//     EmailProvider({
//       server: {
//         host:   process.env.EMAIL_SERVER_HOST,
//         port:   Number(process.env.EMAIL_SERVER_PORT),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER,
//           pass: process.env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM,
//     }),
//
//     // ── Email + Password (Credentials) ────────────────────
//     CredentialsProvider({
//       name: 'Email & Password',
//       credentials: {
//         email:    { label: 'Email',    type: 'email'    },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email as string },
//         });
//         if (!user || !user.password) return null;
//
//         const valid = await bcrypt.compare(
//           credentials.password as string,
//           user.password
//         );
//         if (!valid) return null;
//
//         return {
//           id:         user.id,
//           name:       user.name,
//           email:      user.email,
//           image:      user.image,
//           reputation: user.reputation,
//         };
//       },
//     }),
//   ],
//
//   callbacks: {
//     // Attach custom fields to JWT
//     async jwt({ token, user }) {
//       if (user) {
//         token.id         = user.id;
//         token.reputation = (user as any).reputation ?? 1;
//       }
//       return token;
//     },
//
//     // Expose custom fields in session
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id         = token.id as string;
//         session.user.reputation = token.reputation as number;
//       }
//       return session;
//     },
//
//     // Upsert user in DB on OAuth sign-in
//     async signIn({ user, account }) {
//       if (account?.provider === 'google') {
//         await prisma.user.upsert({
//           where:  { email: user.email! },
//           create: {
//             name:       user.name!,
//             email:      user.email!,
//             image:      user.image,
//             reputation: 1,
//           },
//           update: {
//             name:  user.name!,
//             image: user.image,
//           },
//         });
//       }
//       return true;
//     },
//   },
// });

// ── Type augmentation for session ─────────────────────────────
// In next-auth.d.ts:
//
// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id:         string;
//       name:       string;
//       email:      string;
//       image?:     string | null;
//       reputation: number;
//     };
//   }
//   interface User {
//     reputation: number;
//   }
// }

export {};
