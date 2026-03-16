import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsOptional()
  conversationId?: string;

  @IsUUID()
  @IsOptional()
  receiverId?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

