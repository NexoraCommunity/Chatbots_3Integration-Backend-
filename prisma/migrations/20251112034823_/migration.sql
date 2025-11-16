/*
  Warnings:

  - You are about to drop the column `filePath` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - You are about to drop the column `session` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionName]` on the table `WhatsaapWebSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `WhatsaapWebSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionName` to the `WhatsaapWebSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `WhatsaapWebSession_session_key` ON `whatsaapwebsession`;

-- AlterTable
ALTER TABLE `whatsaapwebsession` DROP COLUMN `filePath`,
    DROP COLUMN `session`,
    ADD COLUMN `data` LONGBLOB NOT NULL,
    ADD COLUMN `sessionName` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `WhatsaapWebSession_sessionName_key` ON `WhatsaapWebSession`(`sessionName`);
