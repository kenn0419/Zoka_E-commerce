import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AddressResponseDto } from 'src/modules/address/dto/address-repsonse.dto';
import { CheckoutPreviewShopResponseDto } from './checkout-preview-shop-response.dto';
import { CheckoutPreviewSummaryResponseDto } from './checkout-preview-summary.response.dto';
import { CheckoutPreviewCouponResponseDto } from './checkout-preview-coupon.response.dto';

export class CheckoutPreviewResponseDto {
  @Expose()
  @Type(() => CheckoutPreviewShopResponseDto)
  @ValidateNested({ each: true })
  shops: CheckoutPreviewShopResponseDto[];

  @Expose()
  @Type(() => CheckoutPreviewSummaryResponseDto)
  @ValidateNested({ each: true })
  summary: CheckoutPreviewSummaryResponseDto;

  @Expose()
  @Type(() => AddressResponseDto)
  @ValidateNested({ each: true })
  address: AddressResponseDto;

  @Expose()
  @Type(() => CheckoutPreviewCouponResponseDto)
  @ValidateNested({ each: true })
  coupons: CheckoutPreviewCouponResponseDto;
}
