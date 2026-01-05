/*
  Warnings:

  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Agent" DROP CONSTRAINT "Agent_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AgentProduct" DROP CONSTRAINT "AgentProduct_agentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BOT" DROP CONSTRAINT "BOT_agentId_fkey";

-- DropTable
DROP TABLE "public"."Agent";

-- CreateTable
CREATE TABLE "UserAgent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "llm" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "agent" VARCHAR(100) NOT NULL,
    "apiKey" TEXT NOT NULL,
    "prompt" TEXT,
    "filePath" TEXT NOT NULL,
    "productIds" TEXT[],
    "vectoreStatus" TEXT NOT NULL DEFAULT 'Processing',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAgent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAgent_userId_idx" ON "UserAgent"("userId");

-- AddForeignKey
ALTER TABLE "UserAgent" ADD CONSTRAINT "UserAgent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentProduct" ADD CONSTRAINT "AgentProduct_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "UserAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOT" ADD CONSTRAINT "BOT_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "UserAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
