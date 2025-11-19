/*
  Warnings:

  - You are about to drop the column `dataType` on the `bot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bot` DROP COLUMN `dataType`,
    ADD COLUMN `data` VARCHAR(191) NULL;
