-- CreateEnum
CREATE TYPE "DsaConfidence" AS ENUM ('SHAKY', 'GETTING_THERE', 'SOLID');

-- CreateTable
CREATE TABLE "DsaLogEntry" (
    "id" TEXT NOT NULL,
    "patternFocus" TEXT NOT NULL,
    "problemsSolved" INTEGER,
    "stuckOn" TEXT,
    "confidence" "DsaConfidence",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DsaLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DsaLogEntry_createdAt_idx" ON "DsaLogEntry"("createdAt");
