import { Expose, Type } from 'class-transformer';
import { ProductListResponseDto } from './product-list-item.response.dto';
import { ProductVariantResponseDto } from './product-variant.response.dto';
import { CategoryResponseDto } from 'src/modules/category/responses/category.response.dto';
import { ShopResponseDto } from 'src/modules/shop/dto/shop-response.dto';

export class ProductDetailResponseDto extends ProductListResponseDto {
  @Expose()
  @Type(() => ProductVariantResponseDto)
  variants: ProductVariantResponseDto[];

  @Expose()
  description: string;

  @Expose()
  sold: number;

  @Expose()
  category: CategoryResponseDto;

  @Expose()
  shop: ShopResponseDto;
}
