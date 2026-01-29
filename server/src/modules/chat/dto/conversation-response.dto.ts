import { Expose } from 'class-transformer';

export class ConversationResponse {
  @Expose()
  id: string;

  @Expose()
  partner: {
    id: string;
    fullName: string;
    avatarUrl: string;
  };

  @Expose()
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  };

  @Expose()
  unreadCount: number;

  @Expose()
  updatedAt: Date;
}
