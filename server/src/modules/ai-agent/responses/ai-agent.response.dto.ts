import { Expose } from 'class-transformer';

export class AiAgentResponseDto {
  @Expose()
  message: string;

  @Expose()
  data: any;
}
