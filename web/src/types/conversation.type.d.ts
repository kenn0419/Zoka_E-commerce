interface IConversationResponse {
  id: string;

  partner: {
    id: string;
    fullName: string;
    avatarUrl: string;
  };

  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  };

  unreadCount: number;

  updatedAt: string;
}
