/*
  Warnings:

  - A unique constraint covering the columns `[orderItemId]` on the table `ProductReview` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ProductReview_productId_buyerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_orderItemId_key" ON "ProductReview"("orderItemId");
