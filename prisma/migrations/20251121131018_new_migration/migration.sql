/*
  Warnings:

  - You are about to drop the column `type` on the `message` table. All the data in the column will be lost.
  - Added the required column `integrationType` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `type`,
    ADD COLUMN `integrationType` VARCHAR(100) NOT NULL;
