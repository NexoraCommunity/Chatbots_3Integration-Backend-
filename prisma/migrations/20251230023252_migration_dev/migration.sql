/*
  Warnings:

  - Made the column `filePath` on table `agent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `agent` MODIFY `dataTrain` LONGTEXT NULL,
    MODIFY `filePath` VARCHAR(200) NOT NULL;
