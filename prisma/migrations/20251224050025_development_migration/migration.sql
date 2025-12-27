/*
  Warnings:

  - Added the required column `filePath` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prompt` ADD COLUMN `filePath` VARCHAR(191) NOT NULL;
