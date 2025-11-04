-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `bot` DROP FOREIGN KEY `BOT_llmId_fkey`;

-- DropForeignKey
ALTER TABLE `bot` DROP FOREIGN KEY `BOT_promptId_fkey`;

-- DropForeignKey
ALTER TABLE `bot` DROP FOREIGN KEY `BOT_userId_fkey`;

-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `Conversation_botId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `numberphone` DROP FOREIGN KEY `NumberPhone_whatsaapBussinessAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `prompt` DROP FOREIGN KEY `Prompt_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userotp` DROP FOREIGN KEY `UserOTP_userId_fkey`;

-- DropForeignKey
ALTER TABLE `whatsaapbussinessaccount` DROP FOREIGN KEY `WhatsaapBussinessAccount_userId_fkey`;

-- DropIndex
DROP INDEX `Account_userId_fkey` ON `account`;

-- DropIndex
DROP INDEX `BOT_llmId_fkey` ON `bot`;

-- DropIndex
DROP INDEX `BOT_promptId_fkey` ON `bot`;

-- DropIndex
DROP INDEX `BOT_userId_fkey` ON `bot`;

-- DropIndex
DROP INDEX `Conversation_botId_fkey` ON `conversation`;

-- DropIndex
DROP INDEX `Message_conversationId_fkey` ON `message`;

-- DropIndex
DROP INDEX `NumberPhone_whatsaapBussinessAccountId_fkey` ON `numberphone`;

-- DropIndex
DROP INDEX `Prompt_userId_fkey` ON `prompt`;

-- DropIndex
DROP INDEX `UserOTP_userId_fkey` ON `userotp`;

-- DropIndex
DROP INDEX `WhatsaapBussinessAccount_userId_fkey` ON `whatsaapbussinessaccount`;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WhatsaapBussinessAccount` ADD CONSTRAINT `WhatsaapBussinessAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NumberPhone` ADD CONSTRAINT `NumberPhone_whatsaapBussinessAccountId_fkey` FOREIGN KEY (`whatsaapBussinessAccountId`) REFERENCES `WhatsaapBussinessAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOTP` ADD CONSTRAINT `UserOTP_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prompt` ADD CONSTRAINT `Prompt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BOT` ADD CONSTRAINT `BOT_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BOT` ADD CONSTRAINT `BOT_promptId_fkey` FOREIGN KEY (`promptId`) REFERENCES `Prompt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BOT` ADD CONSTRAINT `BOT_llmId_fkey` FOREIGN KEY (`llmId`) REFERENCES `LargeLanguageModel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_botId_fkey` FOREIGN KEY (`botId`) REFERENCES `BOT`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
