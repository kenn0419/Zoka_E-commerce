interface IMessageResponse {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
