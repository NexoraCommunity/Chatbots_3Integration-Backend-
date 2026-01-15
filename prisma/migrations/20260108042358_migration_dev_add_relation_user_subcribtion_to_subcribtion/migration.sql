/*
  Warnings:

  - Added the required column `subcribtionId` to the `UserSubcribtion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubcribtion" ADD COLUMN     "subcribtionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSubcribtion" ADD CONSTRAINT "UserSubcribtion_subcribtionId_fkey" FOREIGN KEY ("subcribtionId") REFERENCES "Subcribtion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
