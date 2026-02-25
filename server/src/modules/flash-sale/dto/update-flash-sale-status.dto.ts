import { IsEnum } from 'class-validator';
import { FlashSaleStatus } from 'generated/prisma';

export class UpdateFlashSaleStatusDto {
  @IsEnum(FlashSaleStatus)
  status: FlashSaleStatus;
}
