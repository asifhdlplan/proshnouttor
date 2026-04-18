# Proshnouttor — Q&A Platform

A modern Stack Overflow–style Q&A platform built with **React + Vite + Tailwind CSS**, backed by **PostgreSQL + Prisma ORM**.

---

## 🗂 Project Structure

```
proshnouttor/
├── prisma/
│   ├── schema.prisma          # Prisma schema (User, Question, Answer, Tag)
│   ├── seed.ts                # DB seed script (realistic demo data)
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20240101000000_init/
│           └── migration.sql  # Initial SQL migration
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Top nav: Logo + Search + Ask + Login
│   │   ├── LeftSidebar.tsx    # Nav: Home, Categories, Tags, etc.
│   │   ├── MainContent.tsx    # Question list + Ask modal
│   │   └── RightSidebar.tsx   # Trending tags + Top users
│   ├── lib/
│   │   ├── prisma.ts          # PrismaClient singleton
│   │   ├── db.ts              # DB access layer (queries)
│   │   ├── types.ts           # Shared TypeScript types
│   │   └── mockData.ts        # Browser-safe mock data (mirrors DB)
│   ├── App.tsx
│   └── main.tsx
├── .env                       # Local env (DATABASE_URL)
├── .env.example               # Template for env vars
└── package.json
```

---

## 🗄 Database Schema

### User
| Column     | Type    | Notes              |
|------------|---------|--------------------|
| id         | String  | cuid(), PK         |
| name       | String  |                    |
| email      | String  | unique             |
| image      | String? | avatar URL         |
| reputation | Int     | default 1          |
| createdAt  | DateTime|                    |
| updatedAt  | DateTime|                    |

### Question
| Column      | Type     | Notes            |
|-------------|----------|------------------|
| id          | String   | cuid(), PK       |
| title       | String   |                  |
| description | String   |                  |
| votes       | Int      | default 0        |
| views       | Int      | default 0        |
| userId      | String   | FK → User        |
| createdAt   | DateTime |                  |
| updatedAt   | DateTime |                  |

### Answer
| Column     | Type    | Notes             |
|------------|---------|-------------------|
| id         | String  | cuid(), PK        |
| content    | String  |                   |
| votes      | Int     | default 0         |
| isAccepted | Boolean | default false     |
| userId     | String  | FK → User         |
| questionId | String  | FK → Question     |
| createdAt  | DateTime|                   |
| updatedAt  | DateTime|                   |

### Tag + QuestionTag (many-to-many join)

---

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js ≥ 18
- PostgreSQL 14+ running locally

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env — set your DATABASE_URL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/proshnouttor"
```

### 4. Create the PostgreSQL database
```sql
-- In psql or pgAdmin:
CREATE DATABASE proshnouttor;
```

### 5. Run migrations
```bash
# Option A — development (creates migration files + generates client)
npx prisma migrate dev --name init

# Option B — apply existing migrations only
npx prisma migrate deploy
```

### 6. Generate Prisma client
```bash
npx prisma generate
```

### 7. Seed the database
```bash
npx tsx prisma/seed.ts
# or:
npx prisma db seed
```

### 8. Start dev server
```bash
npm run dev
```

### 9. Open Prisma Studio (optional GUI)
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🚀 Available Scripts

| Command                        | Description                    |
|-------------------------------|--------------------------------|
| `npm run dev`                  | Start Vite dev server          |
| `npm run build`                | Production build               |
| `npx prisma migrate dev`       | Create + apply new migration   |
| `npx prisma migrate deploy`    | Apply migrations (CI/prod)     |
| `npx prisma generate`          | Regenerate Prisma client       |
| `npx prisma studio`            | Open Prisma GUI                |
| `npx tsx prisma/seed.ts`       | Seed database with demo data   |
| `npx prisma migrate reset`     | Reset DB + re-seed (dev only)  |

---

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4
- **ORM**: Prisma v6
- **Database**: PostgreSQL 14+
- **Icons**: Lucide React

---

## 📝 Notes

- `src/lib/prisma.ts` — Prisma singleton (prevents multiple connections in HMR)
- `src/lib/db.ts` — All DB queries live here; never import Prisma in UI components
- `src/lib/mockData.ts` — Browser-safe data that mirrors the Prisma schema exactly
- The UI uses `mockData.ts` since Prisma cannot run in the browser bundle
- Connect a real API layer (Express / tRPC / Next.js API routes) to use `db.ts` from the server
