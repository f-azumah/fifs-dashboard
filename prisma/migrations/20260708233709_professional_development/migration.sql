-- CreateEnum
CREATE TYPE "OssPrStatus" AS ENUM ('NOT_STARTED', 'RESEARCHING_ISSUE', 'IN_PROGRESS', 'SUBMITTED', 'MERGED');

-- AlterEnum
ALTER TYPE "GoalCategory" ADD VALUE 'ENGINEERING_CREDIBILITY';

-- AlterEnum
ALTER TYPE "HabitCategory" ADD VALUE 'ENGINEERING_GROWTH';

-- CreateTable
CREATE TABLE "DepthLog" (
    "id" TEXT NOT NULL,
    "weekOf" TIMESTAMP(3) NOT NULL,
    "wentDeeper" TEXT,
    "explainableNow" TEXT,
    "ossPrStatus" "OssPrStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepthLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepthLog_weekOf_key" ON "DepthLog"("weekOf");
