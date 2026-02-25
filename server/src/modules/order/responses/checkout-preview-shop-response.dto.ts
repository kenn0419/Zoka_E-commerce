import { Expose, Type } from 'class-transformer';
import { CheckoutPreviewItemResponseDto } from './checkout-preview-item.response.dto';

export class CheckoutPreviewShopResponseDto {
  @Expose()
  shopId: string;

  @Expose()
  shopName: string;

  @Expose()
  @Type(() => CheckoutPreviewItemResponseDto)
  items: CheckoutPreviewItemResponseDto[];

  @Expose()
  subtotal: number;

  @Expose()
  shippingFee: number;

  @Expose()
  discount: number;

  @Expose()
  total: number;
}
