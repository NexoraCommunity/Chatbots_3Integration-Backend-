/*
  Warnings:

  - Added the required column `type` to the `UserIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userintegration` ADD COLUMN `type` VARCHAR(50) NOT NULL;
