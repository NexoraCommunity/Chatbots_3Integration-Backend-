/*
  Warnings:

  - Changed the type of `durationDays` on the `Subcribtion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Subcribtion" DROP COLUMN "durationDays",
ADD COLUMN     "durationDays" INTEGER NOT NULL;
