import {
  IsString,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFlashSaleItemDto } from './create-flash-sale-item.dto';

export class CreateFlashSaleDto {
  @IsString()
  name: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxPerUser?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleItemDto)
  @ArrayMinSize(1)
  items: CreateFlashSaleItemDto[];
}
