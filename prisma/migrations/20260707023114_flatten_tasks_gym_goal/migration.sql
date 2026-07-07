/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `reflection` on the `WeeklyReflection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dayOfWeek";

-- AlterTable
ALTER TABLE "WeeklyReflection" DROP COLUMN "reflection";

-- CreateTable
CREATE TABLE "GymSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "weeklyTarget" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "GymSettings_pkey" PRIMARY KEY ("id")
);
