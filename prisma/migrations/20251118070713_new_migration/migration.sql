/*
  Warnings:

  - Made the column `room` on table `conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `conversation` MODIFY `room` VARCHAR(100) NOT NULL;
