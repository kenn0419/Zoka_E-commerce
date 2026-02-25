/*
  Warnings:

  - The `status` column on the `FlashSale` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FlashSaleItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[flashSaleId,variantId]` on the table `FlashSaleItem` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `FlashSaleItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `originalPrice` to the `FlashSaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `FlashSaleItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlashSaleStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'ENDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "FlashSale" DROP COLUMN "status",
ADD COLUMN     "status" "FlashSaleStatus" NOT NULL DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "FlashSaleItem" DROP CONSTRAINT "FlashSaleItem_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "originalPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "variantId" TEXT NOT NULL,
ADD CONSTRAINT "FlashSaleItem_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ShopFollower" (
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopFollower_pkey" PRIMARY KEY ("shopId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopFollower_shopId_userId_key" ON "ShopFollower"("shopId", "userId");

-- CreateIndex
CREATE INDEX "FlashSaleItem_variantId_idx" ON "FlashSaleItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "FlashSaleItem_flashSaleId_variantId_key" ON "FlashSaleItem"("flashSaleId", "variantId");

-- AddForeignKey
ALTER TABLE "ShopFollower" ADD CONSTRAINT "ShopFollower_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopFollower" ADD CONSTRAINT "ShopFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashSaleItem" ADD CONSTRAINT "FlashSaleItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
