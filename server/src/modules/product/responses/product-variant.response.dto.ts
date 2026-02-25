import { Expose, Type } from 'class-transformer';
import { VariantImageResponseDto } from '../../cart/responses/variant-image.response.dto';

export class ProductVariantResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  originalPrice: number;

  @Expose()
  displayPrice: number;

  @Expose()
  isFlashSale: boolean;

  @Expose()
  stock: number;

  @Expose()
  @Type(() => VariantImageResponseDto)
  images: VariantImageResponseDto[];
}
