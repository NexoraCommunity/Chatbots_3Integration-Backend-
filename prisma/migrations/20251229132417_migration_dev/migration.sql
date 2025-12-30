/*
  Warnings:

  - You are about to drop the column `promptId` on the `bot` table. All the data in the column will be lost.
  - Added the required column `agentId` to the `BOT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bot` DROP FOREIGN KEY `BOT_promptId_fkey`;

-- DropIndex
DROP INDEX `BOT_promptId_fkey` ON `bot`;

-- AlterTable
ALTER TABLE `bot` DROP COLUMN `promptId`,
    ADD COLUMN `agentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `BOT` ADD CONSTRAINT `BOT_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `Agent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
