-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('FINANCE', 'HEALTH', 'BUSINESS', 'PERSONAL');

-- CreateTable
CREATE TABLE "QuarterlyGoal" (
    "id" TEXT NOT NULL,
    "quarterOf" TIMESTAMP(3) NOT NULL,
    "category" "GoalCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuarterlyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuarterlyWin" (
    "id" TEXT NOT NULL,
    "quarterOf" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuarterlyWin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "coverUrl" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuarterlyGoal_quarterOf_idx" ON "QuarterlyGoal"("quarterOf");

-- CreateIndex
CREATE INDEX "QuarterlyWin_quarterOf_idx" ON "QuarterlyWin"("quarterOf");

-- CreateIndex
CREATE INDEX "BookLog_completedAt_idx" ON "BookLog"("completedAt");
