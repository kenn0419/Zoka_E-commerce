/*
  Warnings:

  - Added the required column `expiresAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;
