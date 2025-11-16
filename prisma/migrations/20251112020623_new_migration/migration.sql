/*
  Warnings:

  - The primary key for the `whatsaapwebsession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountId` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `whatsaapwebsession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[sessionName]` on the table `WhatsaapWebSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionName` to the `WhatsaapWebSession` table without a default value. This is not possible if the table is not empty.
  - Made the column `data` on table `whatsaapwebsession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `WhatsaapWebSession_accountId_key` ON `whatsaapwebsession`;

-- AlterTable
ALTER TABLE `whatsaapwebsession` DROP PRIMARY KEY,
    DROP COLUMN `accountId`,
    DROP COLUMN `clientId`,
    DROP COLUMN `sessionId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sessionName` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `data` LONGBLOB NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `WhatsaapWebSession_sessionName_key` ON `WhatsaapWebSession`(`sessionName`);
