export class ConversationMapper {
  static toConversationResponse(conversation, currentUserId) {
    const partner =
      conversation.buyer.id === currentUserId
        ? conversation.seller
        : conversation.buyer;

    const lastMessage = conversation.messages[0];

    return {
      id: conversation.id,
      partner: {
        id: partner.id,
        fullName: partner.fullName,
        avatarUrl: partner.avatarUrl,
      },
      lastMessage: lastMessage
        ? {
            id: lastMessage.id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            createdAt: lastMessage.createdAt,
          }
        : undefined,
      unreadCount: conversation._count?.messages ?? 0,
      updatedAt: conversation.updatedAt,
    };
  }
}
