/*
  Warnings:

  - You are about to drop the column `userId` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_userId_fkey`;

-- DropIndex
DROP INDEX `Category_userId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `productvariant` ADD COLUMN `image` VARCHAR(500) NULL;
