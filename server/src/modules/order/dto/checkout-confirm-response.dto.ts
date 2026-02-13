import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CheckoutConfirmResponseDto {
  @Expose()
  @IsOptional()
  paymentId?: string;

  @Expose()
  orderIds: string[];

  @Expose()
  @IsOptional()
  payUrl?: string;
}
