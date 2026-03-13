import { Expose, Type } from 'class-transformer';
import { CommentStatus } from 'src/common/enums/comment.enum';
import { ProductListResponseDto } from 'src/modules/product/responses/product-list-item.response.dto';
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
  @Type(() => ProductListResponseDto)
  product: ProductListResponseDto;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  variant: ProductVariantResponseDto;

  @Expose()
  status?: CommentStatus;

  @Expose()
  replyCount?: number;

  @Expose()
  createdAt: Date;
}
