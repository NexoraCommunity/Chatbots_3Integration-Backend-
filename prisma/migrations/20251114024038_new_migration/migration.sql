/*
  Warnings:

  - You are about to drop the column `llmId` on the `bot` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `bot` table. All the data in the column will be lost.
  - Added the required column `bot_name` to the `BOT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bot` DROP COLUMN `llmId`,
    DROP COLUMN `name`,
    ADD COLUMN `bot_name` VARCHAR(100) NOT NULL;
