import { Expose, Type } from 'class-transformer';
import { FlashSaleItemResponseDto } from './flash-sale-item.response.dto';

export class FlashSaleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  status: string;

  @Expose()
  maxPerUser?: number;

  @Expose()
  @Type(() => FlashSaleItemResponseDto)
  items: FlashSaleItemResponseDto[];

  @Expose()
  createdAt: Date;
}
