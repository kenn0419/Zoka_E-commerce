import { Expose } from 'class-transformer';

export class CartItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  variantId: string;

  @Expose()
  productName: string;

  @Expose()
  variantName: string;

  @Expose()
  imageUrl: string;

  @Expose()
  displayPrice: number;

  @Expose()
  quantity: number;

  @Expose()
  availableStock: number;

  @Expose()
  subtotal: number;

  @Expose()
  isAvailable: boolean;

  @Expose()
  isSelected: boolean;
}
