-- CreateTable
CREATE TABLE `WhatsaapWebSession` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(255) NOT NULL,
    `sessionId` VARCHAR(255) NOT NULL,
    `clientId` VARCHAR(255) NOT NULL,
    `data` LONGTEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
