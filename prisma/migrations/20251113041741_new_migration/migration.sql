/*
  Warnings:

  - You are about to drop the `whatsaapwebsession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `whatsaapwebsession`;

-- CreateTable
CREATE TABLE `WhatsappSession` (
    `id` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhatsappKeys` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
