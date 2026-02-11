import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
