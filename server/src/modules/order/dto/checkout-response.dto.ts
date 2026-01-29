import { Expose } from 'class-transformer';

export class CheckoutResponseDto {
  @Expose()
  orderId: string;

  @Expose()
  payUrl: string;
}
