import { Expose } from 'class-transformer';

export class FlashSaleItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  variantId: string;

  @Expose()
  salePrice: number;

  @Expose()
  quantity: number;

  @Expose()
  sold: number;
}
