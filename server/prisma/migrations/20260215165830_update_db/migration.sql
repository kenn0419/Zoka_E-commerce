/*
  Warnings:

  - You are about to drop the column `comment` on the `ProductReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductReview" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT;
