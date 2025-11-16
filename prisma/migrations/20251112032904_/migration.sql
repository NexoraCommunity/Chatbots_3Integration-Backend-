/*
  Warnings:

  - You are about to drop the column `data` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionName` on the `whatsaapwebsession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session]` on the table `WhatsaapWebSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filePath` to the `WhatsaapWebSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `WhatsaapWebSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `WhatsaapWebSession_sessionName_key` ON `whatsaapwebsession`;

-- AlterTable
ALTER TABLE `whatsaapwebsession` DROP COLUMN `data`,
    DROP COLUMN `sessionName`,
    ADD COLUMN `filePath` VARCHAR(191) NOT NULL,
    ADD COLUMN `session` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `WhatsaapWebSession_session_key` ON `WhatsaapWebSession`(`session`);
