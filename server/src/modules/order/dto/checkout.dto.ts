import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment.enum';

export class CheckoutDto {
  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
