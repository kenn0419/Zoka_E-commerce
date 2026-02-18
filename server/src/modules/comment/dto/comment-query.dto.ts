import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { CommentSort } from 'src/common/enums/comment.enum';

export class CommentQueryDto extends PaginatedQueryDto<CommentSort> {
  @IsEnum(CommentSort)
  @IsOptional()
  sort?: CommentSort = CommentSort.NEWEST;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}
