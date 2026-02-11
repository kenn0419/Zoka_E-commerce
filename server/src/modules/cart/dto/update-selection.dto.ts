import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateSelectionDto {
  @Expose()
  @IsNotEmpty()
  @IsArray()
  cartItemIds: string[];
}
