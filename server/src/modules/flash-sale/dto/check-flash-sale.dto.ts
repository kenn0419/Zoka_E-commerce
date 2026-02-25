import { IsUUID, IsNumber, Min } from 'class-validator';

export class CheckFlashSaleDto {
  @IsUUID()
  variantId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
