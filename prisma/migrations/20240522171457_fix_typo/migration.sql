/*
  Warnings:

  - You are about to drop the column `profieImage` on the `UserProfiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfiles" DROP COLUMN "profieImage",
ADD COLUMN     "profileImage" TEXT DEFAULT '';
