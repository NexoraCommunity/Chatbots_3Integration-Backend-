/*
  Warnings:

  - You are about to drop the column `type` on the `userintegration` table. All the data in the column will be lost.
  - Added the required column `name` to the `UserIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userintegration` DROP COLUMN `type`,
    ADD COLUMN `name` VARCHAR(50) NOT NULL;
