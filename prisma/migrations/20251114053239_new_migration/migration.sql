/*
  Warnings:

  - The primary key for the `whatsappkeys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `type` on table `bot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `bot` ADD COLUMN `dataType` VARCHAR(191) NULL,
    MODIFY `type` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `whatsappkeys` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`sessionId`, `id`, `type`);
