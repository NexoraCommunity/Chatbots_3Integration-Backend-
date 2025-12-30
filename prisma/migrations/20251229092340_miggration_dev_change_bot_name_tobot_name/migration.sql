/*
  Warnings:

  - You are about to drop the column `bot_name` on the `bot` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `bot` table. All the data in the column will be lost.
  - Added the required column `botName` to the `BOT` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `BOT_is_active_idx` ON `bot`;

-- AlterTable
ALTER TABLE `bot` DROP COLUMN `bot_name`,
    DROP COLUMN `is_active`,
    ADD COLUMN `botName` VARCHAR(100) NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `BOT_isActive_idx` ON `BOT`(`isActive`);
