import { IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  content?: string;
}
