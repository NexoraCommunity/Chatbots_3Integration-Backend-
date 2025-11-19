/*
  Warnings:

  - Added the required column `IntegrationType` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `IntegrationType` VARCHAR(100) NOT NULL;
