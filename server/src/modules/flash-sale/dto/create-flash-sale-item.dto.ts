import { IsUUID, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

export class CreateFlashSaleItemDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  variantId: string;

  @IsNumber()
  @IsPositive()
  originalPrice: number;

  @IsNumber()
  @IsPositive()
  salePrice: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
