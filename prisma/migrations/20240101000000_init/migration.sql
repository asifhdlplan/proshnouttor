-- =============================================================
--  Migration: 20240101000000_init
--  Proshnouttor — Initial Schema
--  Run via: npx prisma migrate deploy
-- =============================================================

-- ── CreateTable: users ────────────────────────────────────────
CREATE TABLE "users" (
    "id"         TEXT         NOT NULL,
    "name"       TEXT         NOT NULL,
    "email"      TEXT         NOT NULL,
    "image"      TEXT,
    "reputation" INTEGER      NOT NULL DEFAULT 1,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- ── CreateTable: questions ────────────────────────────────────
CREATE TABLE "questions" (
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "description" TEXT         NOT NULL,
    "votes"       INTEGER      NOT NULL DEFAULT 0,
    "views"       INTEGER      NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "userId"      TEXT         NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- ── CreateTable: answers ──────────────────────────────────────
CREATE TABLE "answers" (
    "id"         TEXT         NOT NULL,
    "content"    TEXT         NOT NULL,
    "votes"      INTEGER      NOT NULL DEFAULT 0,
    "isAccepted" BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    "userId"     TEXT         NOT NULL,
    "questionId" TEXT         NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- ── CreateTable: tags ─────────────────────────────────────────
CREATE TABLE "tags" (
    "id"        TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "color"     TEXT         NOT NULL DEFAULT '#6366f1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- ── CreateTable: question_tags ────────────────────────────────
CREATE TABLE "question_tags" (
    "questionId" TEXT NOT NULL,
    "tagId"      TEXT NOT NULL,

    CONSTRAINT "question_tags_pkey" PRIMARY KEY ("questionId","tagId")
);

-- ── CreateIndex: unique constraints ───────────────────────────
CREATE UNIQUE INDEX "users_email_key"     ON "users"("email");
CREATE UNIQUE INDEX "tags_name_key"       ON "tags"("name");

-- ── CreateIndex: performance indexes ──────────────────────────
CREATE INDEX "questions_userId_key"    ON "questions"("userId");
CREATE INDEX "questions_createdAt_key" ON "questions"("createdAt");
CREATE INDEX "answers_userId_key"      ON "answers"("userId");
CREATE INDEX "answers_questionId_key"  ON "answers"("questionId");

-- ── AddForeignKey: questions.userId → users.id ────────────────
ALTER TABLE "questions"
    ADD CONSTRAINT "questions_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ── AddForeignKey: answers.userId → users.id ──────────────────
ALTER TABLE "answers"
    ADD CONSTRAINT "answers_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ── AddForeignKey: answers.questionId → questions.id ──────────
ALTER TABLE "answers"
    ADD CONSTRAINT "answers_questionId_fkey"
    FOREIGN KEY ("questionId")
    REFERENCES "questions"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ── AddForeignKey: question_tags.questionId → questions.id ────
ALTER TABLE "question_tags"
    ADD CONSTRAINT "question_tags_questionId_fkey"
    FOREIGN KEY ("questionId")
    REFERENCES "questions"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ── AddForeignKey: question_tags.tagId → tags.id ─────────────
ALTER TABLE "question_tags"
    ADD CONSTRAINT "question_tags_tagId_fkey"
    FOREIGN KEY ("tagId")
    REFERENCES "tags"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
