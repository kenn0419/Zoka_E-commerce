import { Expose, Type } from 'class-transformer';
import { ProductListResponseDto } from '../../product/responses/product-list-item.response.dto';
import { ProductVariantResponseDto } from '../../product/responses/product-variant.response.dto';

export class FlashSaleItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  variantId: string;

  @Expose()
  @Type(() => ProductListResponseDto)
  product: ProductListResponseDto;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  variant: ProductVariantResponseDto;

  @Expose()
  salePrice: number;

  @Expose()
  quantity: number;

  @Expose()
  sold: number;
}
