import { IsString } from 'class-validator';

export class CreateReplyCommentDto {
  @IsString()
  content: string;
}
