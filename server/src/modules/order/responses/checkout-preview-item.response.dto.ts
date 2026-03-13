import { Expose, Type } from 'class-transformer';

export class CheckoutPreviewItemResponseDto {
  @Expose()
  productId: string;

  @Expose()
  productName: string;

  @Expose()
  variantId?: string;

  @Expose()
  variantName?: string;

  @Expose()
  imageUrl: string;

  @Expose()
  priceSnapshot: number;

  @Expose()
  quantity: number;

  @Expose()
  subtotal: number;
}
