/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `WhatsaapWebSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `WhatsaapWebSession_accountId_key` ON `WhatsaapWebSession`(`accountId`);
