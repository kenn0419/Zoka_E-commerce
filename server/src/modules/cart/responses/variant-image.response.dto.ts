import { Expose } from 'class-transformer';

export class VariantImageResponseDto {
  @Expose()
  id: string;

  @Expose()
  imageUrl: string;
}
