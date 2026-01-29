import { IsEnum } from 'class-validator';
import { ShopStatus } from 'src/common/enums/shop.enum';

export class UpdateShopStatusDto {
  @IsEnum(ShopStatus)
  status: ShopStatus;
}
