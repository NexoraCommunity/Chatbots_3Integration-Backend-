/*
  Warnings:

  - You are about to drop the column `vectoreProcess` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "vectoreProcess",
ADD COLUMN     "vectoreStatus" TEXT NOT NULL DEFAULT 'Processing';
