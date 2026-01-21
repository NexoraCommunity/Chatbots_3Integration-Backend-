/*
  Warnings:

  - Added the required column `sender` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "sender" VARCHAR(225) NOT NULL;
