/*
  Warnings:

  - Added the required column `llm` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prompt` ADD COLUMN `llm` VARCHAR(100) NOT NULL;
