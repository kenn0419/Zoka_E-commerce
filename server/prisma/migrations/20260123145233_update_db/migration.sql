-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shopCategoryId" TEXT;

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "refreshToken" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shopCategoryId_fkey" FOREIGN KEY ("shopCategoryId") REFERENCES "ShopCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
