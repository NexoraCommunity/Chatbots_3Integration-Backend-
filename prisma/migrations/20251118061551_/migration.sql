/*
  Warnings:

  - Made the column `type` on table `message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `sentiment` VARCHAR(191) NOT NULL DEFAULT 'neutral',
    MODIFY `type` VARCHAR(50) NOT NULL;
