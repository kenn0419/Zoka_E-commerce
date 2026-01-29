import { Expose } from 'class-transformer';

export class MessageResponseDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;

  @Expose()
  sender: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };

  @Expose()
  content: string;

  @Expose()
  isRead: boolean;

  @Expose()
  readAt?: string;

  @Expose()
  createdAt: string;
}
