-- AlterTable
ALTER TABLE `bot` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `prompt` MODIFY `prompt` LONGTEXT NOT NULL;
