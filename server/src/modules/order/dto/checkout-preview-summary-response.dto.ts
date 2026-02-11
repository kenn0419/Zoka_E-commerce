import { Expose } from 'class-transformer';

export class CheckoutPreviewSummaryResponseDto {
  @Expose()
  subtotal: number;

  @Expose()
  shippingFee: number;

  @Expose()
  discount: number;

  @Expose()
  total: number;
}
