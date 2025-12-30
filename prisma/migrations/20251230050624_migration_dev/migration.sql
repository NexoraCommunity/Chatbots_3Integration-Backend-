/*
  Warnings:

  - You are about to drop the column `isconneted` on the `userintegration` table. All the data in the column will be lost.
  - Added the required column `isconnected` to the `UserIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userintegration` DROP COLUMN `isconneted`,
    ADD COLUMN `isconnected` BOOLEAN NOT NULL;
