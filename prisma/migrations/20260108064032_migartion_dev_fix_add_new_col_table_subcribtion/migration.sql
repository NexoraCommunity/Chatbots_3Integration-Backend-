/*
  Warnings:

  - Added the required column `priorityNumber` to the `Subcribtion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subcribtion" ADD COLUMN     "priorityNumber" INTEGER NOT NULL;
