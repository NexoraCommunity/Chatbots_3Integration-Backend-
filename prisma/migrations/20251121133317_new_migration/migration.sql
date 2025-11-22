/*
  Warnings:

  - You are about to drop the column `integrationType` on the `message` table. All the data in the column will be lost.
  - Added the required column `role` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `integrationType`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(100) NOT NULL;
