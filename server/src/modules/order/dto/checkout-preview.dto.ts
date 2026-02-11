import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutPreviewDto {
  @IsNotEmpty()
  @IsString()
  paymentMethod: 'COD' | 'MOMO';

  @IsOptional()
  @IsString()
  couponCode?: string;
}
