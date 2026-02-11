/*
  Warnings:

  - You are about to drop the column `phone` on the `Address` table. All the data in the column will be lost.
  - Added the required column `receiverphone` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "phone",
ADD COLUMN     "receiverphone" TEXT NOT NULL;
