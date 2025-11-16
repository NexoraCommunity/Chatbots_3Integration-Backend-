/*
  Warnings:

  - The primary key for the `whatsappkeys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `whatsappkeys` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `type` on the `whatsappkeys` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `sessionId` on the `whatsappkeys` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `whatsappsession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `whatsappsession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `whatsappkeys` DROP FOREIGN KEY `WhatsappKeys_sessionId_fkey`;

-- AlterTable
ALTER TABLE `whatsappkeys` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `sessionId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`sessionId`, `id`, `type`);

-- AlterTable
ALTER TABLE `whatsappsession` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
