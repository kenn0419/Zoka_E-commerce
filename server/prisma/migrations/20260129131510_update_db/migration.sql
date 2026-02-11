/*
  Warnings:

  - Added the required column `shippingFee` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingFee" DECIMAL(65,30) NOT NULL;
