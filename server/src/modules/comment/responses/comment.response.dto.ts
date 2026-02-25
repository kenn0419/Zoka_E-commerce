import { Expose } from 'class-transformer';
import { ProductVariantResponseDto } from 'src/modules/product/responses/product-variant.response.dto';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

export class CommentResponseDto {
  @Expose()
  id: string;

  @Expose()
  rating: number;

  @Expose()
  comment?: string;

  @Expose()
  imageUrls: string[];

  @Expose()
  buyer: UserResponseDto;

  @Expose()
  variant: ProductVariantResponseDto;

  @Expose()
  replyCount?: number;

  @Expose()
  createdAt: Date;
}
