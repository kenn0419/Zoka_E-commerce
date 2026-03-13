import { Expose, Type } from 'class-transformer';
import { CartItemResponseDto } from './cart-item.response.dto';

export class CartShopResponseDto {
  @Expose()
  shopId: string;

  @Expose()
  shopName: string;

  @Expose()
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];
}
