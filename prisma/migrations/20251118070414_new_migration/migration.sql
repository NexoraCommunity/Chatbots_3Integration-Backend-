/*
  Warnings:

  - You are about to drop the column `IntegrationType` on the `conversation` table. All the data in the column will be lost.
  - Added the required column `integrationType` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `IntegrationType`,
    ADD COLUMN `integrationType` VARCHAR(100) NOT NULL;
