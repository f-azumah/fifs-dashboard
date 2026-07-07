-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('READING', 'PAUSED', 'COMPLETED');

-- AlterTable
ALTER TABLE "CurrentlyReading" ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "status" "ReadingStatus" NOT NULL DEFAULT 'READING';
