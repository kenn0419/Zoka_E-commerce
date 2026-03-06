interface IProductVariantResponse {
  id: string;
  productId: string;
  name: string;
  originalPrice: number;
  displayPrice: number;
  stock: number;
  isFlashSale: boolean;
  images: IVariantImage[];
  createdAt: Date;
  updatedAt: Date;
}
