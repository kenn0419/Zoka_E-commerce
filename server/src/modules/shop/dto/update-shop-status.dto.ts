import { IsEnum } from 'class-validator';
import { ShopStatus } from 'generated/prisma';

export class UpdateShopStatusDto {
  @IsEnum(ShopStatus)
  status: ShopStatus;
}
