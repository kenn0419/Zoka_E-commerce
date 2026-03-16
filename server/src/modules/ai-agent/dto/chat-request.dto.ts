import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsOptional()
  history?: any[];
}
