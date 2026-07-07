-- CreateEnum
CREATE TYPE "FailureMode" AS ENUM ('INERTIA', 'MIND_BODY_GAP', 'TECHNICAL_WALL', 'PLANNING_FATIGUE');

-- AlterTable
ALTER TABLE "WeeklyReflection" ADD COLUMN     "didShip" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "failureMode" "FailureMode",
ADD COLUMN     "hoursSpent" DOUBLE PRECISION,
ADD COLUMN     "notShipped" TEXT,
ADD COLUMN     "shipped" TEXT;

-- CreateTable
CREATE TABLE "WeeklyGoal" (
    "id" TEXT NOT NULL,
    "weekOf" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GymSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCheckIn" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentlyReading" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT,
    "author" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentlyReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklyGoal_weekOf_idx" ON "WeeklyGoal"("weekOf");

-- CreateIndex
CREATE UNIQUE INDEX "GymSession_date_key" ON "GymSession"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckIn_date_key" ON "DailyCheckIn"("date");
