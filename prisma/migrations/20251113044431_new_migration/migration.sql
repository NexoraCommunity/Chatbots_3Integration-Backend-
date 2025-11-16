/*
  Warnings:

  - Added the required column `updatedAt` to the `WhatsappKeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WhatsappSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `whatsappkeys` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `value` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `whatsappsession` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `data` LONGTEXT NOT NULL;
