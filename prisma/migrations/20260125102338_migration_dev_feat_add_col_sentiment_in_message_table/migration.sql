/*
  Warnings:

  - You are about to drop the `AgentProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sentiment` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AgentProduct" DROP CONSTRAINT "AgentProduct_agentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AgentProduct" DROP CONSTRAINT "AgentProduct_productId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sentiment" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AgentProduct";
