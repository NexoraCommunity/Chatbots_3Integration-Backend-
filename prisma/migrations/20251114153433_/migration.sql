/*
  Warnings:

  - The primary key for the `whatsappkeys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `whatsappsession` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `whatsappkeys` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    MODIFY `type` VARCHAR(255) NOT NULL,
    MODIFY `sessionId` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`sessionId`, `id`, `type`);

-- AlterTable
ALTER TABLE `whatsappsession` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `WhatsappKeys` ADD CONSTRAINT `WhatsappKeys_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `WhatsappSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
